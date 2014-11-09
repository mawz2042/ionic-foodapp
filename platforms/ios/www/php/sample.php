<?php
/**
 * Yelp API v2.0 code sample.
 *
 * This program demonstrates the capability of the Yelp API version 2.0
 * by using the Search API to query for businesses by a search term and location,
 * and the Business API to query additional information about the top result
 * from the search query.
 * 
 * Please refer to http://www.yelp.com/developers/documentation for the API documentation.
 * 
 * This program requires a PHP OAuth2 library, which is included in this branch and can be
 * found here:
 *      http://oauth.googlecode.com/svn/code/php/
 * 
 * Sample usage of the program:
 * `php sample.php --term="bars" --location="San Francisco, CA"`
 */

// Enter the path that the oauth library is in relation to the php file
require_once('lib/OAuth.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// Set your OAuth credentials here  
// These credentials can be obtained from the 'Manage API Access' page in the
// developers documentation (http://www.yelp.com/developers)
$CONSUMER_KEY = "ImMeSGyXgaMo3ndrSWbPDw";
$CONSUMER_SECRET = "auewXb2cYeksl1mtUb7slX7I80U";
$TOKEN = "cKflb63qY2NaKiPaAEjbQvtY2dIf9hAB";
$TOKEN_SECRET = "eYZG5NL2HmQJjPv5bETBVNwRwF4";

$API_HOST = 'api.yelp.com';
$DEFAULT_TERM = 'food';
// $DEFAULT_LOCATION = 'San Francisco, CA';
$DEFAULT_LAT = "43.6000";
$DEFAULT_LONG = "-79.6500";
$DEFAULT_RADIUS = 5000; // in km
$SEARCH_LIMIT = 20;
$SEARCH_PATH = '/v2/search/';
$BUSINESS_PATH = '/v2/business/';

/** 
 * Makes a request to the Yelp API and returns the response
 * 
 * @param    $host    The domain host of the API 
 * @param    $path    The path of the APi after the domain
 * @return   The JSON response from the request      
 */
function request($host, $path) {
    $unsigned_url = "http://" . $host . $path;

    // Token object built using the OAuth library
    $token = new OAuthToken($GLOBALS['TOKEN'], $GLOBALS['TOKEN_SECRET']);

    // Consumer object built using the OAuth library
    $consumer = new OAuthConsumer($GLOBALS['CONSUMER_KEY'], $GLOBALS['CONSUMER_SECRET']);

    // Yelp uses HMAC SHA1 encoding
    $signature_method = new OAuthSignatureMethod_HMAC_SHA1();

    $oauthrequest = OAuthRequest::from_consumer_and_token(
        $consumer, 
        $token, 
        'GET', 
        $unsigned_url
    );
    
    // Sign the request
    $oauthrequest->sign_request($signature_method, $consumer, $token);
    
    // Get the signed URL
    $signed_url = $oauthrequest->to_url();
    
    // Send Yelp API Call
    $ch = curl_init($signed_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    
    return $data;
}

/**
 * Query the Search API by a search term and location 
 * 
 * @param    $term        The search term passed to the API 
 * @param    $location    The search location passed to the API 
 * @return   The JSON response from the request 
 */
function search($term, $lat, $long, $radius) {    
    $newTerm = $term ?: $GLOBALS['DEFAULT_TERM'];
    // $newLocation = $location ?: $GLOBALS['DEFAULT_LOCATION'];
    $newLat = $lat ?: $GLOBALS['DEFAULT_LAT'];
    $newLong = $long ?: $GLOBALS['DEFAULT_LONG'];
    $newRadius = $radius ?: $GLOBALS['DEFAULT_RADIUS'];
    $newLimit = $GLOBALS['SEARCH_LIMIT'];
    
    $url_params = array(
        'term' => $newTerm,
        'll' => $newLat.','. $newLong,
        // 'location' => $newLocation,
        'limit' => $newLimit,
        'radius_filter' => $newRadius
    );   

    $search_path = $GLOBALS['SEARCH_PATH'] . "?" . http_build_query($url_params);
    
    return request($GLOBALS['API_HOST'], $search_path);
}

/**
 * Queries the API by the input values from the user 
 * 
 * @param    $term        The search term to query
 * @param    $location    The location of the business to query
 */
function query_api($term, $lat, $long, $radius) {     
    $response = search($term, $lat, $long, $radius);

    print $response; 
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

return query_api($term, $lat, $long, $radius);
?>
