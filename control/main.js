function login() {
  var params = {identity: $('#main_id').val(), password: $('#main_pw').val()};
  console.log("client params = "+JSON.stringify(params));
  $.ajax({
    'async': true,
    'type': 'post',
    'global': false,
    'dataType': 'html',
    'url': 'login_account',
    'data': params,
    'success': function (data) {
      let params_arr = JSON.parse(data)
      if (params_arr.success == 0) {
        $('.notice').html(params_arr.msg);
      }
      else {
        //window.open('Session.html', '_self', true);
        //$('#page_session_main').click();
        $.mobile.changePage( "#page_session_main", { transition: "none" });
        $('.notice').html(params_arr.msg);
      }
    },
    'error': function (data) {
      console.log(params_arr.msg);
      $(".notice").html(data.msg);
    }
  });
}