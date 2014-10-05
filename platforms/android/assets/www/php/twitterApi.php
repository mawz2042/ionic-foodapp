<?php  
	session_start();  
	require_once("lib/twitteroauth/twitteroauth.php"); //Path to twitteroauth library you downloaded in step 3  
	  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$name = $request->name;

	$twitteruser = "Al3x_Tran"; //user name you want to reference  
	$notweets = 20; //how many tweets you want to retrieve  
	$consumerkey = "J569SqqErHIx4Pm5m1Obl2Za9";  
	$consumersecret = "8fJaL5xitMAXTyBqGfWjCEXYpfw7Dz5TyG9VRJ43Lx1GFtcWnE";   
	$accesstoken = "140631605-seRW2ReiEfGUnv38SedW13lZJUNDtaYvLIbGG3I9";   
	$accesstokensecret = "k3aN1IMCOXOBX433KDHof2w6FnasH86cpnfOMYmHLT5Xf";   
	  
	function getToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {  
		$connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);  
		return $connection;  
	}  
	  
	$connection = getToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);  
	  
	$tweets = $connection->get("https://api.twitter.com/1.1/search/tweets.json?q=" . $name);  
	  
	echo json_encode($tweets);  
	//echo $tweets; //testing remove for production     
?> 