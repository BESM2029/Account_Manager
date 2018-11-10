function getAccountInfo() {
  let id = sessionStorage.getItem('sessionID');
  var params = { identity: id }
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "get_account_info",
    "data": params,
    "success": function(parms) {
      let parms_arr = JSON.parse(parms);
      $(".notice").html(parms_arr.msg);
      $("#login_id").html(parms_arr.sessionAccount.identity);
      $("#login_fn").html(parms_arr.sessionAccount.firstName);
      $("#Login_ln").html(parms_arr.sessionAccount.lastName);
    },
    "error": function(parms) {
      let parms_arr = JSON.parse(parms);
      $(".notice").html(parms_arr.msg);
    }
  });
}

function logoutAccount() {
  let id = sessionStorage.getItem('sessionID');
  var params = { identity: id }
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "logout_account",
    "data": params,
    "success": function(params) {
      $.mobile.changePage("#page_main", { transition: "none" });
      let params_arr = JSON.parse(params)
      $(".notice").html(params_arr.msg);
      sessionStorage.removeItem('sessionID');
    },
   "error": function(params) {
      let params_arr = JSON.parse(params)
      $(".notice").html(params_arr.msg);
    }
  });
}

function changeAccountInfo() {
  let id = sessionStorage.getItem('sessionID');
  var params = { identity: id, password1: $("#session_pw1").val(), password2: $("#session_pw2").val(), firstName: $("#session_first_name").val(), lastName: $("#session_last_name").val() };
  console.log("client params = " + JSON.stringify(params));
  $.ajax({
    "async": true,
    "type": "post",
    "global": false,
    "dataType": "html",
    "url": "change_account_info",
    "data": params,
    "success": function(params) {
      let params_arr = JSON.parse(params)
      if (params_arr.success == 1) {
        $.mobile.changePage("#page_session_main", { transition: "none" });
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