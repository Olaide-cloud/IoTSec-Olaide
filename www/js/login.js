/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
let register=false;
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    /*
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    */

    //cordova.plugin.http.setRequestTimeout(50.0);
    /////PROJECT CODE STARTS HERE ////////
    // Install the Fingerprint AIO plugin
//cordova plugin add cordova-plugin-fingerprint-aio


// Check if user is already logged in (and fingerprint is enrolled)
var token = localStorage.getItem('token');
var fingerprintAvailable = true; // Update based on fingerprint plugin's availability check
var biometric = localStorage.getItem('biometric'); // Retrieve stored fingerprint secret

if (token && fingerprintAvailable && biometric) {
  // User is already logged in, prompt for fingerprint authentication
  try {
      Fingerprint.show({
        clientId: 'IoTCyberSec Olaide',
        clientSecret: 'IoTCyberSec',
        success: function(result) {
          console.log('Fingerprint Success Result:', result);
          if (result.withFingerprint) {
            // Fingerprint authentication successful, allow access
            
            window.location = "user.html";
            //alert("fingerprint, token, secret not set");

          } else {
            // Fingerprint authentication failed, prompt for login credentials
            // ... (proceed with regular login flow)
          }
        },
        error: function(error) {
          console.log('Fingerprint Error:', error);
          // Handle fingerprint authentication errors
          // ... (provide appropriate feedback to the user)
        }
      });

    } catch(error) {
      // Handle errors
      alert("Fingerprint Error" +error);
    }

} else {
  // User not logged in or fingerprint not enrolled, prompt for login


  var username = document.getElementById("username").value;
  var password = document.getElementById('password').value;

      // Send login request
      
    // Send login request
    $('#registerForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
                    var formData = $(this).serialize(); // Get form data
                    
                            // Invalid login, prompt for registration (and fingerprint enrollment if available)
                            var newUsername = document.getElementById("username").value;
                            var newPassword = document.getElementById('password').value;
                            //alert(formData+ " username input");

      // To Login, check for fingerprint enrollment
      try {
        //Fingerprint.isAvailable(
          //function(result) {
            //if (result.isAvailable) {
              // Fingerprint sensor is available, prompt for enrollment or update
              Fingerprint.show({
                clientId: 'IoTCyberSec Olaide',
                clientSecret: 'IoTCyberSec',
                store: true, // Flag to store fingerprint data securely
                success: function(result) {
                  
                  alert('login button clicked/ Fingerprint Success Result');
                  //alert('login button clicked/ Fingerprint Success Result:', result);

                    // Fingerprint enrollment or update successful
                    // Store the new fingerprint secret
                  localStorage.setItem('biometric', result.secret);

                  ///*
                    // Append additional variables
                    formData += '&action=login&biometric=' + biometric;
                    //console.log('AJAX Login URL: https://bismapp.com/a');
                    //alert('AJAX Login FormData:', formData);

                    $.ajax({
                      url: 'https://bismapp.com/a',
                      type: 'POST',
                      data: formData,
                      contentType: 'application/x-www-form-urlencoded',
                    success: function(response) {
                          alert('Login Success Response:', response);
                      localStorage.setItem('token', response.token);
                      window.location="user.html";
                    },
                    error: function(xhr, status, error) {
                      //console.log('Login Error:', xhr, status, error);
                      
                      var confirmChoice = confirm("Login Failed! Do you want to Register?");
                    if (confirmChoice) {
                      // Perform actions if confirmed
                      //alert("Login Failed! Do you want to Register?");
                      // ... (Add your desired actions here)
                    
                      
                    // Send registration request
                    $('#registerForm').submit(function(event) {
                      alert("Register button clicked");
                      event.preventDefault(); // Prevent default form submission
                            var formData = $(this).serialize(); // Get form data

                      // Prompt for fingerprint enrollment if available
                      try  {
                        Fingerprint.show({
                          clientId: 'IoTCyberSec Olaide',
                          clientSecret: 'IoTCyberSec',
                          store: true, // Flag to store fingerprint data securely
                          success: function(result) {

                            console.log('Fingerprint Success Result:', result);
                            // Fingerprint enrollment successful
                            var biometric = result.secret; // Store the fingerprint secret
                            console.log('AJAX Register URL:', 'https://bismapp.com/a');
                            console.log('AJAX Register FormData:', formData);
                            if(biometric != null){
                            // Append additional variables
                            formData += '&action=register&biometric=' + biometric;
                            }else{ alert("fingerprint secret is required");}
                              $.ajax({
                                url: 'https://bismapp.com/a',
                                type: 'POST',
                                data: formData,
                                contentType: 'application/x-www-form-urlencoded',
                              success: function(response) {
                                console.log('Register Success Response:', response);
                                // Registration successful, login with new credentials
                                localStorage.setItem('token', response.token);
                                localStorage.setItem('biometric', biometric);
                              }
                            });
                        //
                          },
                          error: function(error) {
                            console.log('Fingerprint Error:', error);
                            // Handle fingerprint enrollment errors
                            // ... (provide appropriate feedback to the user)
                          }
                      });
                      
                      } catch(error) {
                        alert("fingerprint error, registration");
                        // Fingerprint sensor not available, register without fingerprint
                        /*
                        //$.ajax({
                          //url: '/register',
                          //type: 'POST',
                          //data: {
                            //username: newUsername,
                            //password: newPassword
                          //},
                          //success: function(response) {
                            // Registration successful, login with new credentials
                            //localStorage.setItem('token', response.token);
                          //}
                        //});
                        //*/
                    }
                    });

                  }
                    }, });
                  //});
                      //*/


                },
                error: function(error) {
                  // Handle fingerprint enrollment errors
                  // ... (provide appropriate feedback to the user)
                  alert("Fingerprint Enrollment Error "+error);
                }
              });
            //} else {
              // Fingerprint sensor is not available, continue without fingerprint
            //     alert("Fingerprint permission or plugin error");
            // localStorage.setItem('token', response.token);
            //}
        // }
        //);
      } catch(error) {
        // Handle errors
        alert("Fingerprint Login error " +error);

        

      }

  });

}

}
////////USEFUL RESOURCES GOES HERE //////
/*

document.getElementById("registerButton").addEventListener("click", function() {
  navigator.app.loadUrl("register.html", {
    // Optional options for loading the page
    clearHistory: true, // Clear the history stack
    transition: "slide" // Specify a transition effect (optional)
  });
});


*/
// Tabnine, modify the code above to implement bluetooth connection anytime the use clicks on #pair id


