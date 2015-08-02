<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);
// basis url
$overpass_url = "http://overpass-api.de/api/interpreter?data=";

$data = $_GET["data"]; // de string met de query
$bbox = $_GET["bbox"]; // is de bounding box die (bbox) in bovenstaande string  vervangt
$data = str_replace( "\\" , "" , $data); // als magic quotes aanstaat dubbele slash verwijderen, en anders niet van invloed
$data = urlencode($data); // vorm geven voor correcte request
$bbox = urlencode($bbox);
$request = $overpass_url.$data."&bbox=".$bbox;

$proxy = curl_init($request);
curl_setopt($proxy, CURLOPT_RETURNTRANSFER, 1);
header('Content-type: application/osm3s+xml');	// dit zet speciale header voor osm-xml
$response = curl_exec($proxy); // stuur de query naar overpass
print $response; // en het resultaat naar de client
curl_close($proxy);	
?>
