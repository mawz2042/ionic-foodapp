<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$CLIENT_ID = "0WPH4VFJZFHJAAXTFDMXZ15D5XXMYWRJHXIWIIBSXHYDOOSP";
$CLIENT_SECRET = "DJQXVR5B2SZUFAER02SUIJLJZW54TNOIELNLB2J5MMVM23PD";
$OAUTH_TOKEN = "RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ";
$V_TOKEN = "20141010";

function venue($id) {    
    $foursquare_url = "https://api.foursquare.com/v2/venues/".$id."?oauth_token=".$GLOBALS['OAUTH_TOKEN']."&v=".$GLOBALS['V_TOKEN']."";
    $foursquare_call = file_get_contents($foursquare_url);
    // $response = json_decode($foursquare_call, TRUE);
    print $foursquare_call;
}
    
$id = $request->id;

return venue($id);
?>
