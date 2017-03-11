
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	var selectedImage = null;
	var imageUrl = null;
	var ids = null;
	var config = {
		apiKey: "AIzaSyBFluYW_DWuVeaEzCMNFzAaHlVQnK8Qzk8",
		authDomain: "notifications-b01a3.firebaseapp.com",
		databaseURL: "https://notifications-b01a3.firebaseio.com",
		storageBucket: "notifications-b01a3.appspot.com",
		messagingSenderId: "385399873291"
	};
	firebase.initializeApp(config);
	$("#pushNotification").click(function(event) {
		event.preventDefault();
		ids = {
			"browser": [],
			"mobile": [],
		}

		if (firebase) {
			imageUrl = null;
			if (selectedImage != null) {

				var storageRef = firebase.storage().ref();
				console.log("28");
				var uuid = guid();
				console.log("30");
				var newUpload = storageRef.child($("#titleInput").val() + '-' + uuid + '.jpg');
				console.log("32");

				selectedImage = selectedImage.replace(/\s/g, '');
				console.log("selectedImage: " + selectedImage);
				var uploadTask = newUpload.putString(selectedImage, 'base64', {contentType:'image/jpg'});
				console.log("34");
				uploadTask.on('state_changed', function(snapshot) {
					console.log("36");
				}, function(error) {
					console.log("file could not be uploaded");
					alert("Image Upload Failed");
				}, function() {
					console.log("file upload success");
					imageUrl = uploadTask.snapshot.downloadURL;
					pushNotification();
					console.log("download url: " + uploadTask.snapshot.downloadURL);
				});
			}
			else {
				alert("notification did not have an image");
			}

			
		}
		selectedImage = null;
	});

	function pushNotification() {
		var updates = firebase.database().ref('updates');

		var newUpdate = updates.push();
		newUpdate.set({
			"date": Date.now(),
			"title": $("#titleInput").val(),
			"body": $("#bodyInput").val(),
			"url": imageUrl 
		});

		$.get( 'https://api.mlab.com/api/1/databases/push-notification-registrations/collections/registrations?apiKey=Y9MYB5bt3fAyPmJ99eXfiRIJGZK9N-hz&q={"platform":"browser"}', function( data ) {
			 console.log(data);
			 for (var i = 0; i < data.length; i++) {
				ids.browser.push(data[i]._id);
				console.log("BROWSER PUSHING: " + data[i]._id);
			 }
			 var notification = initNotification();
			 notification.registration_ids = ids.browser;
			 notification.notification.click_action = "https://notifications-b01a3.firebaseapp.com/";
			 notification.notification.icon = "https://notifications-b01a3.firebaseapp.com/assets/images/hackpsulogo.png";
			 if (notification.registration_ids.length > 0) {
				console.log("pushing browser notifications");
				$.ajax({
					url: 'https://fcm.googleapis.com/fcm/send',
					type: "POST",
					processData : false,
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Content-Type', 'application/json');
						xhr.setRequestHeader('Authorization', 'key=AAAAWbufXws:APA91bHfXsEZoJ7x4Zqe9qctxnL_73gknZfmznmP7f666KwkULCZ0yrTcueBVPWtZbfNTzK0y9kGWQy4M7h6hw6AESf6TGlgO2YVkJEj-HUDD1GksNtZsJ0mzeroaEodL8wq8oX__luN');
					},
					data: JSON.stringify(notification),
					success: function () {
						console.log("Browser Success");
					},
					error: function(error) {
						console.log(error);
					}
				});
			 }

		});
		$.get( 'https://api.mlab.com/api/1/databases/push-notification-registrations/collections/registrations?apiKey=Y9MYB5bt3fAyPmJ99eXfiRIJGZK9N-hz&q={"platform":"Android"}', function( data ) {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
			 	ids.mobile.push(data[i]._id);
				console.log("MOBILE PUSHING: " + data[i]._id);
			}
			var notification = initNotification();
			notification.registration_ids = ids.mobile;
			notification.notification.click_action = "FCM_PLUGIN_ACTIVITY";
			if (notification.registration_ids.length > 0) {
				console.log("pushing mobile notifications");
				$.ajax({
					url: 'https://fcm.googleapis.com/fcm/send',
					type: "POST",
					processData : false,
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Content-Type', 'application/json');
						xhr.setRequestHeader('Authorization', 'key=AAAAWbufXws:APA91bHfXsEZoJ7x4Zqe9qctxnL_73gknZfmznmP7f666KwkULCZ0yrTcueBVPWtZbfNTzK0y9kGWQy4M7h6hw6AESf6TGlgO2YVkJEj-HUDD1GksNtZsJ0mzeroaEodL8wq8oX__luN');
					},
					data: JSON.stringify(notification),
					success: function () {
						console.log("Mobile Success");
					},
					error: function(error) {
						console.log(error);
					}
				});
			}
		});
	}

	function initNotification() {
		var notification = { "notification": {
				"title": $("#titleInput").val(),
				"body": $("#bodyInput").val(),
				"sound":"default",
				"click_action" : null,
				"icon": null
			},
			"priority": "high",
			"data": {
				"title": $("#titleInput").val(),
				"body": $("#bodyInput").val()
			},
			"registration_ids" : null
		};
		return notification;
	}

	$("#takePicture").click(function() {
		navigator.camera.getPicture(function(imageURI) {
			selectedImage = imageURI;
			console.log("imageURI: " + imageURI);
			console.log("camera success");
		}, function(message) {
			console.log("camera failure: " + message);
			alert("Image Selection Failed");
		}, {
			destinationType: Camera.DestinationType.DATA_URL,
		    sourceType: Camera.PictureSourceType.CAMERA,
		    popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
		});
	});

	$("#choosePicture").click(function() {
		navigator.camera.getPicture(function(imageURI) {
			selectedImage = imageURI;
			console.log("imageURI: " + imageURI);
			console.log("camera success");
		}, function(message) {
			console.log("camera failure: " + message);
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
	window.onorientationchange = function() {
	    var cameraPopoverHandle = new CameraPopoverHandle();
	    var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
	    cameraPopoverHandle.setPosition(cameraPopoverOptions);
	}
  $("#shirt").click(function(){
      scanIt();
  });
  $("#checkin").click(function(){
      scanIt();
  });
}

function scanIt(url){
  QRScanner.show();
  $("body").css("visibility", "hidden");

  QRScanner.scan(function(err, text){
    if(err){
      switch(err){
        case 0:
          alert("An unexpected error!!");
          break;
        case 1:
          alert("Camera access denied!!");
          break;
        case 2:
          alert("Camera access is restricted");
          break;
        case 3:
          alert("The back camera is unavailable.");
          break;
        case 4:
          alert("The front camera is unavailable.");
          break;
        default:
          alert("error code: " + err);
      }
    }
    alert('The QR Code contains: ' + text);
    QRScanner.hide();
    $("body").css("visibility", "visible");
  });

}

