function getAccountInfo() {
  $.ajax({
    "async":true,
    "type":"post",
    "global":false,
    "dataType":"html",
    "url": "get_account_info",
    "success": function (data) {
      let parms = JSON.parse(data);
      if (parms.msg)
        $(".notice").html(parms.msg);
      if (parms.sessionAccount && parms.sessionAccount.identity && parms.sessionAccount.firstName && parms.sessionAccount.lastName) {
        $(".Login_ID").html(parms.sessionAccount.identity);
        $(".Login_fn").html(parms.sessionAccount.firstName);
        $(".Login_ln").html(parms.sessionAccount.lastName);
      }
    },
    "error": function (data) {
      let parms = JSON.parse(data);
      $(".notice").html(parms.msg);
    }
  });
}
function logout() {
  $.ajax({
    "async":true,
    "type":"post",
    "global":false,
    "dataType":"html",
    "url":"logout_account",
    "success":function (data) {
      window.open("Index.html", "_self", true);
      let parms = JSON.parse(data);
      $(".notice").html(parms.msg);
    },
    "error":function (data) {
      let parms = JSON.parse(data);
      $(".notice").html(parms.msg);
    }
  });
}
function changeAccountInfo() {
  var params = {password1: $('#session_pw1').val(), password2: $('#session_pw2').val(), firstName: $('#session_first_name').val(), lastName: $('#session_last_name').val()};
  console.log("params = "+JSON.stringify(params));
  $.ajax({
    'async': true,
    'type': 'post',
    'global': false,
    'dataType': 'html',
    'url': 'change_account_info',
    'data': params,
    'success': function (data) {
      let params = JSON.parse(data);
      if (data.msg)
        $(".notice").html(params.msg);
    },
    'error': function (data) {
      let params = JSON.parse(data);
      $(".notice").html(params.msg);
    }
  });
}