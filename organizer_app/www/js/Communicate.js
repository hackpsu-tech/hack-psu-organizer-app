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
      var sendMeUpdate = false;
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

      $("#sendNotification").click(function () {
        navigator.notification.confirm(
          "Sending push notification...\n" + getConfirmMessage(),
          function (confirmIndex) {
            if (confirmIndex != 1) {
              return
            }
            pushNotification();
            alert("Push notification sent");
          },
          'Confirm Send',           // title
          ['Confirm', 'Cancel']     // options
        );
      });

      $("#sendUpdate").click(function () {
        // Validate -> update #communicate-status text on error
        if (sendMeUpdate && selectedImage == null) {
          alert("You are required to have an image with a live update. Nothing sent");
        } else if ($("#communicate-txtTitle").val() == "" || $("#communicate-txtMessage").val() == "") {
          alert("You are required to have a title and a description. Nothing sent");
        } else {
          navigator.notification.confirm(
            "Sending push notification...\n" + getConfirmMessage(),
            function (confirmIndex) {
              if(confirmIndex != 1) {
                return
              }
              sendUpdate();
            },
            'Confirm Send',           // title
            ['Confirm', 'Cancel']
          );
        }
      });

      $("#sendBoth").click(function () {
        if (selectedImage == null) {
          alert("You are required to have an image with a live update. Nothing sent");
        } else if ($("#communicate-txtTitle").val() == "" || $("#communicate-txtMessage").val() == "") {
          alert("You are required to have a title and a description. Nothing sent");
        } else {
          navigator.notification.confirm(
            "Sending push notification...\n" + getConfirmMessage(),
            function (confirmIndex) {
              if(confirmIndex != 1) {
                return
              }
              sendUpdate();
              pushNotification();
            },
            'Confirm Send',           // title
            ['Confirm', 'Cancel']
          );
        }
      });

      $("#reset").click(function () {
        resetNotificationUI(uiResetLockCount);
		resetImageURL(imageUrl);
		resetTitle("");
		resetMsg("");
      });



      function getConfirmMessage() {
        var message = "";
        message += "Title: " + $("#titleInput").val() + "\n";
        message += "Body: " + $("#bodyInput").val();

        return message;
      }

      function resetNotificationUI(resetLockCount) {
        if (resetLockCount == 0) {
          clearActiveButton();
          $("#titleInput").val("");
          $("#bodyInput").val("");
          if (sendMeUpdate) {
            $("#enableUpdate").click();
          }
          if (sendPush) {
            $("#enableNotification").click();
          }
          selectedImage = null;
        }
      }

      function pushNotification() {
        uiResetLockCount = 2;
        var notification = initNotification();
        notification.notification.click_action = "https://hackpsu.org/live";
        notification.notification.icon = "https://notifications-b01a3.firebaseapp.com/assets/images/hackpsulogo.png";
        firebase.auth().getRedirectResult()
          .then(function(result) {
            if (result.credential) {
              var token = result.credential.accessToken;
              $.ajax({
                url: 'https://notifications-49e79.firebaseapp.com/sendmessage', //TODO: Change URL on Prod
                type: "POST",
                processData: false,
                beforeSend: function (xhr) {
                  xhr.setRequestHeader('Content-Type', 'application/json');
                  xhr.setRequestHeader('authtoken', token);
                },
                data: JSON.stringify(notification),
                success: function () {
                  uiResetLockCount--;
                  resetNotificationUI(uiResetLockCount);
                },
                error: function (error) {
                  uiResetLockCount--;
                  alert("Error getting registered id's for desktop: " + error);
                  resetNotificationUI(uiResetLockCount);
                  console.log(error);
                }
              });
            }
          }).catch(function(err) {
            console.error(err);
            alert("Not signed in to Firebase");
        });
      }

      function sendUpdate() {
        if (db && firebase && selectedImage != null) {
          var storageRef = firebase.storage().ref();
          var uuid = guid();
          var newUpload = storageRef.child($("#titleInput").val() + '-' + uuid + '.jpg');

          selectedImage = selectedImage.replace(/\s/g, '');
          var uploadTask = newUpload.putString(selectedImage, 'base64', {contentType: 'image/jpg'});
          uploadTask.on('state_changed', function (snapshot) {
          }, function (error) {
            console.log("Image could not be uploaded to firebase");
            alert("Image Upload Failed");
          }, function () {
            imageUrl = uploadTask.snapshot.downloadURL;

            var updates = db.ref('updates');

            var newUpdate = updates.push();
            newUpdate.set({
              "date": Date.now(),
              "title": $("#titleInput").val(),
              "body": $("#bodyInput").val(),
              "url": imageUrl
            });
            alert("Update sent");
            resetNotificationUI(uiResetLockCount);
          });
        }
      }


      function initNotification() {
        var notification = {
          "notification": {
            "title": $("#titleInput").val(),
            "body": $("#bodyInput").val(),
            "sound": "default",
            "click_action": null,
            "icon": null
          },
          "priority": "high",
          "data": {
            "title": $("#titleInput").val(),
            "body": $("#bodyInput").val()
          }
        };
        return notification;
      }

      $("#takePicture").click(function () {
        navigator.camera.getPicture(function (imageURI) {
          selectedImage = imageURI;
          clearActiveButton($("#choosePicture"));
          setActiveButton($("#takePicture"));
        }, function (message) {
          console.log("Taking picture failed: " + message);
          alert("Taking picture Failed");
        }, {
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY),
          correctOrientation: true
        });
      });

      $("#choosePicture").click(function () {
        navigator.camera.getPicture(function (imageURI) {
          selectedImage = imageURI;
          clearActiveButton($("#takePicture"));
          setActiveButton($("#choosePicture"));
        }, function (message) {
          console.log("Image selection failed: " + message);
          alert("Image Selection Failed");
        }, {
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
        });
      });

      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      // Reposition the popover if the orientation changes.
      window.onorientationchange = function () {
        var cameraPopoverHandle = new CameraPopoverHandle();
        var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
        cameraPopoverHandle.setPosition(cameraPopoverOptions);
      }



      function clearActiveButton(obj) {
        if (obj) {
          obj.removeClass("active-button");
          obj.addClass("button");
        }
        else {
          $(".active-button").each(function () {
            $(this).removeClass("active-button");
            $(this).addClass("button");
          });
        }
      }


      function setActiveButton(obj) {
        obj.removeClass("button");
        obj.addClass("active-button");
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
  //    console.error(error);
  // })


}

//end of device ready

