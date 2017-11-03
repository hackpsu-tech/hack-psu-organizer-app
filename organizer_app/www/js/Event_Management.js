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
var events;
var editing;

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

            // Save all events and load events option box
            db.ref("/events").once("value").then(function (snapshot) {
                events = snapshot;
                for (var event in snapshot) {
                    $('#events').append($('<option>', {
                        value: event,
                        text: event.title
                    }));
                }
            });

            // When user changes event
            $("#events").on("change", function () {
                // TODO: check for unchanged data (maybe)
                editing = events[$("#events").val()]
                
                if (this.value != "") { // new event
                    editing = events[this.value];
                    $('#txtTitle').attr("placeholder", editing.title);
                    $("#txtDescription").arrt("placeholder", editing.description);
                    $('#txtLocation').attr("placeholder", editing.location);
                    //    $('#txtTimeStart').attr("placeholder", editing.time_start);
                    //    $("#txtTimeENd").arrt("placeholder", editing.time_end);

                } else { // existing event
                    editing = null;
                    $('#txtTitle').attr("placeholder", "Title");
                    $("#txtDescription").arrt("placeholder", "Description");
                    $('#txtLocation').attr("placeholder", "Location");
                    //    $('#txtTimeStart').attr("placeholder", editing.time_start);
                    //    $("#txtTimeENd").arrt("placeholder", editing.time_end);
                }
            })


            $("#sendSubmission").click(function () {
                // TODO: Validate input (start/end time)
                if ($("#dropdown").val == "") {
                    db.ref("/events/" + guid()).set({
                        title: $("#events").val(),
                        description: $("#description").val(),
                        location: $("#txtLocation").val(),
                        group: $("#group").val(),
                        multi_entry: $("#radTrue").val()
                    });

                } else {
                    db.ref("/events/" + $("#events").val()).set({
                        title: $("#events").val(),
                        description: $("#description").val(),
                        location: $("#txtLocation").val(),
                        group: $("#group").val(),
                        multi_entry: $("#radTrue").val()
                    });
                }
            });

            // Clear all data
            $("#reset").click(function () {
                // Reset values
                $('#txtTitle').val("");
                $("#txtDescription").val("");
                $('#txtLocation').val("");
                $("#txtGroup").val("")
                $('#txtTimeStart').val("");
                $("#txtTimeEnd").val("");
                
                // Reset placeholders
                $('#txtTitle').attr("val", "");
                $("#txtDescription").arrt("val", "");
                $('#txtLocation').attr("val", "");
                $("#txtGroup").arrt("val", "");
                $('#txtTimeStart').attr("val", "");
                $("#txtTimeENd").arrt("val", "");
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
