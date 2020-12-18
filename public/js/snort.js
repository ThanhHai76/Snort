let socket = io("http://localhost:3000");

socket.on("send-alert", function (data) {
  alert(data.data);
  $(".alert-danger").css("display", "block");
  $(".alert-danger").text(`${data.data}`);
});

socket.on("success-message", function (data) {
  $(".alert-success").css("display", "block");
  $(".alert-success").text(`${data.msg}`);
  alert(data.msg);
});

//-----------------Email----------------
$(document).ready(function () {
  // $('[data-toggle="tooltip"]').tooltip();
  var actions = $(".table-email td:last-child").html();
  // Append table with add row form on add new button click
  $(".add-new").click(function () {
    $(this).attr("disabled", "disabled");
    var index = $(".table-email tbody tr:last-child").index();
    var row =
      "<tr>" +
      '<td><input type="text" class="form-control" name="name" id="name"></td>' +
      '<td><input type="text" class="form-control" name="email" id="email"></td>' +
      '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
      "<td>" +
      actions +
      "</td>" +
      "</tr>";
    $(".table-email").append(row);
    $(".table-email tbody tr")
      .eq(index + 1)
      .find(".add, .edit")
      .toggle();
    // $('[data-toggle="tooltip"]').tooltip();
  });
  // Add row on add button click
  $(document).on("click", ".add", function () {
    var name = $(this).parents("tr").find('input[name="name"]').val();
    var email = $(this).parents("tr").find('input[name="email"]').val();
    var phone = $(this).parents("tr").find('input[name="phone"]').val();

    var name_edit =  $(this).parents("tr").find('.name input[type="text"]').val();
    var email_edit =  $(this).parents("tr").find('.email input[type="text"]').val();
    var phone_edit =  $(this).parents("tr").find('.phone input[type="text"]').val();

    var empty = false;
    var input = $(this).parents("tr").find('input[type="text"]');
    input.each(function () {
      if (!$(this).val()) {
        $(this).addClass("error");
        empty = true;
      } else {
        $(this).removeClass("error");
      }
    });
    $(this).parents("tr").find(".error").first().focus();
    if (!empty) {

      if(name === undefined ){
        console.log(name_edit, email_edit, phone_edit);
        socket.emit("add-user", {name: name_edit, email:email_edit, phone: phone_edit});
      } else{
        console.log(name,email,phone);
        socket.emit("add-user", {name: name, email:email, phone: phone});
      }
      
      input.each(function () {
        $(this).parent("td").html($(this).val());
      });
      $(this).parents("tr").find(".add, .edit").toggle();
      $(".add-new").removeAttr("disabled");
    }
  });
  // Edit row on edit button click
  $(document).on("click", ".edit", function () {
    $(this)
      .parents("tr")
      .find("td:not(:last-child)")
      .each(function () {
        $(this).html(
          '<input type="text" class="form-control" value="' +
            $(this).text() +
            '">'
        );
      });
    $(this).parents("tr").find(".add, .edit").toggle();
    $(".add-new").attr("disabled", "disabled");
  });
  // Delete row on delete button click
  $(document).on("click", ".delete", function () {
    var phone = $(this).parents("tr").find(".phone").text();
    if(phone) socket.emit("delete-user", {phone: phone});
    socket.on("success-delete", function(data){
      alert(data.msg);
    })
    $(this).parents("tr").remove();
    $(".add-new").removeAttr("disabled");
  });
});
