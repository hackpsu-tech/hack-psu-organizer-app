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

            db.ref("/events").once("value").then(function (snapshot) {
                events = snapshot;
                for (var event in snapshot) {
                    $('#events').append($('<option>', {
                        value: event,
                        text: event.title
                    }));
                }
            });

            QRScanner.prepare(function (err, status) {
                console.log(err);
                console.log(status);
            });
            var uiResetLockCount = 0;

            // Reposition the popover if the orientation changes.
            window.onorientationchange = function () {
                var cameraPopoverHandle = new CameraPopoverHandle();
                var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
                cameraPopoverHandle.setPosition(cameraPopoverOptions);
            }

            $("#checkin").click(function () {
                $("#all-content").css('display', 'none');
                scanIt(2);
            });


            $("#reset").click(function () {
                resetNotificationUI(uiResetLockCount);
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
                            if (use == 1) {
                                dataCheck(text);
                            } else if (use == 2) {
                                registerPost(text);
                                $("#scanner-data").html("<h1> sent!! </h1> <button>Done</button>");
                                $("#scanner-data button").click(function () {
                                    returnHome();
                                    /*
                 $("#scanner-data").html("");
                   $("#all-content").css('display', 'block');
                 goHomeOnBack = false;*/
                                });
                            }
                            console.log(text);
                            QRScanner.hide();
                            $("body").css("visibility", "visible");
                            $("body").css("background-color", "white");
                            if (platform != "Android") {
                                $("#all-content").css('display', 'block');
                            }
                        }
                    });
                    QRScanner.show();
                    $("body").css("visibility", "hidden");
                    $("body").css("background-color", "transparent");
                    goHomeOnBack = true;
                });
            }
            // gets data from firebase
            function dataCheck(qrId) {
                db.ref("/registered/" + qrId).once("value").then(function (snapshot) {
                    if (snapshot != null) {
                        render(snapshot.val());
                    }
                });
            }

            // checks for requirements
            function logicCheck(data) {
                if (!data) {
                    return 0;
                } else if (data.got_shirt === true) {
                    return 1;
                } else return 2;
            }

            // interacts with div
            function render(data) {
                num = logicCheck(data);
                var email = "<tr><td>email</td> <td>" + data.email + "</td></tr>";
                var firstName = "<tr><td>first name</td> <td>" + data.first_name + "</td></tr>";
                var lastName = "<tr><td>last name</td> <td>" + data.last_name + "</td></tr>";
                var rsvp = "<tr><td>rsvp</td> <td>" + data.rsvp + "</td></tr>";
                var gotTshirt = "<tr><td>got tshirt</td> <td>" + data.got_shirt + "</td></tr>";
                var shirtSize = "<tr><td>shirt size</td> <td>" + data.shirt_size + "</td></tr>";
                var signedIn = "<tr><td>signed in</td> <td>" + data.signed_in + "</td></tr>";
                var done = "<button>Done</button>";

                if (num === 0) {
                    $("#scanner-data").css("background-color", "red");
                    $("#scanner-data").html("<h1>Not Registered in DB</h1>" + done);
                } else if (num == 1) {
                    var heading = "<h1>did not RSVP</h1>"
                    var table = "<table>" + firstName + lastName + rsvp + shirtSize + "</table>";
                    if (platform != "Android") {
                        alert("Hacker did not RSVP\n name: " + data.first_name + " " + data.last_name + "\n T-Shirt size: " + data.shirt_size);
                    }
                    $("#scanner-data").css("background-color", "red");
                    $("#scanner-data").html(heading + table + shirtSize + done);
                } else if (num == 2) {
                    var heading = "<h1> Signed in and / or got  t-shirt</h1>";
                    var table = "<table>" + firstName + lastName + rsvp + signedIn + gotTshirt + shirtSize + "</table>";
                    if (platform != "Android") {
                        alert("Hacker already signed in and / or got t-shirt\n name: " + data.first_name + " " +
                            data.last_name + "\n T-Shirt size: " + data.shirt_size + "\n Got T-Shirt? : " + data.got_shirt);
                    }
                    $("#scanner-data").css("background-color", "red");
                    $("#scanner-data").html(heading + table + done);
                } else if (num == 3) {
                    var heading = "<h1>All good Tshirt: " + data.shirt_size + "</h1>";
                    var table = "<table>" + firstName + lastName + rsvp + signedIn + gotTshirt + shirtSize + "</table>";
                    db.ref("/registered-hackers/" + data._id).update({
                        signed_in: true,
                        got_shirt: true
                    });
                    if (platform != "Android") {
                        alert("Successfully checked in!\n name: " + data.first_name + " " + data.last_name + "\n T-Shirt size: " + data.shirt_size);
                    }
                    $("#scanner-data").css("background-color", "green");
                    $("#scanner-data").html(heading + table + done);
                } else if (num == 4) {
                    var heading = "<h1> Warning!!: something is fishy</h1>";
                    var table = "<table>" + firstName + lastName + rsvp + signedIn + gotTshirt + shirtSize + "</table>";
                    $("#scanner-data").css("background-color", "red");
                    $("#scanner-data").html(heading + table + done);
                }

                $("#scanner-data button").click(function () {
                    returnHome();
                });
            }

            function returnHome() {
                $("body").css("visibility", "visible");
                $("body").css("background-color", "white");
                $("#scanner-data").html("");
                $("#scanner-data").css({
                    "background-color": "#bb6bdb"
                });
                $("#all-content").css('display', 'block');
                goHomeOnBack = false;
            }


            function registerPost(id) {
                db.ref("/registered/" + id).update({
                    "signed_in": true
                });
            }
        } else {
            console.log("signed out");
        }
    });

}

//end of device ready
