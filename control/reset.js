function forgotPassword() {
  var params = { identity: $("#reset_id").val() };
  console.log("client params = " + JSON.stringify(params));
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "forgot_password",
    "data": params,
    "success": function(params) {
      let params_arr = JSON.parse(params)
      $(".notice").html(params_arr.msg);
    },
   "error": function(params) {
      let params_arr = JSON.parse(params)
      $(".notice").html(params_arr.msg);
    }
  });
}

function checkResetCode() {
  var params = { identity: $("#reset_id").val(), code: $("#reset_code").val() };
  console.log("client params = " + JSON.stringify(params));
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "check_reset_code",
    "data": params,
    "success":function(params) {
      let params_arr = JSON.parse(params);
      if (params_arr.success == 1) {
        $.mobile.changePage("#page_reset_phase_2", { transition: "none" });
        $(".notice").html(params_arr.msg);
      }
      else {
        $(".notice").html(params_arr.msg);
      }
    },
    "error":function(params) {
        let params_arr = JSON.parse(params);
        $(".notice").html(params_arr.msg);
    }
  });
}

function changePassword() {
  var params = { identity: $("#reset_id").val(), password1: $("#reset_pw1").val(), password2: $("#reset_pw2").val() };
  console.log("client params = " + JSON.stringify(params));
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "change_password",
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