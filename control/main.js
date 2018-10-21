function login() {
  var params = { identity: $("#main_id").val(), password: $("#main_pw").val() };
  console.log("client params = " + JSON.stringify(params));
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "login_account",
    "data": params,
    "success": function(params) {
      let params_arr = JSON.parse(params);
      if (params_arr.success == 1) {
        $.mobile.changePage("#page_session_main", { transition: "none" });
        $(".notice").html(params_arr.msg);
      }
      else {
        $(".notice").html(params_arr.msg);
      }
    },
    "error": function(params) {
      let params_arr = JSON.parse(params);
      $(".notice").html(params_arr.msg);
    }
  });
}