<?php

session_start();

// Allow CORS from any origin
header("Access-Control-Allow-Origin: *"); 

// Allow only specified origins
//header("Access-Control-Allow-Origin: http://example.com");

// Allow CORS for specific methods 
header("Access-Control-Allow-Methods: GET, POST");

$conn = new mysqli("localhost","u703556666_Laide","Olaide1@", "u703556666_Laide");


// Check connection

if($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Validate connection 
if(!$conn->query("SELECT 1")) {
  die("Fetch failed: " . $conn->error);
}


function aesDecrypt($encryptionKey, $encryptedData){
    
    
    // Convert encrypted data from base64 to raw binary
    $encryptedDataBinary = base64_decode($encryptedData);
    
    // Decrypt the data using AES-256-ECB
    $decryptedData = openssl_decrypt($encryptedDataBinary, 'aes-256-ecb', $encryptionKey, OPENSSL_RAW_DATA);
    
    if ($decryptedData === false) {
        // Handle decryption error
        die("Decryption failed: " . openssl_error_string());
    }
    
    return $decryptedData;
}

function aesEncrypt($encryptionKey, $dataToEncrypt){
    
    // Encrypt the data using AES-256-ECB
    $encryptedData = openssl_encrypt($dataToEncrypt, 'aes-256-ecb', $encryptionKey, OPENSSL_RAW_DATA);
    
    // Convert encrypted data to base64 to make it safe to handle
    $encryptedDataBase64 = base64_encode($encryptedData);
    
    return $encryptedDataBase64;
}



// Handle OTP 
if(isset($_POST['getOtp'])) {

  $email = $_POST['email'];
  
  $otp = rand(100000, 999999);

  $expiry = date('Y-m-d H:i:s', strtotime('+5 mins'));

  $sql = "INSERT INTO otp (email, otp, expiry) VALUES ('$email', '$otp', '$expiry')";

  if(mysqli_query($conn, $sql)){
      
  mail($email, 'OTP', $otp);
  echo json_encode(['success'=>'OTP Sent: ']);
  }
  else {
      
  echo json_encode(['error: ' => mysqli_error($conn)]);
  }



}

// Handle Registration
if(isset($_POST['register'])) {

  $name = $_POST['name'];
  $email = $_POST['email'];
  $password = $_POST['password'];
  $otp = $_POST['otp'];

  $sql = "SELECT * FROM otp WHERE email='$email' AND otp='$otp'";

  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result) > 0) {

    $hashedPass = md5($password); 

    $sql = "INSERT INTO users(name, email, password) VALUES ('$name', '$email', '$hashedPass')";
    
    if(mysqli_query($conn, $sql)){
      echo json_encode('Registration successful');  
    }

  } else {
    echo json_encode('Invalid OTP');
  }

}

// Handle Login
if(isset($_POST['login'])) {

  $email = $_POST['email'];
  $password = $_POST['password'];

  $sql = "SELECT * FROM users WHERE email='$email'";

  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result) > 0) {

    $row = mysqli_fetch_assoc($result);
    $hashedPass = $row['password'];

    if(md5($password) == $hashedPass) {
      echo json_encode('Login successful');
    } else {
      echo json_encode('Invalid credentials');
    }

  } else {
    echo json_encode('User not found');
  }

}

 if(isset($_POST['home'])) {

    // Get registration data
    $userid = $_POST['userid'];
    $username = $_POST['email'];

    // Check if user exists
    $query2 = $db->query("SELECT * FROM `sensor_data` where userid=(SELECT id from users where email='$username' LIMIT 1)");


    if($query2) {

      
      // Fetch user data
      $data = $query2->fetch_assoc();
      
      // Assign user id to variable
        $enc_key = $data['enc_key']; 
      $temp = aesDecrypt($enc_key, $data['temp'])  ; 
      

      echo json_encode(['temp' => $temp,'success' =>'','temp' =>$temp]);

    
    }
    else {
      echo json_encode(['error' => 'Fetchin Error']);
    }

  }



  if(isset($_POST['sensor_data'])) {

  // Get form data
  $enc_key = $_POST['fingerprintSecret'];
  $macid = $_POST['sensor_id'] ;
  $temp = aesEncrypt($enc_key,$_POST['temp'] ) ;

  // Validate form data

  // Get user id
  $userid_query = "SELECT id FROM users WHERE iot = '$macid' LIMIT 1";
  $userid_result = $conn->query($userid_query); 
  if($userid_result->num_rows == 1) {
    $userid = $userid_result->fetch_row()[0]; 
  } else {
    $userid = 0;
  }

  // Insert data
  $insert_query = "INSERT INTO sensor_data (userid, temp, sensor_id, ekey) VALUES ('$userid', '$temp','$macid','$enc_key')";
  
  if($conn->query($insert_query) === TRUE) {
      echo json_encode(['success' => 'Data Added Successfully']);
  }
  else {
      echo json_encode(['error' => "Error inserting record: " . $conn->error]);
  }

}





mysqli_close($conn);
?>
