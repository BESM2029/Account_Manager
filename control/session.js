function getAccountInfo() {
  $.ajax({
    "async":true,
    "type":"post",
    "global":false,
    "dataType":"html",
    "url": "get_account_info",
    "success": function (params_str) {
      let data = JSON.parse(params_str);
      if (data.msg)
        $(".notice").html(data.msg);
      if (data.session_account && data.session_account.ID && data.session_account.firstName && data.session_account.lastName) {
        $(".Login_ID").html(data.session_account.ID);
        $(".Login_fn").html(data.session_account.firstName);
        $(".Login_ln").html(data.session_account.lastName);
      }
    },
    "error": function (data) {
      console.log(data);
      $(".notice").html(data);
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
      $(".notice").html(data);
    },
    "error":function (data) {
      console.log(data);
      $(".notice").html(data);
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
    'success': function (params_str) {
      console.log("success callback is called.");
      let data = JSON.parse(params_str);
      if (data.msg)
        $(".notice").html(data.msg);
    },
    'error': function (data) {
      console.log(data);
      $(".notice").html(data);
    }
  });
  console.log("ajax is passed.");
}