<?php
/**
 * Created by PhpStorm.
 * User: João Paulo
 * Date: 18/09/2015
 * Time: 01:16
 */

class WebService {
    /**
     * @param feed {String} parameter with a url to be submitted to the google API.
     */
    public function requestGoogleApi()
    {
        $GOOGLE_RSS_API = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=';
        $ERROR = "Invalid feed";

        $feed = $_GET["feed"];

        $requestUrl = $GOOGLE_RSS_API.$feed;

        $response = getFromURI($requestUrl);

        $responseBody = json_decode($response);

        $response = new Response();

        if($responseBody->responseStatus != 200) {
            $response = new ResponseWithError();
            $response->setError($ERROR);
        } else {
            $response->setFeed($responseBody->responseData->feed);
        }

        header('Content-Type: application/json');
        echo json_encode($response);
    }

}

/**
 * Class Response
 *
 * Response object to mimic the structure of the google api response;
 *
 */
class Response implements JsonSerializable {
    private $feed;

    /**
     * @return mixed
     */
    public function getFeed()
    {
        return $this->feed;
    }

    /**
     * @param mixed $feed
     */
    public function setFeed($feed)
    {
        $this->feed = $feed;
    }

    public function jsonSerialize() {
        return [
            'feed' => $this->feed
        ];
    }
}

/**
 * Class ResponseWithError
 *
 * Response object to mimic the structure of the google api response with error;
 *
 * Serializes the object to a value that can be serialized natively by json_encode().
 *
 */
class ResponseWithError extends Response implements JsonSerializable{
    private $error;

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @param mixed $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }

    public function jsonSerialize() {
        return [
            'error' => array('message' => $this->error),
            'feed' => $this->getFeed()
        ];
    }
}

/** auxiliary that based on inputs provides a curl request.
 * @param $URI {string} url to be requested
 * @param null $postValue {mixed} value to be sent through a post request
 * @param bool $errors {boolean} signals if error info is needed
 * @param int $timeout {integer} request timeout
 * @param bool $customHeader {object} request custom header
 * @return array|mixed
 */
function getFromURI($URI, $postValue = null, $errors = false, $timeout=8, $customHeader=false)
{
    $ch = curl_init();
    $url = $URI;

    if($postValue!==null){
        $test=json_encode($postValue);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS,(($test)));

    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, "meshapp.net +www.meshapp.net");
    curl_setopt($ch, CURLOPT_ENCODING, "gzip,deflate" );
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    if($customHeader)
    {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $customHeader);
    }

    //Test if ssl use is required
    if (strncasecmp($url, "https",5) === 0)
    {
        curl_setopt($ch, CURLOPT_SSLVERSION, 3); // Force use of SSL version 3
        // SSL options
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0); // Prodution server should have 2 value. 1 just checks common name

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, False); // Validates the server certificate against the CA

    }

    $output = curl_exec($ch);

    if(!$output && $errors)
        return array('errors'=>curl_error($ch),'response'=>$output);

    return $output;

}

if(!isset($_GET['feed'])){

    $response = new ResponseWithError();
    $response->setFeed(new stdClass);
    $response->setError("No object set");
    echo json_encode($response);
    return;

} else {

    $services = new WebService();
    $services->requestGoogleApi();

}