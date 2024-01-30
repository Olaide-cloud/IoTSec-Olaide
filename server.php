<?php

// DB connection
$conn = mysqli_connect("localhost","u637711261_bisma","Laide1@", "u637711261_bisma");
// Handle OTP 
if(isset($_POST['getOtp'])) {

  $email = $_POST['email'];
  
  $otp = rand(100000, 999999);

  $expiry = date('Y-m-d H:i:s', strtotime('+5 mins'));

  $sql = "INSERT INTO laide_otp(email, otp, expiry) VALUES ('$email', '$otp', '$expiry')";

  mysqli_query($conn, $sql);

  mail($email, 'OTP', $otp);

  echo json_encode('success');

}

// Handle Registration
if(isset($_POST['register'])) {

  $name = $_POST['name'];
  $email = $_POST['email'];
  $password = $_POST['password'];
  $otp = $_POST['otp'];

  $sql = "SELECT * FROM laide_otp WHERE email='$email' AND otp='$otp'";

  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result) > 0) {

    $hashedPass = md5($password); 

    $sql = "INSERT INTO laide_users(name, email, password) VALUES ('$name', '$email', '$hashedPass')";
    
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

  $sql = "SELECT * FROM laide_users WHERE email='$email'";

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

mysqli_close($conn);
?>