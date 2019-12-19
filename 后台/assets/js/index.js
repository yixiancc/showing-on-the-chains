$(document).ready(function () {
    ip = "192.168.1.148";
    port = 8095;
    if (window.sessionStorage.token) {

    } else {
        window.location.href = 'login.html'
    }

    $("#newsettings").hide();
    $("#allsettings").hide();
    $("#allnetwork").hide();
    $("#allapply").hide();
    $("#allnewapply").hide();

    $("#out").click(function () {
        sessionStorage.removeItem('token')
    });
    //添加配置
    $("#new").click(function () {
        $("#allsettings").hide();
        $("#newsettings").show();
        $("#allapply").hide();
        $("#allnetwork").hide();
        $("#allnewapply").hide()
    });

    //全部配置ajax
    $("#all").click(function () {
        $(".edit_class").remove();
        $("#newsettings").hide();
        $("#allnetwork").hide();
        $("#allsettings").show();
        $("#allapply").hide();
        $("#allnewapply").hide();
        allsettings()
    });

    //添加配置ajax
    $("#newsetting_submit").click(function () {
        newsettings()
    });

    //查看网络信息
    $("#network").click(function () {
        $("#newsettings").hide();
        $("#allsettings").hide();
        $("#allnetwork").show();
        $("#allapply").hide();
        $("#allnewapply").hide();
        allnetworks()
    });

    $("#apply, #apply_window").click(function () {
        $("#newsettings").hide();
        $("#allsettings").hide();
        $("#allnetwork").hide();
        acceptapply();
        $("#allapply").show();
        $("#allnewapply").hide()
    });

    $("#newapply, #newapply_window").click(function () {
        $("#newsettings").hide();
        $("#allsettings").hide();
        $("#allnetwork").hide();
        acceptnewapply();
        $("#allapply").hide();
        $("#allnewapply").show()
    })
});

//添加新配置ajax
function newsettings() {
    networkName = document.getElementById("networkName").value;
    clientAlias = document.getElementById("clientAlias").value;
    orgMSPID = document.getElementById("orgMSPID").value;
    clientWorkAbsDir = document.getElementById("clientWorkAbsDir").value;
    mspConfigRelPath = document.getElementById("mspConfigRelPath").value;
    ordererLocation = document.getElementById("ordererLocation").value;
    peerLocation = document.getElementById("peerLocation").value;
    openTLSByDefault = document.getElementById("openTLSByDefault").value;
    tlsCertFile = document.getElementById("tlsCertFile").value;
    tlsKeyFile = document.getElementById("tlsKeyFile").value;
    tlsRootCertFile = document.getElementById("tlsRootCertFile").value;

    data = "{\"networkName\":\"" + networkName + "\",\
    \"clientalias\":\"" + clientAlias + "\",\
    \"orgmspid\":\"" + orgMSPID + "\",\
    \"clientworkabsdir\":\"" + clientWorkAbsDir + "\",\
    \"mspconfigrelpath\":\"" + mspConfigRelPath + "\",\
    \"ordereralias\":\"\",\
    \"ordererlocation\":\"" + ordererLocation + "\",\
    \"peeralias\":\"\",\
    \"peerlocation\":\"" + peerLocation + "\",\
    \"opentlsbydefault\":\"" + openTLSByDefault + "\",\
    \"tlscertfile\":\"" + tlsCertFile + "\",\
    \"tlskeyfile\":\"" + tlsKeyFile + "\",\
    \"tlsrootcertfile\":\"" + tlsRootCertFile + "\",\
    \"cafile\":\"\",\
    \"gopath\":\"\"}";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/addNewNetworkInfo",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        if (data.status == 200) {
            swal("添加成功！", "正在获取网络信息...", "success");
        } else {
            swal("添加失败！", "" + data.message + "", "error");
        }

    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }
}

