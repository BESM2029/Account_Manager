function resetPassword() {
    var params = {identity: $("#reset_id").val()};
    console.log("params = "+JSON.stringify(params));
    $.ajax({
        "async":true,
        "type":"post",
        "global":false,
        "dataType":"html",
        "url":"reset_password",
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