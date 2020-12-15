let socket = io("http://localhost:3000");

socket.on("send-alert", function (data) {
  alert(data.data);
  $(".alert-danger").css("display", "block");
  $(".alert-danger").text(`${data.data}`);
});

socket.on("success-message", function(data){
  $(".alert-success").css("display", "block");
  $(".alert-success").text(`${data.msg}`);
  alert(data.msg);
})

// socket.on("check-reload", function () {
//   if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
//     socket.emit("reload", {});
//     //   alert("page reload");
//     // continue;
//   }
// });