//查看配置ajax
function allsettings() {

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/getNetworkConfig",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        settings = "";
        edit_model = "";
        for (i = 0; i < datalist.length; i++) {
            data = JSON.stringify(datalist[i]);
            data = eval("(" + data + ")");
            networkid = data.networkId;
            // 配置信息框
            settings = settings + "<div class = \"col-lg-6\">\
                        <div class=\"card\">\
                            <div class=\"col-sm-12 col-xs-12\">\
                                <div class=\"card-title text-primary\" style=\"padding-top: 1.0rem\">\
                                    网络配置信息" + networkid + "\
                                </div>\
                            </div>\
                            <div class=\"card-body\">\
                                <div class=\"row form-group\">\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>networkName</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.networkName + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>clientAlias</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.clientalias + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>orgMSPID</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.orgmspid + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>clientWorkAbsDir</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.clientworkabsdir + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>mspConfigRelPath</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.mspconfigrelpath + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>ordererLocation</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.ordererlocation + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>peerLocation</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.peerlocation + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>openTLSByDefault</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.opentlsbydefault + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>tlsCertFile</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.tlscertfile + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>tlsKeyFile</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.tlskeyfile + "</label>\
                                    </div>\
                                    <div class=\"col-3\" style=\"padding-bottom:0.5rem\">\
                                        <label>tlsRootCertFile</label>\
                                    </div>\
                                    <div class=\"col-9\" style=\"padding-bottom:0.5rem\">\
                                        <label>" + data.tlsrootcertfile + "</label>\
                                    </div>\
                                </div>\
                                <div class=\"row\" style=\"padding: 0rem\">\
                                    <div class=\"col-9\">\
                                    </div>\
                                    <div class=\"col-3\">\
                                        <button class=\"btn btn-primary btn-sm waves-effect waves-light m-1\" id=\"edit\"\
                                            data-toggle=\"modal\" data-target=\"#defaultsizemodal" + networkid + "\">修改</button>\
                                        <button class=\"btn btn-primary btn-sm waves-effect waves-light m-1 del\"\
                                         value=\"" + networkid + "\" onclick=\"del(value)\">删除</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    ";

            // 修改配置model
            edit_model = edit_model + "<div class=\"modal fade edit_class\" id=\"defaultsizemodal" + networkid + "\">\
                    <div class=\"modal-dialog model-lg\">\
                        <div class=\"modal-content\" style=\"width:250%;margin-left:-75%\">\
                            <div class=\"modal-header\">\
                                <h5 class = \"modal-title text-primary\">修改网络配置信息" + networkid + "</h5>\
                                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\
                                    <span aria-hidden=\"true\">&times;</span>\
                                </button>\
                            </div>\
                            <div class=\"modal-body\">\
                                <div class=\"row\">\
                                    <div class=\"col-4\">\
                                        <div class=\"form-group\">\
                                            <label>networkName</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_networkName" + networkid + "\" value=\"" + data.networkName + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-2\">clientAlias</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_clientAlias" + networkid + "\" value=\"" + data.clientalias + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-3\">orgMSPID</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_orgMSPID" + networkid + "\" value=\"" + data.orgmspid + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-4\">clientWorkAbsDir</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_clientWorkAbsDir" + networkid + "\"\
                                                value=\"" + data.clientworkabsdir + "\">\
                                        </div>\
                                    </div>\
                                    <div class=\"col-4\">\
                                        <div class=\"form-group\">\
                                            <label for=\"input-5\">mspConfigRelPath</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_mspConfigRelPath" + networkid + "\"\
                                                value=\"" + data.mspconfigrelpath + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-2\">ordererLocation</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_ordererLocation" + networkid + "\"\
                                                value=\"" + data.ordererlocation + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-4\">peerLocation</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_peerLocation" + networkid + "\"\
                                                value=\"" + data.peerlocation + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-5\">openTLSByDefault</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_openTLSByDefault" + networkid + "\" value=\"" + data.opentlsbydefault + "\">\
                                        </div>\
                                    </div>\
                                    <div class=\"col-4\">\
                                        <div class=\"form-group\">\
                                            <label>tlsCertFile</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_tlsCertFile" + networkid + "\"\
                                                value=\"" + data.tlscertfile + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-2\">tlsKeyFile</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_tlsKeyFile" + networkid + "\"\
                                                value=\"" + data.tlskeyfile + "\">\
                                        </div>\
                                        <div class=\"form-group\">\
                                            <label for=\"input-3\">tlsRootCertFile</label>\
                                            <input type=\"text\" class=\"form-control\" id=\"edit_tlsRootCertFile" + networkid + "\"\
                                                value=\"" + data.tlsrootcertfile + "\">\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class=\"modal-footer\">\
                                <button type=\"button\" class=\"btn btn-inverse-primary\" data-dismiss=\"modal\"><i\
                                        class=\"fa fa-times\"></i>不保存关闭</button>\
                                <button type=\"button\" class=\"btn btn-primary edit_ajax\" data-dismiss=\"modal\" value=\"" + networkid + "\" onclick=\"editsettings(value)\"><i\
                                        class=\"fa fa-check-square-o\"></i>保存</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>"
        }
        $("#allsettings").html(settings);
        $("#edit_model").append(edit_model)
    }

    function error_of_respons_function() {
        settings = "<div class = \"col-lg-6\">\
                        <div class=\"card\">\
                            <div class=\"col-sm-12 col-xs-12\">\
                                <div class=\"card-title text-primary\" style=\"padding-top: 1.0rem\">\
                                    获取配置失败\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    ";
        $("#allsettings").html(settings)

    }
}