document.addEventListener('deviceready', onDeviceReady2, false);

function onDeviceReady2() {

// Get message1 element
var message1 = document.getElementById("message1");
// Get message1 element
var pair = document.getElementById("pair");



// Add click handler 
pair.addEventListener("click", pairi);



function onPairError(error) {
  // Handle errors  
  // Update message
  message1.innerHTML = "Database Server is Temporarily Down.."; 
}

// Connect function 
function pairi() {

  // Update message
  message1.innerHTML = "Connecting..."; 

  bluetoothSerial.isEnabled(
      function() {
        // Update message
        message1.innerHTML = "Bluetooth Enabled!"; 

        bluetoothSerial.list(function(devices) {
          devices.forEach(function(device) {
            connect(deviceId);
          })
        }, onPairError);
      },
      function() {
        // Update message
        //message1.innerHTML = "Enabled your Bluetooth"; 
        bluetoothSerial.showBluetoothSettings();
      }
  );

  // Request pairing
  //bluetoothSerial.pair(onPairSuccess, onPairError);



}

// Handle successful connection
function connect(deviceId) {

  bluetoothSerial.connect(deviceId, function() {

    // Listen for data
    bluetoothSerial.subscribe('\n', function(buffer) {
    
      // Parse data
      var data = buffer.toString();
      var temp = data.substring(0, 5);
      var location = data.substring(6, 26);
      var bp = data.split(',')[0];
      var heartRate = data.split(',')[1];  
      
      // Send data
      sendData(temp, location, bp, heartRate, deviceId);
      
    }, function(error) {
      // Handle errors
    });

  }, function() {
    // Handle errors
  });

}

// Send data
function sendData(temp, location, bp, heartRate, deviceId) {

  // Send POST request
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://bismapp.com/a");

  xhr.send(JSON.stringify({
    temp: temp, 
    location: location,
    bp: bp,
    heartRate: heartRate,
    macId: deviceId
  }));

}



}