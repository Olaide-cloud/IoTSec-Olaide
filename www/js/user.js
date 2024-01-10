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

let hasRedirected = false; // Flag to track redirection
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
  Fingerprint.show({
    clientId: 'IoTCyberSec Olaide',
    clientSecret: 'IoTCyberSec',
    success: function(result) {
      if (result.withFingerprint) {
        // Fingerprint authentication successful, allow access
        
        //window.location = "user.html";
        //alert("fingerprint, token, secret not set");

      } else {
        // Fingerprint authentication failed, prompt for login credentials
        // ... (proceed with regular login flow)
      }
    },
    error: function(error) {
      // Handle fingerprint authentication errors
      // ... (provide appropriate feedback to the user)
    }
  });
} else {
  // User not logged in or fingerprint not enrolled, prompt for login

  if(!hasRedirected){
  alert("registration/login yes");
  window.location = "login.html";
  hasRedirected = true;
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


}
