$(document).ready(function () {

    ip = "192.168.1.148"
    port = 8095

    //判断浏览器是否支持sessionstorage
    if (window.sessionStorage) {

    } else {
        alert("浏览器暂不支持sessionStorage")
    }

    $("#login").click(function () {
        login();
    })

    //login ajax代码封装
    function login() {
        username = document.getElementById("exampleInputUsername").value
        password = document.getElementById("exampleInputPassword").value

        if (username == ""||password == "") {
            swal("用户名或密码不能为空！", "请重新输入", "error")
        } else {

            md5password = $.md5(password);
            data = "{'userAccount':'" + username + "','userPassword':'" + md5password + "'}"
            data = data.replace(/\'/g, "\"")
            base64data = $.base64.encode(data);
            data = "{\"login\":\"" + base64data + "\"}"
            $.ajax({
                async: true,
                url: "http://" + ip + ":" + port + "/fuchain/user/login",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: data,
                dataType: "json",
                success: success_of_respons_function,
                error: error_of_respons_function,
            })

            function success_of_respons_function(back) {
                if (back.status == 200) {
                    window.location.href = 'index.html'
                    localStorage.setItem('token', back.token)
                    localStorage.setItem('userid', back.userId)
                } else{
                    swal("登录失败！", "" + back.message + "", "error")
                }
            }

            function error_of_respons_function() {
                swal("连接失败！", "检查网络连接", "error")
            }

        }
    }
})