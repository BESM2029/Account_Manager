function sendResetCode() {
  var params = {identity: $("#reset_id").val()};
  console.log("params = "+JSON.stringify(params));
  $.ajax({
    "async":true,
    "type":"post",
    "global":false,
    "dataType":"html",
    "url":"send_reset_code",
    "data":params,
    "success":function (data) {
      $(".notice").html(data);
    },
    "error":function (data) {
      console.log(data);
      $(".notice").html(data);
    }
  });
}
function checkResetCode() {
  var params = {code: $("#reset_code").val()};
  console.log("params = "+JSON.stringify(params));
  $.ajax({
    "async":true,
    "type":"post",
    "global":false,
    "dataType":"html",
    "url":"check_reset_code",
    "data":params,
    "success":function (data) {
      $(".notice").html(data);
      let params_arr = JSON.parse(data)
      if (params_arr.success == 0) {
        $('.notice').html(params_arr.msg);
      }
      else {
        $.mobile.changePage( "#page_reset_phase_2", { transition: "none" });
        $('.notice').html(params_arr.msg);
      }
    },
    "error":function (data) {
        console.log(data);
        $(".notice").html(data);
    }
  });
}
function changePassword() {
  var params = {password1: $('#reset_pw1').val(), password2: $('#reset_pw2').val()};
  console.log("client params = "+JSON.stringify(params));
  $.ajax({
    'async': true,
    'type': 'post',
    'global': false,
    'dataType': 'html',
    'url': 'change_password',
    'data': params,
    'success': function (data) {
      let params_arr = JSON.parse(data)
      $('.notice').html(params_arr.msg);
    },
   'error': function (data) {
      console.log(params_arr.msg);
      $(".notice").html(data.msg);
    }
  });
}