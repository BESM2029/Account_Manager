function createAccount() {
  let params = { identity: $("#create_id").val(), password1: $("#create_pw1").val(), password2: $("#create_pw2").val(),
    firstName: $("#create_first_name").val(), lastName: $("#create_last_name").val() };
  console.log("client params = "+JSON.stringify(params));
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "create_account",
    "data": params,
    "success": function(params) {
      let params_arr = JSON.parse(params)
      if (params_arr.success == 1) {
        $.mobile.changePage("#page_main", { transition: "none" });
        $(".notice").html(params_arr.msg);
      }
      else {
        $(".notice").html(params_arr.msg);
      }
    },
   "error": function(params) {
      let params_arr = JSON.parse(params)
      $(".notice").html(params_arr.msg);
    }
  });
}