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
      let params = JSON.parse(data);
      if (params.success == 0) {
        $('.notice').html(params.msg);
      }
      else {
        $.mobile.changePage('#page_session_main', {transition: 'none'});
        $('.notice').html(params.msg);
      }
    },
    'error': function (data) {
      let params = JSON.parse(data);
      $('.notice').html(params.msg);
    }
  });
}