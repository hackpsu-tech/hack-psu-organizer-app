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
var events;
var selected;


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

            /*           // Get events
            db.ref("/events").once("value").then(function (snapshot) {
                events = snapshot;
                for (var event in snapshot) {
                    $('#events').append($('<option>', {
                        value: event,
                        text: event.title
                    }));
                }
            });
*/

            // TODO: load extra credit box


            // Prepare QR Scanner
            QRScanner.prepare(function (err, status) {
                console.log(err);
                console.log(status);
            });

            // Reposition the popover if the orientation changes.
            window.onorientationchange = function () {
                var cameraPopoverHandle = new CameraPopoverHandle();
                var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
                cameraPopoverHandle.setPosition(cameraPopoverOptions);
            }


            $("#scan").click(function () {
                $("#all-content").css('display', 'none');

                var user;
                db.ref(/registered/ + scanIt()).once("value").then(function (snapshot) {
                    user = snapshot;
                });
                if (user == null) {
                    alert("Fraud alert!");
                    return;
                }

                // TODO change `"registration"` to its given UID
                if ($("#event").val() == "registration") {
                    db.ref("/registered/" + user._iu + "/attended").set(true);
                }

                var numScans;
                db.ref(/events/ + $("#event").val() + "/scans/" + user._id).once("value").then(function (snapshot) {
                    if (snapshot.val() == null) {
                        // new guy on the street
                        numScans = 1;
                    } else if (selected.multi_entry) {
                        // returning friend
                        numScans = snapshot.val() + 1;
                    } else {
                        // returning person who was not invited
                        alert("Re-entry is not aloud at this time.");
                        return;
                    }
                });
                db.ref(/events/ + $("#event").val() + "/scans/" + user._id).set(numScans);

                // Display result
                $("#firstName").val(user.name_first);
                $("#lastName").val(user.name_last);
                $("#shirtSize").val(user["t-shirt-size"]);
                $("#timesScanned").val(numScans);
            });


            function scanIt() {

                QRScanner.prepare(function (err, status) {
                    console.log(err);
                    console.log(status);
                    QRScanner.scan(function (err, text) {
                        if (err) {
                            console.log(err._message);
                            switch (err.code) {
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
                                case 5:
                                    alert("Camera is unavailable");
                                    break;
                                case 6:
                                    console.log("Scan cancelled");
                                    break;
                                default:
                                    console.log("error code: " + err.name);
                            }
                        } else {
                            console.log(text);
                            QRScanner.hide();
                            $("body").css("visibility", "visible");
                            $("body").css("background-color", "white");
                            if (platform != "Android") {
                                $("#all-content").css('display', 'block');
                            }
                            return text;
                        }
                    });
                    QRScanner.show();
                    $("body").css("visibility", "hidden");
                    $("body").css("background-color", "transparent");
                });
            }

        } else {
            console.log("signed out");
        }
    });

}

//end of device ready
