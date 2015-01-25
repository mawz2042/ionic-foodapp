<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$CLIENT_ID = "0WPH4VFJZFHJAAXTFDMXZ15D5XXMYWRJHXIWIIBSXHYDOOSP";
$CLIENT_SECRET = "DJQXVR5B2SZUFAER02SUIJLJZW54TNOIELNLB2J5MMVM23PD";
$OAUTH_TOKEN = "RGT5ZXHWBGVROTMD1ETZN1GMK0CLTNQEBYMUHEC3OY4XAQDQ";
$V_TOKEN = "20141010";

function instagram_location($id) {
	$ig_url = "https://api.instagram.com/v1/locations/search?foursquare_v2_id=".$id."&access_token=10540106.83917d7.5369ddd80fec497da72ebce95b235cd5";
	$ig_call = file_get_contents($ig_url);
	$response = json_decode($ig_call, TRUE);
	return $response['data'][0]['id'];
}

function instagram_media($id) {
	$location = instagram_location($id);
	$ig_url = "https://api.instagram.com/v1/locations/".$location."/media/recent?access_token=10540106.83917d7.5369ddd80fec497da72ebce95b235cd5";
	$ig_call = file_get_contents($ig_url);
	$response = json_decode($ig_call, TRUE);

	$result = $response['data'];
	return $result;
}

function foursquare_photos($id) {    
    $foursquare_url = "https://api.foursquare.com/v2/venues/".$id."/photos?oauth_token=".$GLOBALS['OAUTH_TOKEN']."&v=".$GLOBALS['V_TOKEN']."";
    $foursquare_call = file_get_contents($foursquare_url);
    $response = json_decode($foursquare_call, TRUE);

    return $response['response']['photos']['items'];
}

function allPhotos($id) {
	$ig_media = instagram_media($id);
	$all_imgs = array();
	foreach ($ig_media as $key => $val) {
		$all_imgs[] = array(
			"image" => $val['images']['low_resolution']['url'],
			"caption" => $val['caption']['text'],
			"likes" => $val['likes']['count'],
			"source" => "Instagram"
		);
	}

	$foursquare_photos = foursquare_photos($id);
	foreach ($foursquare_photos as $key => $val) {
		$all_imgs[] = array(
			"image" => $val['prefix']."500x500".$val['suffix'],
			"caption" => null,
			"likes" => null,
			"source" => "Foursquare"
		);
	}

	$result = json_encode($all_imgs);
	print $result;
	// print foursquarePhotos("3fd66200f964a52074e31ee3");
}
    
$id = $request->id;

return allPhotos($id);
?>