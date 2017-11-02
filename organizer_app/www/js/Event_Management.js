document.addEventListener("deviceready", onDeviceReady, false);
/*
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
var cmpen362SignIn = false;
var cmpen362SignOut = false;

function onDeviceReady() {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user && firstSignIn) {
      firstSignIn = false;
      var platform = device.platform;
      console.log(platform);
      var db = firebase.database();
      var selectedImage = null;
      var imageUrl = null;
      var ids = null;

      QRScanner.prepare(function (err, status) {
        console.log(err);
        console.log(status);
      });
      var sendPush = false;
      var sendUpdate = false;
      var uiResetLockCount = 0;
      var goHomeOnBack = false;
      document.addEventListener("backbutton", function () {
        if (goHomeOnBack) {
          QRScanner.hide();
          returnHome();
          goHomeOnBack = false;
        }
        else {
          navigator.app.exitApp();
        }
        console.log("back button pressed");
      }, false);



      $("#reset").click(function () {
        resetNotificationUI(uiResetLockCount);
      });

      // Reposition the popover if the orientation changes.
      window.onorientationchange = function () {
        var cameraPopoverHandle = new CameraPopoverHandle();
        var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
        cameraPopoverHandle.setPosition(cameraPopoverOptions);
      }
    }
    else {
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

