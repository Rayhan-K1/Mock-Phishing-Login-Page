<?php
// Gets around the CORS Policy Blockage
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
// Variable pulls the parameters from the URL
$email = isset($_POST['email']) ? $_POST['email'] : null;
$password = isset($_POST['password']) ? $_POST['password'] : null;
// Server connection details
$server = "SERVER NAME";
// Database entry details
$connectionInfo = array("Database" => "DB NAME",
    "UID" => "UNIVERSAL USER USERNAME",
    "PWD" => "UNIVERSAL USER PASSWORD",
    "ReturnDatesAsStrings" => true);
$link = sqlsrv_connect($server, $connectionInfo);
// If the connection fails
if ($link === false) {
    // End everything and print the error
    die(print_r(sqlsrv_errors(), true));
}
// Call the Stored Procedure
$sqlQuery = "{call dbo.QUERYDBIDetails(?,?)}";
$params = array();
$params['email'] = $email;
$params['password'] = $password;
$sqlQueryParams = array(
    array(&$params['email'], SQLSRV_PARAM_IN),
    array(&$params['password'], SQLSRV_PARAM_IN),
);
// Connect to the Database with the stored procedure to be executed
$queryResult = sqlsrv_query($link, $sqlQuery, $sqlQueryParams);
// If the execution fails
if ($queryResult === false) {
    echo "Query failed";
} else {
    // If there is no table data
    if (sqlsrv_has_rows($queryResult) === false) {
    } else {
        // Array to store data
        $resultsArray = array();
        // The index count for the for loop
        $count = count($resultsArray);
        // Push individual items into array
        for ($i = 0; $i <= $count; $i++) {
            // WARNING: USING MORE THAN ONE OF THESE INCREASES THE INTERNAL CURSOR INDEX COUNT, SO YOU WILL SKIP A ROW IF YOU USE A FETCH BEFORE YOULL BE MISSING DATA
            $res = sqlsrv_fetch_array($queryResult, SQLSRV_FETCH_ASSOC, 1);
            // Stops the infinite loop, only pushes data to the array if it isnt returned empty
            if (!empty($res)) {
                // Push into array
                array_push($resultsArray, $res);
                // Increase count
                $count = count($resultsArray);
            }
        }
        // Display result, not needed but helpful for visualising
        echo json_encode($resultsArray);
    }
}
