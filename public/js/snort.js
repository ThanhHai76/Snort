let socket = io("http://localhost:3000");

socket.on("send-alert", function (data) {
  alert(data.data);
});

socket.on("success-message", function(data){
  alert(data.msg);
})

// socket.on("check-reload", function () {
//   if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
//     socket.emit("reload", {});
//     //   alert("page reload");
//     // continue;
//   }
// });

