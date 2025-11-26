var a = new Vue({
    el: '#application',
    data: {
        email: null,
        password: null,
        errorMessage: null,
        // 0 = Not Signed In
        // 1 = User
        // 2 = Admin
        signedInState: 1,
        userCredentials: {
            username: null,
            privilege: null
        },
        page: 'login'
        // viewID: PUT YOUR VIEW ID HERE
    },
    computed: {
        _checkAuthorisationLevel: function () {
            let self = this;
            return self.userCredentials.privilege == 1 ? 'User' : 'Admin';
        }
    },
    methods: {
        changePage: function (_to) {
            let self = this;
            self.page = _to;
        },
        // controls the login for the website
        logIn: async function (_loginState = 'serverLogin') {
            let self = this;
            // This is for a temporary login, because you wont have the db set up on your pc by default
            if (_loginState == 'jsLogin') {
                // credentials login
                if (self.email == 'admin@admin.com') {
                    if (self.password == 'password') {
                        // On a successful login, set the username and privilege variables (self.userCredentials.username and self.userCredentials.privilege) to whatever the API returns
                        self.signedInState = 2;
                        self.changePage('Admin');
                        self.userCredentials.username = 'AdministratorOne';
                        self.userCredentials.privilege = 2;
                        self.errorMessage = null;
                    } else {
                        self.signedInState = 0;
                        self.changePage('login');
                        self.errorMessage = "Incorrect Password";
                    }
                } else if (self.email == 'user@admin.com') {
                    if (self.password == 'password1') {
                        self.changePage('User');
                        self.userCredentials.username = 'UserOne';
                        self.userCredentials.privilege = 1;
                        // On a successful login, set the username and privilege variables (self.userCredentials.username and self.userCredentials.privilege) to whatever the API returns
                        self.signedInState = 1;
                        self.errorMessage = null;
                    } else {
                        self.signedInState = 0;
                        self.changePage('login');
                        self.errorMessage = "Incorrect Password";
                    }
                } else {
                    self.signedInState = 0;
                    self.changePage('login');
                    self.errorMessage = "Incorrect Username";
                }
                // Actual serverside login
            } else {
                // Send API Call to sign in user, this returns true or false in the data with an OK: 1
                let loginData = await self.sendLoginDetails(self.email, self.password);
                if (loginData.OK == 1) {
                    if (loginData.Data.signInSuccessful == true) {
                        switch (loginData.Data.credentials.privilege) {
                            case "User":
                                self.userCredentials.privilege = 1;
                                self.changePage('User');
                                break;
                            case "Admin":
                                self.userCredentials.privilege = 2;
                                self.changePage('Admin');
                                break;
                            default:
                                self.userCredentials.privilege = 0;
                                break;
                        }
                        self.userCredentials.username = loginData.Data.credentials.username;
                    } else {
                        self.errorMessage = loginData.Data.errorMessage;
                    }

                }
            }
        },
        sendLoginDetails: function (_email, _password) {
            // Promise
            return new Promise((resolve, reject) => {
                // HttpRequest
                $.ajax({
                    url: "URL TO PHP FILE",
                    type: "POST",
                    dataType: "json",
                    // The parameters requested by the API
                    data: {
                        email: _email,
                        password: _password
                    },
                    // On Success
                    success: function (data) {
                        // Returns the data received back to the promise call
                        resolve(data);
                    },
                    // On Error
                    error: function (jqXHR, textStatus, errorThrown) {
                        // Logs the result
                        console.log(jqXHR);
                        // Returns the error received back to the promise call
                        reject(jqXHR);
                    }
                });
            })
        },
        logout: function () {
            let self = this;
            self.signedInState = 0;
            self.changePage('login');
            // self.userCredentials.username = null;
            // self.userCredentials.privilege = null;
            self.email = null;
            self.password = null;
            self.errorMessage = null;
            // Send API call to sign out user
        }
    }
})