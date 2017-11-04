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
var events = new Object;
var selected;
var scanned;

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

            // Save all events and load events option box
            db.ref("/events").orderByChild("title").on("child_added", function (snapshot) {
                events[snapshot.key] = snapshot.val();
                $('#events').append('<option value=' + snapshot.key + '>' + snapshot.val().title + '</option>');
            });
            db.ref("/extra-credit").orderByChild("title").on("child_added", function (snapshot) {
                events[snapshot.key] = snapshot.val();
                $('#events').append('<option value=' + snapshot.key + '>' + snapshot.val().title + '</option>');
            });

            // TODO: load extra credit box


            // Prepare QR Scanner
            QRScanner.prepare(function (err, status) {
                console.log(err ? err : status);
            });

            // Reposition the popover if the orientation changes.
            window.onorientationchange = function () {
                var cameraPopoverHandle = new CameraPopoverHandle();
                var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
                cameraPopoverHandle.setPosition(cameraPopoverOptions);
            }


            $("#scan").click(function () {
                if ($("#events").val() == "") {
                    alert("An event must be selected in oroder to scan");
                    return
                } else if ($("#events").val() === "registration") {

                }
                //$("#all-content").css('display', 'none');

                $("#all-content").css('display', 'none');
                scanIt();
            });

            $("#events").on("change", function () {
                selected = events[$("#events").val()];
                console.log("Selected: " + JSON.stringify(selected));
            });

            function scanIt() {
                console.log("Scanit");
                QRScanner.prepare(function (err, status) {
                    console.log(err);
                    console.log(status);
                    QRScanner.show();
                    $("body").css("visibility", "hidden");
                    $("body").css("background-color", "transparent");
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

                            db.ref(/registered/ + text).once("value").then(function (participant) {
                                user = participant.val();
                                console.log(user);
                                if (user == null) {
                                    alert("Fraud alert!");
                                    console.log(text);
                                    QRScanner.hide();
                                    return;
                                } else {

                                    // registration's uid is 'registration'
                                    if ($("#event").val() == "registration") {
                                        db.ref("/registered/" + user._id + "/attended").set(true);
                                    }

                                    var numScans;
                                    db.ref(/events/ + $("#events").val() + "/scans/" + user._id).once("value").then(function (data) {
                                        if (data.val() == null) {
                                            // new guy on the street
                                            db.ref(/events/ + $("#events").val() + "/scans/" + user._id).set(1);
                                        } else if (selected["multi-entry"]) {
                                            // returning friend
                                            db.ref(/events/ + $("#events").val() + "/scans/" + user._id).set(data.val() + 1);
                                        } else {
                                            // returning person who was not invited back
                                            alert("Re-entry is not aloud at this time.");
                                        }
                                        // Display result
                                        $("#firstName").val(user.name_first);
                                        $("#lastName").val(user.name_last);
                                        $("#shirtSize").val(user["shirt_size"]);
                                        $("#timesScanned").val(numScans);
                                    });
                                }
                            });
                        }
                        scanned = text;
                    });
                });
            }

        } else {
            console.log("signed out");
        }
    });

}

//end of device ready
