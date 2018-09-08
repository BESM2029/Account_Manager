function createAccount() {
  var params = {identity: $('#creat_id').val(), password1: $('#create_pw1').val(), password2: $('#create_pw2').val(), firstName: $('#create_first_name').val(), lastName: $('#create_last_name').val()};
  console.log("client params = "+JSON.stringify(params));
  $.ajax({
    'async': true,
    'type': 'post',
    'global': false,
    'dataType': 'html',
    'url': 'create_account',
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