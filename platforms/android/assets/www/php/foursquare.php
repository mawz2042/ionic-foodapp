<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$CLIENT_ID = "0WPH4VFJZFHJAAXTFDMXZ15D5XXMYWRJHXIWIIBSXHYDOOSP";
$CLIENT_SECRET = "DJQXVR5B2SZUFAER02SUIJLJZW54TNOIELNLB2J5MMVM23PD";
$OAUTH_TOKEN = "RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ";
$V_TOKEN = "20141010";

$DEFAULT_TERM = 'food';
$DEFAULT_LAT = "43.6000";
$DEFAULT_LONG = "-79.6500";
$DEFAULT_RADIUS = 2000; // in m
$SEARCH_LIMIT = 50;

function explore($term, $lat, $long, $radius) {    
    $newTerm = $term ?: $GLOBALS['DEFAULT_TERM'];
    $newLat = $lat ?: $GLOBALS['DEFAULT_LAT'];
    $newLong = $long ?: $GLOBALS['DEFAULT_LONG'];
    $newRadius = $radius ?: $GLOBALS['DEFAULT_RADIUS'];
    $newLimit = $GLOBALS['SEARCH_LIMIT'];

    $foursquare_url = "https://api.foursquare.com/v2/venues/explore?ll=".$newLat.",".$newLong."&section=".$newTerm."&radius=".$newRadius."&limit=".$newLimit."&venuePhotos=1&oauth_token=".$GLOBALS['OAUTH_TOKEN']."&v=".$GLOBALS['V_TOKEN'];
    $foursquare_call = file_get_contents($foursquare_url);
    // $response = json_decode($foursquare_call, TRUE);
    print $foursquare_call;
}

/**
 * User input is handled here 
 */
$longopts  = array(
    "term::",
    "radius::"
);

$options = getopt("", $longopts);
$term = $options['term'] ?: '';
$radius = $options['radius'] ?: '';
    
$lat = $request->latitude;
$long = $request->longitude;

return explore($term, $lat, $long, $radius);
?>