//删除配置ajax
function delsettings(value) {
    data = "{\"networkId\":\"" + value + "\"}";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/deleteNetworkConfig",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        if (data.status == 200) {
            swal("删除成功！", "重新获取列表中...", "success");
            allsettings()
        } else {
            swal("删除失败！", "" + data.message + "", "error");
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }


}

//修改配置ajax
function editsettings(value) {

    networkName = document.getElementById("edit_networkName" + value).value;
    clientAlias = document.getElementById("edit_clientAlias" + value).value;
    orgMSPID = document.getElementById("edit_orgMSPID" + value).value;
    clientWorkAbsDir = document.getElementById("edit_clientWorkAbsDir" + value).value;
    mspConfigRelPath = document.getElementById("edit_mspConfigRelPath" + value).value;
    ordererLocation = document.getElementById("edit_ordererLocation" + value).value;
    peerLocation = document.getElementById("edit_peerLocation" + value).value;
    openTLSByDefault = document.getElementById("edit_openTLSByDefault" + value).value;
    tlsCertFile = document.getElementById("edit_tlsCertFile" + value).value;
    tlsKeyFile = document.getElementById("edit_tlsKeyFile" + value).value;
    tlsRootCertFile = document.getElementById("edit_tlsRootCertFile" + value).value;

    data = "{\"networkName\":\"" + networkName + "\",\
    \"networkId\":\"" + value + "\",\
    \"clientalias\":\"" + clientAlias + "\",\
    \"orgmspid\":\"" + orgMSPID + "\",\
    \"clientworkabsdir\":\"" + clientWorkAbsDir + "\",\
    \"mspconfigrelpath\":\"" + mspConfigRelPath + "\",\
    \"ordereralias\":\"\",\
    \"ordererlocation\":\"" + ordererLocation + "\",\
    \"peeralias\":\"\",\
    \"peerlocation\":\"" + peerLocation + "\",\
    \"opentlsbydefault\":\"" + openTLSByDefault + "\",\
    \"tlscertfile\":\"" + tlsCertFile + "\",\
    \"tlskeyfile\":\"" + tlsKeyFile + "\",\
    \"tlsrootcertfile\":\"" + tlsRootCertFile + "\",\
    \"cafile\":\"\",\
    \"gopath\":\"\"}";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/updateNetworkConfig",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        if (data.status == 200) {
            swal("修改成功!", "重新获取网络配置中...", "success");
            allsettings()
        } else {
            swal("修改失败！", "" + data.message + "", "error");
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");

    }
}

