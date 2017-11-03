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
      db.ref("/events").orderByChild("title").on("child_added", function (snapshot) {
        var event = snapshot.val();
        $('#events').append('<option value=' + snapshot.key + '>' + event.title + '</option>');
      });

  // When user changes event
  $("#events").on("change", function () {
    // TODO: check for unchanged data (maybe)
    editing = events[$("#events").val()];

    if (this.value !== "") { // existing event
      editing = events[this.value];
      $('#txtTitle').attr("value", editing.title);
      $("#txtDescription").attr("value", editing.description);
      $('#txtLocation').attr("value", editing.location);
      var time_start = new Date(editing.time_start * 1000);
      var time_end = new Date(editing.time_end * 1000);
      $('#timeStart').attr("value", time_start.getHours() + ":" + time_start.getMinutes());
      $('#startDate').attr("value", time_start.getYear() + "-" + time_start.getMonth() + "-" + time_start.getDate());
      $('#timeEnd').attr("value", time_end.getHours() + ":" + time_end.getMinutes());
      $('#dateEnd').attr("value", time_end.getYear() + "-" + time_end.getMonth() + "-" + time_end.getDate());

      //    $("#txtTimeENd").arrt("placeholder", editing.time_end);

    } else { // new event
      editing = null;
      $('#txtTitle').attr("placeholder", "Title");
      $("#txtDescription").attr("placeholder", "Description");
      $('#txtLocation').attr("placeholder", "Location");
      //    $('#txtTimeStart').attr("placeholder", editing.time_start);
      //    $("#txtTimeENd").arrt("placeholder", editing.time_end);
    }
  });


  $("#sendSubmission").click(function () {
    // TODO: Validate and parse input (start/end time)
    var start = 0,
      end = 0;

    if ($("#events").val() === "") {
      db.ref("events").push({
        title: $("#txtTitle").val(),
        'time-start': start,
        'time-end': end,
        location: $("#txtLocation").val(),
        description: $("#txtDescription").val(),
        category: $("#categories").val(),
        multi_entry: $("#radTrue").val()
      }, function (err) {
        console.error(err);
        alert("Could not save new event. Reason: " + err.message);
      });
    } else {
      db.ref("/events/" + $("#events").val()).set({
        title: $("#events").val(),
        description: $("#description").val(),
        location: $("#txtLocation").val(),
        group: $("#groups").val(),
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
}

else
{
  console.log("signed out");
}
})
;
//firebase.auth().signInWithPopup(provider).then(function(result) {
// console.log("Logged in!");
// console.log(result);


// }).catch(function(error) {
//  console.error(error);
// })


}

//end of device ready
