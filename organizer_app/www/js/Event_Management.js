document.addEventListener("deviceready", onDeviceReady, false);
//*
var config = {
    apiKey: "AIzaSyBFluYW_DWuVeaEzCMNFzAaHlVQnK8Qzk8",
    authDomain: "notifications-b01a3.firebaseapp.com",
    databaseURL: "https://notifications-b01a3.firebaseio.com",
    projectId: "notifications-b01a3",
    storageBucket: "notifications-b01a3.appspot.com",
    messagingSenderId: "385399873291"
  };
/*/
var config = {
    apiKey: "AIzaSyDiFm_g-RCf3xnO5anJ8Sp8nsRSfYxxdP0",
    authDomain: "notificationtest-49e79.firebaseapp.com",
    databaseURL: "https://notificationtest-49e79.firebaseio.com",
    projectId: "notificationtest-49e79",
    storageBucket: "notificationtest-49e79.appspot.com",
    messagingSenderId: "775163784219"
};
//*/
firebase.initializeApp(config);
var firstSignIn = true;
var events = new Object();


function onDeviceReady() {
    firebase.auth().signInWithEmailAndPassword("hackpsudev@gmail.com", "hackpsudev2017").catch(function (error) {
        console.error(error);
        console.error("ERROR!!!");
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user && firstSignIn) {
            firstSignIn = false;
            var platform = device.platform;
            console.log(platform);
            var db = firebase.database();
            var ids = null;

            db.ref("events").once("value").then(function (snapshot) {
                events = snapshot;
                for (var event in snapshot) {
                    $('#events').append($('<option>', {
                        value: event,
                        text: event.title
                    }));
                }
            });





            $("#reset").click(function () {
                resetNotificationUI(uiResetLockCount);
            });

            // Reposition the popover if the orientation changes.
            window.onorientationchange = function () {
                var cameraPopoverHandle = new CameraPopoverHandle();
                var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
                cameraPopoverHandle.setPosition(cameraPopoverOptions);
            }
        } else {
            console.log("signed out");
        }
    });
    //firebase.auth().signInWithPopup(provider).then(function(result) {
    // console.log("Logged in!");
    // console.log(result);


    // }).catch(function(error) {
    //  console.error(error);
    // })


}

//end of device ready