//全部网络配置
function allnetworks() {

    allnetwork = "";
    network = "";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/getNetworkInformation",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        for (i = 0; i < data.length; i++) {
            network = "<li class=\"list-group-item node-treeview1\"></span>网络名称：" + data[i].networkname + "</li>";
            for (j = 0; j < data[i].channelList.length; j++) {
                network = network + "<li class=\"list-group-item node-treeview1\"><span class=\"indent\"></span>通道" + j + "名称：" + data[i].channelList[j].channelname + "</li>";
                for (k = 0; k < data[i].channelList[j].chaincodeList.length; k++) {
                    network = network + "<li class=\"list-group-item node-treeview1\"><span class=\"indent\"></span><span class=\"indent\"></span>智能合约" + k + "名称：" + data[i].channelList[j].chaincodeList[k].chaincodeName + "</li>"
                }
            }

            allnetwork = allnetwork + "<div class=\"col-lg-6\">\
                        <div class=\"card\">\
                            <div class = \"col-sm-12 col-xs-12\"><div class = \"card-title text-primary\" style = \"padding-top: 1.0rem\">网络信息" + data[i].networkId + "</div>\
                            </div>\
                            <div class=\"card-body\">\
                                <div id=\"treeview\" class=\"treeview\">\
                                    <ul class = \"list-group\">" + network + "\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </div>"
        }
        $("#allnetwork").html(allnetwork)
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
                    </div>";
        $("#allnetwork").html(allnetwork)
    }
}

//管理员获取用户注册申请
function acceptapply() {
    apply = "";
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/getUserRegister",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        sessionStorage.setItem("applyaccount", data.length);
        applyaccount = sessionStorage.getItem("applyaccount");
        // apply_length = data.length
        // sessionStorage.setItem('apply_length', apply_length)
        if (data.length == 0) {
            nullapply = "<div class = \"col-lg-12\">\
                        <div class=\"pricing-table\">\
                            <div class=\"card\">\
                                <div class=\"card-body\">\
                                    <div class=\"price-title text-primary text-center\">\
                                        <font style=\"vertical-align: inherit;\">\
                                            <font style = \"vertical-align: inherit;\">暂无用户申请！</font>\
                                        </font>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>";
            $("#allapply").html(nullapply)
        } else {
            for (i = 0; i < data.length; i++) {
                applycc = "";
                userApplyAuthority = JSON.parse(data[i].userApplyAuthority);
                for (j = 0; j < userApplyAuthority.length; j++) {
                    applycc = applycc + "<li class=\"list-group-item\">\
                                            用户申请内容:\
                                            <b id=\"userApplyAuthority\">\
                                            " + userApplyAuthority[j].networkName + "/" + userApplyAuthority[j].channelName + "/" + userApplyAuthority[j].chaincodeName + "\
                                            </b>\
                                        </li>"
                }
                apply = apply + "<div class=\"col-lg-4\">\
                        <div class=\"pricing-table\">\
                            <div class=\"card\">\
                                <div class=\"card-body\">\
                                    <div class=\"price-title text-primary text-center\">\
                                        <font style=\"vertical-align: inherit;\">\
                                            <font style = \"vertical-align: inherit;\">用户申请" + data[i].userId + "</font>\
                                        </font>\
                                    </div>\
                                    <ul class=\"list-group list-group-flush\">\
                                        <li class=\"list-group-item\">用户名：<b>\
                                                " + data[i].userApplyAccount + " </b>\
                                        </li>\
                                        <li class=\"list-group-item\">用户密码：<b id=\"userApplyPassword\">\
                                                " + data[i].userApplyPassword + " </b>\
                                        </li>\
                                        <li class=\"list-group-item\">\
                                            用户申请时间：\
                                            <b id=\"userApplyStarttime\">\
                                            " + data[i].userApplyStarttime + " </b>\
                                        </li>\
                                        " + applycc + "\
                                        <li class = \"list-group-item text-center\">\
                                        <button href = \"#\" value = " + data[i].userId + " onclick=\"getpassid(value)\" class=\"btn btn-primary my-1\"\
                                            style=\"font-size: 13px\">\
                                            通过\
                                        </button>\
                                        <button href = \"#\" value = " + data[i].userId + " onclick=\"refusepassid(value)\" class=\"btn btn-danger my-1\"\
                                            style=\"font-size: 13px\" data-toggle=\"modal\" data-target=\"#reason_model\">\
                                            拒绝\
                                        </button>\
                                        </li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </div>"
            }
            $("#allapply").html(apply)
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }
}

