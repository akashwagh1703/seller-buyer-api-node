<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');
/*
	Class Name 		: 	SMS Helper
	
	Created By		: 	Deepak Kanmahale
	Created Date 	: 	22-01-2020
*/

/******************* Common SMS call **************************/
function send_sms($mobile,$text,$type=1)
{
	// {
	// 	"success": 1,
	// 	"error": 0,
	// 	"status": 1,
	// 	"data": "NULL",
	// 	"message": "OTP reset successfully",
	// 	"opt_number": 789292
	// }
	$response = array('status' => 'true');
	return json_encode($response);
	exit;
	// We have stop sending sms on dev server - Akash - 26-05-23

	$CI = &get_instance();
	$response = array('status' => 'false','message' => '');
	

	/*http://103.233.79.246/submitsms.jsp?user=FAMRUT&key=e5d80af278XX&mobile=+917028456361&message=Your referral code is 678678. Please log in to Famrut App using this code.&senderid=FAMRUT&accusage=1&entityid=1201159117826540209&tempid=1507163723691294933*/

	/*http://103.233.79.246/submitsms.jsp?user=FAMRUT&key=e5d80af278XX&mobile=+917028456361&message=Your referral code is 678678. Please log in to Famrut App using this code.&senderid=FAMRUT&accusage=1&entityid=1201159117826540209&tempid=1507163723691294933*/


	/*TEMPLATE ID	TELEMARKETER	TEMPLATE NAME
	'1507163723721736579'	--	Login Register OTP
	'1507163723691294933'	--	Referral Code1
	'1507163723677721299'	--	Referral Ack1*/

	$sender_id = 'FAMRUT';
	$accusage = 1;
	$entityid = 1201159117826540209;

	if($type == 1){
		// for Login Register OTP
		$tempid = 1507163723721736579;
		$accusage = 6;
	}elseif($type == 2){
		// for Referral Code1
		$tempid = 1507163723691294933;
		$accusage = 1;
	}else{
		//Referral Ack1
		$tempid = 1507163723677721299;
		$accusage = 1;
	}

	$keys = 'e5d80af278XX';
	//$sms_url = 'http://103.233.79.246/submitsms.jsp';	
	$sms_url = 'http://redirect.ds3.in/submitsms.jsp';

	if (1) {
	
		if (preg_match('/^\d{10}$/',$mobile) && !empty($text)) {
			/*http://103.233.79.246/submitsms.jsp?user=FAMRUT&key=e5d80af278XX&mobile=+917028456361&message=Your referral code is 678678. Please log in to Famrut App using this code.&senderid=FAMRUT&accusage=1&entityid=1201159117826540209&tempid=1507163723691294933*/

			$text = urlencode($text);
			$data  = array('user' => $sender_id,
					'key' 		=> $keys,
					'mobile' 		=> $mobile,
					//'text' 			=> $text,
					'senderid' 		=>  $sender_id,
					'accusage' 		=> $accusage,
					'entityid' 		=> $entityid,
					'tempid'		=> $tempid,
						);

		/*	$data  = array('loginID' => $CI->config->item('sms_login_id'),
					'password' 		=> $CI->config->item('sms_password'),
					'mobile' 		=> $mobile,
					//'text' 			=> $text,
					'senderid' 		=> $CI->config->item('sms_senderid'),
					'route_id' 		=> $CI->config->item('sms_route_id'),
					'Unicode' 		=> $CI->config->item('sms_unicode'),
					'IP'			=> $CI->config->item('sms_ip'),
						);*/

			$url  = $sms_url;

		    $curl  = curl_init();
		    $url = (strpos($url, "?") ? $url . "&" : $url . "?") . http_build_query($data);
		    // urlencoded text
		    $url .= '&message='.$text;

		   /* $url_new = "http://103.233.79.246/submitsms.jsp?user=FAMRUT&key=e5d80af278XX&mobile=".$mobile."&message=".$text."&senderid=FAMRUT&accusage=".$accusage."&entityid=1201159117826540209&tempid=".$tempid;*/
	
		    curl_setopt($curl, CURLOPT_URL, $url);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

		    $result      = curl_exec($curl);
		    $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		    $err         = curl_error($curl);

		    //$log_data = str_repeat('=', 40);
		    //$log_data .= date('Y-m-d H:i:s');
		    //$log_data .= str_repeat('=', 40) . "\n\n";
		    //$log_data .= '#Request: ' . json_encode($data) . "\n\n";
		    //$log_data .= '#Response: ' . $result . "\n\n";
		    //error_log_file($log_data);

		    if ($err) {
		    	$response = array('status' => 'true','message' => $err,'sms_url'=>$url);
		    } else {
		        
		        $response = array('sms_url'=>$url,'status' => 'true','message' => !is_array($result) ? $result : json_decode($result));

		        curl_close($curl);
		        
		    }
		    if (!$result) {
		        $response = array('sms_url'=>$url,'status' => 'false','message' => 'Connection Failure');
		    }
				
		}else{
			$response = array('sms_url'=>$url,'status' => 'false','message' => 'Mobile no or message not found.');

			/*$log_data = str_repeat('=', 40);
		    $log_data .= date('Y-m-d H:i:s');
		    $log_data .= str_repeat('=', 40) . "\n\n";
		    $log_data .= "##SMS API Call \n\n";
		    $log_data .= '#Response: ' . json_encode($response) . "\n\n";
		    error_log_file($log_data);*/	
		}
	}else{
		$response = array('status' => 'false','message' => 'Please config sms settings.');

		/*$log_data = str_repeat('=', 40);
		$log_data .= date('Y-m-d H:i:s');
		$log_data .= str_repeat('=', 40) . "\n\n";
		$log_data .= "##SMS API Call \n\n";
		$log_data .= '#Response: ' . json_encode($response) . "\n\n";
		error_log_file($log_data);*/	
	}
	return json_encode($response);
}
function dynamic_send_sms($mobile,$text,$map_key='',$domain='FAMRUT',$lang='en',$replace)
{
	/* $response = array('status' => 'true');
	return json_encode($response);
	exit; */
	
	$CI = &get_instance();
	$response = array('status' => 'false','message' => '');
	
    
	//$sender_id = 'FAMRUT';
	$accusage = 1;
	//$entityid = 1201159117826540209;		
	$sms_source_url = (get_config_settings('sms_source_url')) ? get_config_settings('sms_source_url') : [];
	$sms_source_key = (get_config_settings('sms_source_key')) ? get_config_settings('sms_source_key') : [];
	$sms_url     = trim($sms_source_url['description']);
	$keys     = trim($sms_source_key['description']);
	if($map_key!=''){
		$sql = "SELECT sms_type,entity_id,sender_id,temp_id,sms_template FROM sms_master where map_key='".$map_key."' and lang_key='".$lang."'";
		$result = $CI->db->query($sql);
		$smsdata = $result->result_array();//echo "<pre>smsdata===>";print_r($smsdata);exit;
		$tempid = $smsdata[0]['temp_id'];    //1507163723721736579;
		$accusage = $smsdata[0]['sms_type']; //6;
		$entityid = $smsdata[0]['entity_id']; //1201159117826540209;
		$sender_id =  $smsdata[0]['sender_id']; //'FAMRUT';
		$sms_template = get_sms_template($smsdata[0]['sms_template'], $replace);
		$text = $sms_template;
	}else{
		$response = array('sms_url'=>$sms_url,'status' => 'false','message' => 'Map key not found.');
	}

	//$keys = 'e5d80af278XX';
	//$sms_url = 'http://redirect.ds3.in/submitsms.jsp';

	if (1) {
	
		if (preg_match('/^\d{10}$/',$mobile) && !empty($text)) {
			/*http://103.233.79.246/submitsms.jsp?user=FAMRUT&key=e5d80af278XX&mobile=+917028456361&message=Your referral code is 678678. Please log in to Famrut App using this code.&senderid=FAMRUT&accusage=1&entityid=1201159117826540209&tempid=1507163723691294933*/

			$text = urlencode($text);
			$data  = array(
				'user'		=> "NEDFI",//$sender_id,
				'key'		=> $keys,
				'mobile'	=> $mobile,
				//'text'	=> $text,
				'senderid'	=>  $sender_id,
				'accusage'	=> $accusage,
				'entityid'	=> $entityid,
				'tempid'	=> $tempid,
			);
			$url  = $sms_url;
			$curl  = curl_init();
			$url = (strpos($url, "?") ? $url . "&" : $url . "?") . http_build_query($data);
		    // urlencoded text
		    $url .= '&message='.$text;
			
			/* $url_new = "http://103.233.79.246/submitsms.jsp?user=FAMRUT&key=e5d80af278XX&mobile=".$mobile."&message=".$text."&senderid=FAMRUT&accusage=".$accusage."&entityid=1201159117826540209&tempid=".$tempid;*/
	
		    curl_setopt($curl, CURLOPT_URL, $url);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

		    $result      = curl_exec($curl);
		    $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		    $err         = curl_error($curl);
			curl_close($curl);
//echo "<pre>res======".$result;print_r(json_decode($result));
		    if ($err) {
				$response = array('status' => 'true','message' => $err,'sms_url'=>$url);
		    } else {
				$response = array('sms_url'=>$url,'status' => 'true','message' => !is_array($result) ? $result : json_decode($result));
				
			}

		    if (!$result) {
		        $response = array('sms_url'=>$url,'status' => 'false','message' => 'Connection Failure');
		    }
		}else{
			$response = array('sms_url'=>$url,'status' => 'false','message' => 'Mobile no or message not found.');

			/*$log_data = str_repeat('=', 40);
		    $log_data .= date('Y-m-d H:i:s');
		    $log_data .= str_repeat('=', 40) . "\n\n";
		    $log_data .= "##SMS API Call \n\n";
		    $log_data .= '#Response: ' . json_encode($response) . "\n\n";
		    error_log_file($log_data);*/	
		}
	}else{
		$response = array('status' => 'false','message' => 'Please config sms settings.');

		/*$log_data = str_repeat('=', 40);
		$log_data .= date('Y-m-d H:i:s');
		$log_data .= str_repeat('=', 40) . "\n\n";
		$log_data .= "##SMS API Call \n\n";
		$log_data .= '#Response: ' . json_encode($response) . "\n\n";
		error_log_file($log_data);*/	
	}//echo "<pre>response======".$response;print_r($response);exit;
	return json_encode($response);
}

