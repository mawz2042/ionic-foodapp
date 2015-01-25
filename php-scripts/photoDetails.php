<?php
/**
 * Queries the API by the input values from the user 
 * 
 * @param    $business_id        The search term to query
 */
function query_api($business_id) {     
    $yelp_photos_kimono_api_url = "https://www.kimonolabs.com/api/1yvmd5zo?apikey=ffc80afd57744d022d0edfbbb0c1b077&kimpath2=" . $business_id;
    $yelp_photos_kimono_api_response = file_get_contents($yelp_photos_kimono_api_url);
    $yelp_photos_kimono_api = json_decode($yelp_photos_kimono_api_response, TRUE);

    $yelp_imgs = $yelp_photos_kimono_api['results']['images'];
    for ($i=0; $i < count($yelp_photos_kimono_api['results']['images']); $i++) {
        $large_img = substr_replace($yelp_photos_kimono_api['results']['images'][$i]['img']['src'], 'l.jpg', -6);
        $yelp_photos_kimono_api['results']['images'][$i]['img']['src'] = $large_img;
    }

    $yelp_photos_kimono_api = $yelp_photos_kimono_api['results'];

    $result = json_encode($yelp_photos_kimono_api);

    print $result; 
}

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = $request->id;

return query_api($id);
?>