//管理员获取申请新权限
function acceptnewapply() {
    newapply = "";
    nullnewapply = "";
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/getNewApply",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        sessionStorage.setItem("newapplyaccount", data.length);
        newapplyaccount = sessionStorage.getItem("newapplyaccount");
        // newapply_length = data.length
        // sessionStorage.setItem('newapply_length', newapply_length)
        if (data.length == 0) {
            nullnewapply = "<div class = \"col-lg-12\">\
                        <div class=\"pricing-table\">\
                            <div class=\"card\">\
                                <div class=\"card-body\">\
                                    <div class=\"price-title text-primary text-center\">\
                                        <font style=\"vertical-align: inherit;\">\
                                            <font style = \"vertical-align: inherit;\">暂无用户新权限申请！</font>\
                                        </font>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>";
            $("#allnewapply").html(nullnewapply)
        } else {
            for (i = 0; i < data.length; i++) {
                applynewcc = "";
                usernewApplyAuthority = JSON.parse(data[i].userApplyAuthority);
                for (j = 0; j < usernewApplyAuthority.length; j++) {
                    applynewcc = applynewcc + "<li class=\"list-group-item\">\
                                            用户申请内容:\
                                            <b id=\"usernewApplyAuthority\">\
                                            " + usernewApplyAuthority[j].networkName + "/" + usernewApplyAuthority[j].channelName + "/" + usernewApplyAuthority[j].chaincodeName + "\
                                            </b>\
                                        </li>"
                }
                newapply = newapply + "<div class=\"col-lg-4\">\
                        <div class=\"pricing-table\">\
                            <div class=\"card\">\
                                <div class=\"card-body\">\
                                    <div class=\"price-title text-primary text-center\">\
                                        <font style=\"vertical-align: inherit;\">\
                                            <font style = \"vertical-align: inherit;\">用户新申请" + data[i].userId + "</font>\
                                        </font>\
                                    </div>\
                                    <ul class=\"list-group list-group-flush\">\
                                        <li class=\"list-group-item\">用户名：<b>\
                                                " + data[i].userApplyAccount + " </b>\
                                        </li>\
                                        <li class=\"list-group-item\">用户密码：<b id=\"userApplyPassword\">\
                                                " + data[i].userApplyPassword + " </b>\
                                        </li>\
                                        <li class=\"list-group-item\">\
                                            用户申请时间：\
                                            <b id=\"userApplyStarttime\">\
                                            " + data[i].userApplyStarttime + " </b>\
                                        </li>\
                                        " + applynewcc + "\
                                        <li class = \"list-group-item text-center\">\
                                        <button href = \"#\" value = " + data[i].userId + " onclick=\"getnewpassid(value)\" class=\"btn btn-primary my-1\"\
                                            style=\"font-size: 13px\">\
                                            通过\
                                        </button>\
                                        <button href = \"#\" value = " + data[i].userId + " onclick=\"refusenewpassid(value)\" class=\"btn btn-danger my-1\"\
                                            style=\"font-size: 13px\"  data-toggle=\"modal\" data-target=\"#reason_model\">\
                                            拒绝\
                                        </button>\
                                        </li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </div>"
            }
            $("#allnewapply").html(newapply)
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }
}

//管理员用户申请通过
function passapply(value) {
    data = "{\"userId\":" + value + "}";
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/acceptRegisterApply",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        if (data.status == 200) {
            swal("通过成功！", "success");
            acceptapply();
            acceptnewapply()
        } else {
            swal("通过失败！", "" + data.message + "", "error");
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }
}

//管理员用户新申请通过
function passnewapply(value) {
    data = "{\"userId\":" + value + "}";
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/acceptNewApply",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        if (data.status == 200) {
            swal("通过成功！", "success");
            acceptapply();
            acceptnewapply()
        } else {
            swal("通过失败！", "" + data.message + "", "error");
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }
}

//管理员用户申请拒绝
function refuseapply(value) {
    data = "{\"userId\":" + value + "}";
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/refuseUserApply ",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        if (data.status == 200) {
            acceptapply();
            acceptnewapply()
        } else {
            swal("拒绝失败！", "" + data.message + "", "error");
        }
    }

    function error_of_respons_function() {
        swal("连接失败！", "error");
    }
}