/******************* Common SMS call **************************/
function send_sms_old($mobile,$text)
{
	$CI = &get_instance();
	$response = array('status' => 'false','message' => '');

	if (!empty($CI->config->item('sms_login_id')) &&
		!empty($CI->config->item('sms_password')) &&
		!empty($CI->config->item('sms_senderid')) &&
		!empty($CI->config->item('sms_route_id')) &&
		$CI->config->item('sms_unicode') !='' &&
		!empty($CI->config->item('sms_ip')) &&
		!empty($CI->config->item('sms_url'))
		) {
	
		if (preg_match('/^\d{10}$/',$mobile) && !empty($text)) {

			$text = urlencode($text);
			$data  = array('loginID' => $CI->config->item('sms_login_id'),
					'password' 		=> $CI->config->item('sms_password'),
					'mobile' 		=> $mobile,
					//'text' 			=> $text,
					'senderid' 		=> $CI->config->item('sms_senderid'),
					'route_id' 		=> $CI->config->item('sms_route_id'),
					'Unicode' 		=> $CI->config->item('sms_unicode'),
					'IP'			=> $CI->config->item('sms_ip'),
						);
			$url  = $CI->config->item('sms_url');

		    $curl  = curl_init();
		    $url = (strpos($url, "?") ? $url . "&" : $url . "?") . http_build_query($data);
		    // urlencoded text
		    $url .= '&text='.$text;
	
		    curl_setopt($curl, CURLOPT_URL, $url);
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

		    $result      = curl_exec($curl);
		    $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		    $err         = curl_error($curl);

		    //$log_data = str_repeat('=', 40);
		    //$log_data .= date('Y-m-d H:i:s');
		    //$log_data .= str_repeat('=', 40) . "\n\n";
		    //$log_data .= '#Request: ' . json_encode($data) . "\n\n";
		    //$log_data .= '#Response: ' . $result . "\n\n";
		    //error_log_file($log_data);

		    if ($err) {
		    	$response = array('status' => 'true','message' => $err);
		    } else {
		        
		        $response = array('status' => 'true','message' => !is_array($result) ? $result : json_decode($result));

		        curl_close($curl);
		        
		    }
		    if (!$result) {
		        $response = array('status' => 'false','message' => 'Connection Failure');
		    }
				
		}else{
			$response = array('status' => 'false','message' => 'Mobile no or message not found.');

			/*$log_data = str_repeat('=', 40);
		    $log_data .= date('Y-m-d H:i:s');
		    $log_data .= str_repeat('=', 40) . "\n\n";
		    $log_data .= "##SMS API Call \n\n";
		    $log_data .= '#Response: ' . json_encode($response) . "\n\n";
		    error_log_file($log_data);*/	
		}
	}else{
		$response = array('status' => 'false','message' => 'Please config sms settings.');

		/*$log_data = str_repeat('=', 40);
		$log_data .= date('Y-m-d H:i:s');
		$log_data .= str_repeat('=', 40) . "\n\n";
		$log_data .= "##SMS API Call \n\n";
		$log_data .= '#Response: ' . json_encode($response) . "\n\n";
		error_log_file($log_data);*/	
	}
	return json_encode($response);
}

/******************* End Common SMS Call **************************/
