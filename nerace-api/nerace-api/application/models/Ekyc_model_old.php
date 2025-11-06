<?php  if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}
class Ekyc_model extends MY_Model
{
    public function __construct()
    {
        parent::__construct();
    }
    public function is_ekyc_enable()
    {
        $sql = "SELECT id,key_fields,description from config_master WHERE  is_active = true  AND key_fields like '%ekyc%' AND  is_deleted = false order by id asc";
        $rest = $this->db->query($sql);
        $ekyc_config_data = $rest->result_array();
        $newconfig = array();
        foreach($ekyc_config_data as $k=>$v){
            foreach($v as $k1=>$v1){
                if($k1=='key_fields')
                $newconfig[$v[$k1]]=$v['description'];
            }
        }
        return $newconfig;
    }
    public function ekyc_aadhar_otp_generate($userid,$aadharno)
    { 
        $api_url ='https://live.zoop.one/in/identity/okyc/otp/request';
        $header_arr = array(
            'Content-Type: application/json',
            'api-key:Y3DMTAV-V3N4YNT-J0D303D-TK58NVH',
            'app-id:6421326062edcd001df95955'
        );
        $post_arr = '{
            "data": {
                "customer_aadhaar_number": "'.$aadharno.'",
                "consent": "Y",
                "consent_text": "Approve the values here"
                }
            }';
            $res = $this->postCURL($api_url,$header_arr,$post_arr);
            $api_url_data = json_decode($res, true);
            $result_array = array();
            foreach($api_url_data as $key){
                if($api_url_data['result']['is_otp_sent']==1 && $api_url_data['result']['is_number_linked']==1 && $api_url_data['result']['is_aadhaar_valid']==1 && $api_url_data['success']==1){
                    $result_array['success'] = 1;
                    $result_array['error'] = 0;
                    $result_array['status'] = 1;
                    $result_array['data'] = $api_url_data;
                    $result_array['message'] = 'OTP sent to mobile number';
                    $insert['request_id']         = $api_url_data['request_id'];
                    $where = array('farmer_id' => $userid, 'document_type' => 'Aadhaar');
                    $check_farmer = $this->get_data('id', 'farmer_documents', $where);
                    if($check_farmer[0]['id']==''){
                        $insertdata['farmer_id']         = $userid;
                        $insertdata['document_type']         = 'Aadhaar';
                        $insertdata['request_id']         = $api_url_data['request_id'];
                        $result = $this->add_data('farmer_documents', $where, $insertdata);
                    }else{
                        $result = $this->update_data('farmer_documents', $where, $insert);
                    } 

                }
                else{

                    $result_array['success'] = 0;
                    $result_array['error'] = 1;
                    $result_array['status'] = 0;
                    $result_array['data'] = $api_url_data;
                    $result_array['message'] = 'Invalid aadhar number';
                }
                $mask_aadharno = str_repeat('X', strlen($aadharno) - 4) . substr($aadharno, -4);
                $post_arrnew = '{
                    "data": {
                        "customer_aadhaar_number": '.$mask_aadharno.',
                        "consent": "Y",
                        "consent_text": "Approve the values here"
                        }
                    }';
            }
            api_activity_logs('EKYC - Aadhar OTP generation',json_encode($post_arrnew),$res,'',$userid);
            return $result_array;
    }
    public function ekyc_aadhar_verification($userid,$aadharno,$otp)
    {
        $select              = array('request_id');
        $where               = array('farmer_id' => $userid, 'document_type' => 'Aadhaar');
        $farmer_data = $this->get_data($select, 'farmer_documents', $where);
        $requestid = $farmer_data[0]['request_id'];
        $api_url_new ='https://live.zoop.one/in/identity/okyc/otp/verify';
        $header_arr = array(
            'Content-Type: application/json',
            'api-key:Y3DMTAV-V3N4YNT-J0D303D-TK58NVH',
            'app-id:6421326062edcd001df95955'
        );
        $post_arr_new = '{
            "data": {
                "customer_aadhaar_number": "'.$aadharno.'",
                "request_id":"'.$requestid.'",
                "otp": "'.$otp.'",
                "consent": "Y",
                "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
              }
            }';
            $res1 = $this->postCURL($api_url_new,$header_arr,$post_arr_new);
            $api_url_data = json_decode($res1, true);
            $result_array = array();
            $mask_aadharno = str_repeat('X', strlen($aadharno) - 4) . substr($aadharno, -4);
            foreach($api_url_data as $key){
                if($api_url_data['success']==1){
                    $result_array['success'] = 1;
                    $result_array['error'] = 0;
                    $result_array['status'] = 1;
                    $result_array['data'] = $api_url_data;
                    $result_array['message'] = 'Aadhar verified successfully';
                    $insert['is_verify']         = true;
                    $where = array('farmer_id' => $userid, 'document_type' => 'Aadhaar');
                    $check_farmer = $this->get_data('id', 'farmer_documents', $where);
                    if($check_farmer[0]['id']==''){
                        $insertdata['farmer_id']         = $userid;
                        $insertdata['document_type']         = 'Aadhaar';
                        $insertdata['is_verify']         = true;
                        $result = $this->add_data('farmer_documents', $where, $insertdata);
                    }else{
                        $result = $this->update_data('farmer_documents', $where, $insert);
                    } 
                    $cwhere = array('id' => $userid);
                    $clientdata['aadhar_no']         = $mask_aadharno;
                    $clientdata['other_json']         = array('Aadhaar' => $api_url_data['result']);
                    $client_result = $this->update_data('client', $cwhere, $clientdata);

                }else{

                    $result_array['success'] = 0;
                    $result_array['error'] = 1;
                    $result_array['status'] = 0;
                    $result_array['data'] = $api_url_data;
                    $result_array['message'] = 'Invalid aadhar number';
                }
                $post_arrnew = '{
                    "data": {
                        "customer_aadhaar_number": "'.$mask_aadharno.'",
                        "request_id":"'.$requestid.'",
                        "otp": "'.$otp.'",
                        "consent": "Y",
                        "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                      }
                    }';
            }
            api_activity_logs('EKYC - Aadhar number verification',json_encode($post_arrnew),$res1,'',$userid);
            return $result_array;
    }
    public function ekyc_bank_verification($userid,$accno,$ifsc_code)
    {
        $api_url ='https://live.zoop.one/api/v1/in/financial/bav/lite';
        $header_arr = array(
            'Content-Type: application/json',
            'api-key:Y3DMTAV-V3N4YNT-J0D303D-TK58NVH',
            'app-id:6421326062edcd001df95955'
        );
        $post_arr = '{
                "data": {
                "account_number": "'.$accno.'",
                "ifsc": "'.$ifsc_code.'",
                "consent": "Y",
                "consent_text" : "Here i declare above information is correct!."
                }
            }';
            $res = $this->postCURL($api_url,$header_arr,$post_arr);
            $api_url_data = json_decode($res, true);
           
            $result_array = array();
            foreach($api_url_data as $key){
                if($api_url_data['result']['transaction_remark']=='Transaction Successful' && $api_url_data['result']['verification_status']=='VERIFIED' && $api_url_data['success']==1){
                    $result_array['success'] = 1;
                    $result_array['error'] = 0;
                    $result_array['status'] = 1;
                    $result_array['data'] = $api_url_data;
                    $result_array['message'] = 'Bank verification successfully';
                    $insert['is_verify']         = true;
                    $where = array('farmer_id' => $userid, 'document_type' => 'Bank');
                    $check_farmer = $this->get_data('id', 'farmer_documents', $where);
                    if($check_farmer[0]['id']==''){
                        $insertdata['farmer_id']         = $userid;
                        $insertdata['document_type']         = 'Bank';
                        $insertdata['is_verify']         = true;
                        $result = $this->add_data('farmer_documents', $where, $insertdata);
                    }else{
                        $result = $this->update_data('farmer_documents', $where, $insert);
                    } 
                    $cwhere = array('id' => $userid);
                    $clientdata['ifsc_code']         = $ifsc_code;
                    $clientdata['acc_no']         =  $accno;
                    $result = str_replace(PHP_EOL, '', $api_url_data['result']);
                    $clientdata['other_json']         =  json_encode(array('Bank' =>json_encode($result, TRUE)));
                    $client_result = $this->update_data('client', $cwhere, $clientdata);

                }else{

                    $result_array['success'] = 0;
                    $result_array['error'] = 1;
                    $result_array['status'] = 0;
                    $result_array['data'] = $api_url_data;
                    $result_array['message'] = 'Invalid bank details';
                }
            }
            api_activity_logs('EKYC - Bank verification',json_encode($post_arr),$res,'',$userid);
            return $result_array;
    }
    public function postCURL($_url,$header,$postdata){
            $curl = curl_init();
            curl_setopt_array($curl, array(
            CURLOPT_URL => $_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS =>$postdata,
            CURLOPT_HTTPHEADER => $header,
            ));
            $response = curl_exec($curl);
            curl_close($curl);
            return $response;
        }
        public function get_ekyc_verification_status($userid)
        {
            $ekyc_status = array();
            $ekyc_config_data = $this->is_ekyc_enable();
            $ekyc_status = $ekyc_config_data;
            if($ekyc_config_data['ekyc']==1){
                if($ekyc_config_data['ekyc_aadhar_verify']==1){
                    $where = array('farmer_id' => $userid, 'document_type' => 'Aadhaar');
                    $get_status = $this->get_data('is_verify', 'farmer_documents', $where);
                    $ekyc_status['aadhaar_verify_sataus'] = ($get_status[0]['is_verify']== 't')?"1":"0";
                }
                if($ekyc_config_data['ekyc_bank_verify']==1){
                    $where = array('farmer_id' => $userid, 'document_type' => 'Bank');
                    $get_status = $this->get_data('is_verify', 'farmer_documents', $where);
                    $ekyc_status['bank_verify_status'] = ($get_status[0]['is_verify']== 't')?"1":"0";
                }

            }
           return $ekyc_status;
        }

}


?>