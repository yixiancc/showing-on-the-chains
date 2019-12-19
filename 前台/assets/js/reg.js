$(document).ready(function () {

    ip = "192.168.1.148"
    port = 8095
    //判断浏览器是否支持sessionstorage
    if (window.sessionStorage) {

    } else {
        alert("浏览器暂不支持sessionStorage")
    }

    //获取全部网络配置
    allnetworks()

    //获取用户选择智能合约id
    $("#reg").click(function () {
        var chaincode_arr = [];
        $("input[name='chaincode_id']:checked").each(function (i) {
            chaincode_arr.push("\\\"" + $(this).val() + "\\\"")
        })
        reg(chaincode_arr);
    })

    //发送用户申请智能合约id
    function reg(chaincode_arr) {
        username = document.getElementById("exampleInputName").value
        password = document.getElementById("exampleInputPassword").value

        if (username == ""||password == "") {
            swal("用户名或密码不能为空！", "请重新输入", "error")
        } else {

            md5password = $.md5(password);
            data = "{'userId':'','userApplyAccout':'" + username + "','userApplyPassword':'" + md5password + "','userApplyAuthority':'[" + chaincode_arr + "]','userApplyStarttime':'null','userApplyPasstime':'null'}"
            data = data.replace(/\'/g, "\"")
            base64data = $.base64.encode(data);
            data = "{\"register\":\"" + base64data + "\"}"

            $.ajax({
                async: true,
                url: "http://" + ip + ":" + port + "/fuchain/user/register",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: data,
                dataType: "json",
                success: success_of_respons_function,
                error: error_of_respons_function,
            })

            function success_of_respons_function(back) {
                if (back.status == 200) {
                    swal("已发送注册申请！", "请等待管理员审核", "success")
                    sessionStorage.removeItem('chaincode_arr');
                    $(".swal-button").click(function () {
                        window.location.href = 'login.html'
                    })
                } else {
                    swal("注册失败！", "" + back.message + "", "error")
                }

            }

            function error_of_respons_function() {
                swal("连接失败！", "检查网络连接", "error")
            }
        }

    }

    //全部网络配置
    function allnetworks() {

        network = ""

        $.ajax({
            async: true,
            url: "http://" + ip + ":" + port + "/fuchain/getNetworkInformation",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: success_of_respons_function,
            error: error_of_respons_function,
        })

        function success_of_respons_function(data) {
            for (i = 0; i < data.length; i++) {
                $("#select_window").append("<div class=\"card-body\"><ul class=\"sidebar-menu do-nicescrol\">\n" +
                    "                        <li id=\"channel_menu" + i + "\">\n" +
                    "                            <a href=\"#\" class=\"waves-effect\">\n" +
                    "                                <span class=\"card-title\">" + data[i].networkname + "</span>\n" +
                    "                                <i class=\"fa fa-angle-left float-right\" style=\"color: black\"></i>\n" +
                    "                            </a>\n" +
                    "                        </li>\n" +
                    "                    </ul></div>")
                for (j = 0; j < data[i].channelList.length; j++) {
                    $("#channel_menu" + i).append("<ul class='sidebar-submenu'>\n" +
                        "                                <li>\n" +
                        "                                    <a href='#' class='waves-effect'>\n" +
                        "                                        <span style=\"color: black;font-size: 1.0rem\">" + data[i].channelList[j].channelname + "</span>\n" +
                        "                                        <i class='fa fa-angle-left float-right' style=\"color: black\"></i>\n" +
                        "                                    </a>\n" +
                        "                                    <ul class='sidebar-submenu' id=\"instantisted" + i + j + "\">\n" +
                        "                                    </ul>\n" +
                        "                                </li>\n" +
                        "                            </ul>")
                    for (k = 0; k < data[i].channelList[j].chaincodeList.length; k++) {
                        $("#instantisted" + i + j + "").append("<li>\n" +
                            "                                            <a class=\"icheck-material-primary\" style=\"margin-left:6%\">\n" +
                            "                                                <input type=\"checkbox\" name=\"chaincode_id\" value='" + data[i].channelList[j].chaincodeList[k].chaincodeId + "3'  id=\"" + data[i].channelList[j].chaincodeList[k].chaincodeName + i + j + k + "\">\n" +
                            "                                                <label for=\"" + data[i].channelList[j].chaincodeList[k].chaincodeName + i + j + k + "\">" + data[i].channelList[j].chaincodeList[k].chaincodeName + "</label>\n" +
                            "                                            </a>\n" +
                            "                                        </li>")
                    }
                }
            }
            //初始化菜单
            menu()
        }

        function error_of_respons_function() {
            allnetwork = "<div class=\"col-lg-6\">\
                        <div class=\"card\">\
                            <div class = \"col-sm-12 col-xs-12\"><div class = \"card-title text-primary\" style = \"padding-top: 1.0rem\">连接失败！</div>\
                            </div>\
                            <div class=\"card-body\">\
                                <div id=\"treeview\" class=\"treeview\">\
                                    <ul class = \"list-group\">\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </div>"
            $("#allnetwork").html(allnetwork)

        }
    }

    //初始化菜单
    function menu() {

        $.sidebarMenu($('.sidebar-menu'));

        $.sidebarMenu = function (menu) {
            var animationSpeed = 300,
                subMenuSelector = '.sidebar-submenu';
            $(menu).on('click', 'li a', function (e) {
                var $this = $(this);
                var checkElement = $this.next();
                if (checkElement.is(subMenuSelector) && checkElement.is(':visible')) {
                    checkElement.slideUp(animationSpeed, function () {
                        checkElement.removeClass('menu-open');
                    });
                    checkElement.parent("li").removeClass("active");
                }
                //If the menu is not visible
                else if ((checkElement.is(subMenuSelector)) && (!checkElement.is(':visible'))) {
                    //Get the parent menu
                    var parent = $this.parents('ul').first();
                    //Close all open menus within the parent
                    var ul = parent.find('ul:visible').slideUp(animationSpeed);
                    //Remove the menu-open class from the parent
                    ul.removeClass('menu-open');
                    //Get the parent li
                    var parent_li = $this.parent("li");
                    //Open the target menu and add the menu-open class
                    checkElement.slideDown(animationSpeed, function () {
                        //Add the class active to the parent li
                        checkElement.addClass('menu-open');
                        parent.find('li.active').removeClass('active');
                        parent_li.addClass('active');
                    });
                }
                //if this isn't a link, prevent the page from being redirected
                if (checkElement.is(subMenuSelector)) {
                    e.preventDefault();
                }
            });
        }

        for (var i = window.location, o = $(".sidebar-menu a").filter(function () {
            return this.href == i;
        }).addClass("active").parent().addClass("active"); ;) {
            if (!o.is("li")) break;
            o = o.parent().addClass("in").parent().addClass("active");
        }
    }
})