$(document).ready(function () {
    ip = "192.168.1.148";
    port = 8095;
    page = 0;
    skip = 0;
    querywindow = 0;


    $("#all").hide();
    $("#query_window").hide();

    //点击打开query，再次点击关闭
    $("#query_window_show").click(function () {
        if (querywindow == 0) {
            $("#query_window").show();
            querywindow = 1
        } else {
            $("#query_window").hide();
            querywindow = 0
        }
    });


    //获取全部网络信息
    allnetworks();

    //点击打开获取用户审批进度
    $("#applying").click(function () {
        applying()
    });

    //获取选择智能合约id
    $("#reg_apply").click(function () {
        //定义数组
        var chaincode_arr = [];
        //检索所有被选择
        $("input[class='chaincode_id']:checked").each(function (i) {
            chaincode_arr.push("\\\"" + $(this).val() + "\\\"")
        });
        //提交
        reg_apply(chaincode_arr);
    });

    //判断浏览器是否支持sessionstorage
    if (window.localStorage.token) {

    } else {
        alert("无token，请重新登录。");
        window.location.href = 'login.html'
    }

    //登出删除token、userid
    $("#out").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        window.location.href = 'login.html'
    });

    // 隐藏查询数据,展示元数据
    $("#querydata").hide();
    $("#metadata").show();
    $("#instantisted_head").hide();

    //界面上部query代码框
    query_code();

    //表格动态代码
    //获取选择展示数
    var options = $("#table_page option:selected");
    var query_options = $("#table_page option:selected");
    //获取展示数
    var page = options.val();
    var query_page = query_options.val();


    //页码按钮
    //首页按钮点击事件
    $("#table_page_first").click(function () {
        page = sessionStorage.getItem('table_page');
        skip = 0;
        table_ajax(page, skip);
    });

    //上一页按钮点击事件
    $("#table_page_up").click(function () {
        page = sessionStorage.getItem('table_page');
        skip = parseInt(skip) - parseInt(page);
        //若相减后小于0，则skip为零
        if (parseInt(skip) < 0) {
            skip = 0
        } else {
            table_ajax(page, skip);
        }
    });
    //下一页按钮点击事件
    $("#table_page_next").click(function () {
        page = sessionStorage.getItem('table_page');
        skip = parseInt(skip) + parseInt(page);
        table_ajax(page, skip);
    });

    //隐藏json展示
    $("#json_json").hide();
    $("#query_json_json").hide();

    //动态json获取
    //点击更换json展示，并传入json数据
    $("#table_json_button").click(function () {
        //删除剩下旧的json
        $(".json_code").remove();

        //json动态代码
        //获取选择展示数
        var options = $("#json_page option:selected");
        //获取展示数
        var page = options.val();

        //执行ajax
        skip = 0;
        json_ajax(page, skip);

        $("#table_table").hide();
        $("#json_json").show();
    });

    //点击更换json展示，并传入json数据
    $("#json_json_button").click(function () {

        //json动态代码
        //获取选择展示数
        var options = $("#json_page option:selected");
        //获取展示数
        var page = options.val();
        //删除剩下旧的json
        $(".json_code").remove();

        //执行ajax
        skip = 0;
        json_ajax(page, skip);

        $("#table_table").hide();
        $("#json_json").show();
    });

    //页码按钮
    //首页按钮点击事件
    $("#json_page_first").click(function () {
        page = sessionStorage.getItem('json_page');
        $(".json_code").remove();
        skip = 0;
        json_ajax(page, skip);
    });

    //上一页按钮点击事件
    $("#json_page_up").click(function () {
        page = sessionStorage.getItem('json_page');
        skip = parseInt(skip) - parseInt(page);
        if (parseInt(skip) < 0) {
            skip = 0
        } else {
            json_ajax(page, skip);
        }
    });

    //下一页按钮点击事件
    $("#json_page_next").click(function () {
        page = sessionStorage.getItem('json_page');
        $(".json_code").remove();
        skip = parseInt(skip) + parseInt(page);
        json_ajax(page, skip);
    });


    //点击更换table并删除json
    $("#table_table_button").click(function () {
        $("#table_table").show();
        $("#json_json").hide();
        $(".json_h5").remove();
        $(".json_pre").remove();
    });

    //点击更换table并删除json
    $("#json_table_button").click(function () {
        $("#table_table").show();
        $("#json_json").hide();
        $(".json_h5").remove();
        $(".json_pre").remove();
    });


    //点击返回元数据
    $("#metadata_button").click(function () {
        $("#querydata").hide();
        $("#metadata").show();
    });

    //query查询点击事件
    $("#query").click(function () {
        //表格动态代码
        //获取选择展示数
        var query_options = $("#table_page option:selected");
        //获取展示数
        var query_page = query_options.val();
        $("#metadata_button").show();
        $("#metadata").hide();
        query_code();
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        queryStr = JSON.parse(queryStr);
        if (queryStr.skip != undefined && queryStr.sort != undefined) {
            //有skip，有sort
            query_skip = 0;
            //读取用户输入skip，并保存
            new_skip = queryStr.skip;
            new_sort = queryStr.sort;
            sessionStorage.setItem("new_skip", new_skip);
            sessionStorage.setItem("new_sort", new_sort);
            //转回字符类型，执行ajax
            queryStr = JSON.stringify(queryStr);
            query_table_ajax(query_page, queryStr);
            //删除已生成json，并执行query_json
            $(".query_json_code").remove();
            query_json_ajax(query_page, queryStr);
            $("#querydata").show();
        } else if (queryStr.skip == undefined && queryStr.sort != undefined) {
            //没有skip,有sort
            query_skip = 0;
            //读取用户代码段拼接query_skip
            selector = queryStr.selector;
            sort = queryStr.sort;
            queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

            query_table_ajax(query_page, queryStr);
            $(".query_json_code").remove();
            query_json_ajax(query_page, queryStr);
            $("#querydata").show();
        } else if (queryStr.skip != undefined && queryStr.sort == undefined) {
            //有skip，没有sort
            query_skip = 0;
            //读取用户输入skip，并保存
            new_skip = queryStr.skip;
            sessionStorage.setItem("new_skip", new_skip);
            //转回字符类型，执行ajax
            queryStr = JSON.stringify(queryStr);
            query_table_ajax(query_page, queryStr);
            //删除已生成json，并执行query_json
            $(".query_json_code").remove();
            query_json_ajax(query_page, queryStr);
            $("#querydata").show();
        } else if (queryStr.skip == undefined && queryStr.sort == undefined) {
            //没有skip，没有sort
            query_skip = 0;
            //读取用户代码段拼接query_skip
            selector = queryStr.selector;
            queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

            query_table_ajax(query_page, queryStr);
            $(".query_json_code").remove();
            query_json_ajax(query_page, queryStr);
            $("#querydata").show();
        }
    });


    //页码按钮
    //首页按钮点击事件
    $("#query_table_page_first").click(function () {
        query_page = sessionStorage.getItem('query_table_page');
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        queryStr = JSON.parse(queryStr);
        new_skip = sessionStorage.getItem("new_skip");
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                query_skip = new_skip;
                selector = queryStr.selector;
                sort = queryStr.sort;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_table_ajax(query_page, queryStr);
            } else {
                //有skip,没有sort
                query_skip = new_skip;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_table_ajax(query_page, queryStr);
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                query_skip = 0;
                selector = queryStr.selector;
                sort = queryStr.sort;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_table_ajax(query_page, queryStr);
            } else {
                //没有skip,没有sort
                query_skip = 0;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_table_ajax(query_page, queryStr);
            }
        }
    });

    //上一页按钮点击事件
    $("#query_table_page_up").click(function () {
        query_page = sessionStorage.getItem('query_table_page');

        //读取query代码
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        //修改skip
        queryStr = JSON.parse(queryStr);
        new_skip = sessionStorage.getItem("new_skip");
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                sort = queryStr.sort;
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < parseInt(new_skip)) {
                    query_skip = new_skip
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";
                    query_table_ajax(query_page, queryStr);
                }
            } else {
                //有skip,没有sort
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < parseInt(new_skip)) {
                    query_skip = new_skip
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";
                    query_table_ajax(query_page, queryStr);
                }
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                sort = queryStr.sort;
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < 0) {
                    query_skip = 0
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";
                    query_table_ajax(query_page, queryStr);
                }
            } else {
                //没有skip,没有sort
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < 0) {
                    query_skip = 0
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";
                    query_table_ajax(query_page, queryStr);
                }
            }
        }
    });

    // 下一页按钮点击事件
    $("#query_table_page_next").click(function () {
        query_page = sessionStorage.getItem('query_table_page');

        //读取query代码
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        //修改skip
        queryStr = JSON.parse(queryStr);
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                new_skip = sessionStorage.getItem("new_skip");
                if (query_skip == 0) {
                    //第一次点击下一页
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    sort = queryStr.sort;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_table_ajax(query_page, queryStr);
                } else {
                    //之后点击下一页
                    new_skip = 0;
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    sort = queryStr.sort;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_table_ajax(query_page, queryStr);
                }
            } else {
                //有skip,没有sort
                new_skip = sessionStorage.getItem("new_skip");
                if (query_skip == 0) {
                    //第一次点击下一页
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_table_ajax(query_page, queryStr);
                } else {
                    //之后点击下一页
                    new_skip = 0;
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_table_ajax(query_page, queryStr);
                }
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                query_skip = parseInt(query_skip) + parseInt(query_page);
                selector = queryStr.selector;
                sort = queryStr.sort;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_table_ajax(query_page, queryStr);
            } else {
                //没有skip,没有sort
                query_skip = parseInt(query_skip) + parseInt(query_page);
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_table_ajax(query_page, queryStr);
            }
        }
    });

    //点击更换query_table并删除query_json
    $("#query_table_button").click(function () {
        $("#query_table_table").show();
        $("#query_json_json").hide();
        $(".query_json_h5").remove();
        $(".query_json_pre").remove();

        //执行ajax
        query_code();
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        queryStr = JSON.parse(queryStr);
        new_skip = sessionStorage.getItem("new_skip");
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                sort = queryStr.sort;
                if (query_skip == 0) {
                    //第一页点击json
                    query_skip = new_skip;
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_table_ajax(query_page, queryStr);
                } else {
                    //之后点击json
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_table_ajax(query_page, queryStr);
                }
            } else {
                //有skip,没有sort
                if (query_skip == 0) {
                    //第一页点击json
                    query_skip = new_skip;
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_table_ajax(query_page, queryStr);
                } else {
                    //之后点击json
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_table_ajax(query_page, queryStr);
                }
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                selector = queryStr.selector;
                sort = queryStr.sort;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + sort + "}";

                query_table_ajax(query_page, queryStr);
            } else {
                //没有skip,没有sort
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_table_ajax(query_page, queryStr);
            }
        }
    });


    //query_json获取
    //点击更换json展示，并传入json数据
    $("#query_json_button").click(function () {

        //json动态代码
        //获取选择展示数
        var options = $("#query_json_page option:selected");

        //获取展示数
        var query_page = options.val();
        //删除剩下旧的json
        $(".query_json_code").remove();

        //执行ajax
        query_code();
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        queryStr = JSON.parse(queryStr);
        new_skip = sessionStorage.getItem("new_skip");
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                sort = queryStr.sort;
                if (query_skip == 0) {
                    //第一页点击json
                    query_skip = new_skip;
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_json_ajax(query_page, queryStr);
                    $("#query_table_table").hide();
                    $("#query_json_json").show();
                } else {
                    //之后点击json
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_json_ajax(query_page, queryStr);
                    $("#query_table_table").hide();
                    $("#query_json_json").show();
                }
            } else {
                //有skip,没有sort
                if (query_skip == 0) {
                    //第一页点击json
                    query_skip = new_skip;
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_json_ajax(query_page, queryStr);
                    $("#query_table_table").hide();
                    $("#query_json_json").show();
                } else {
                    //之后点击json
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_json_ajax(query_page, queryStr);
                    $("#query_table_table").hide();
                    $("#query_json_json").show();
                }
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                sort = queryStr.sort;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_json_ajax(query_page, queryStr);
                $("#query_table_table").hide();
                $("#query_json_json").show();
            } else {
                //没有skip,没有sort
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_json_ajax(query_page, queryStr);
                $("#query_table_table").hide();
                $("#query_json_json").show();
            }
        }
    });

    //页码按钮
    //首页按钮点击事件
    $("#query_json_page_first").click(function () {
        query_page = sessionStorage.getItem('query_json_page');
        new_skip = sessionStorage.getItem("new_skip");
        $(".query_json_code").remove();
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        queryStr = JSON.parse(queryStr);
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                sort = queryStr.sort;
                query_skip = new_skip;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_json_ajax(query_page, queryStr);
            } else {
                //有skip,没有sort
                query_skip = new_skip;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_json_ajax(query_page, queryStr);
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                sort = queryStr.sort;
                query_skip = 0;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_json_ajax(query_page, queryStr);
            } else {
                //没有skip,没有sort
                query_skip = 0;
                selector = queryStr.selector;
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_json_ajax(query_page, queryStr);
            }
        }
    });

    //上一页按钮点击事件
    $("#query_json_page_up").click(function () {
        query_page = sessionStorage.getItem('query_json_page');
        $(".query_json_code").remove();
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");

        queryStr = JSON.parse(queryStr);
        new_skip = sessionStorage.getItem("new_skip");
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                sort = queryStr.sort;
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < parseInt(new_skip)) {
                    query_skip = new_skip
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";
                    query_json_ajax(query_page, queryStr);
                }
            } else {
                //有skip,没有sort
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < parseInt(new_skip)) {
                    query_skip = new_skip
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";
                    query_json_ajax(query_page, queryStr);
                }
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                sort = queryStr.sort;
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < 0) {
                    query_skip = 0
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";
                    query_json_ajax(query_page, queryStr);
                }
            } else {
                //没有skip,没有sort
                query_skip = parseInt(query_skip) - parseInt(query_page);
                if (parseInt(query_skip) < 0) {
                    query_skip = 0
                } else {
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";
                    query_json_ajax(query_page, queryStr);
                }
            }
        }
    });

    //下一页按钮点击事件
    $("#query_json_page_next").click(function () {
        query_page = sessionStorage.getItem('query_json_page');
        new_skip = sessionStorage.getItem("new_skip");
        $(".query_json_code").remove();
        queryStr = sessionStorage.getItem('w_queryStr');
        queryStr = queryStr.replace(/ /g, "");
        queryStr = queryStr.replace(/[\r\n]/g, "");
        queryStr = JSON.parse(queryStr);
        if (queryStr.skip != undefined) {
            //有skip
            if (queryStr.sort != undefined) {
                //有skip,有sort
                sort = queryStr.sort;
                if (query_skip == 0) {
                    //第一次点击下一页
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_json_ajax(query_page, queryStr);
                } else {
                    //之后点击
                    new_skip = 0;
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                    query_json_ajax(query_page, queryStr);
                }
            }else{
                //有skip,没有sort
                if (query_skip == 0) {
                    //第一次点击下一页
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_json_ajax(query_page, queryStr);
                } else {
                    //之后点击
                    new_skip = 0;
                    query_skip = parseInt(query_skip) + parseInt(query_page) + parseInt(new_skip);
                    selector = queryStr.selector;
                    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                    query_json_ajax(query_page, queryStr);
                }
            }
        } else {
            //没有skip
            if (queryStr.sort != undefined) {
                //没有skip,有sort
                sort = queryStr.sort;
                selector = queryStr.selector;
                query_skip = parseInt(query_skip) + parseInt(query_page);
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + ",\"sort\":" + JSON.stringify(sort) + "}";

                query_json_ajax(query_page, queryStr);
            }else{
                //没有skip,没有sort
                selector = queryStr.selector;
                query_skip = parseInt(query_skip) + parseInt(query_page);
                queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

                query_json_ajax(query_page, queryStr);
            }
        }
    })
});

//上部代码框代码封装
function query_code() {
    //初始化对象
    editor = ace.edit("code");

    //设置风格和语言（更多风格和语言，请到github上相应目录查看）
    language = "json";
    editor.session.setMode("ace/mode/" + language);

    //字体大小
    editor.setFontSize(16);

    //设置只读（true时只读，用于展示代码）
    editor.setReadOnly(false);

    //自动换行,设置为off关闭
    editor.setOption("wrap", "free");

    //启用提示菜单
    ace.require("ace/ext/language_tools");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    queryStr = editor.getValue("code");
    sessionStorage.setItem('w_queryStr', queryStr)
}

//获取channel和network
function channel() {

    //获取token
    token = localStorage.getItem('token');
    userid = localStorage.getItem('userid');


    data = "{\"userId\": " + userid + "}";
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/getUsercc",
        type: "POST",
        headers: {
            "token": token
        },
        data: data,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        for (i = 0; i < datalist.length; i++) {
            $(".brand-logo").after("<ul class=\"sidebar-menu do-nicescrol\">\
                <li id = \"channel_menu" + i + "\">\
                    <a href = \"#\" class=\"waves-effect\">\
                        <span>" + datalist[i].Name + "</span>\
                        <i class=\"fa fa-angle-left float-right\"></i>\
                    </a>\
                </li>\
            </ul>");
            for (j = 0; j < datalist[i].child.length; j++) {
                var instantisted = "";
                $("#channel_menu" + i).append("<ul class='sidebar-submenu'>\
                        <li>\
                            <a href='#' class='waves-effect'>\
                                <span> " + datalist[i].child[j].Name + "</span>\
                                <i class='fa fa-angle-left float-right'></i>\
                            </a>\
                            <ul class='sidebar-submenu' id='instantisted" + i + j + "'>\
                            </ul>\
                        </li>\
                    </ul>");
                for (k = 0; k < datalist[i].child[j].child.length; k++) {
                    instantisted = instantisted + "<li><a href='#' class='c1s1' onclick='sessionStorage.setItem(\"ccName\", \"" + datalist[i].child[j].child[k].Name + "\");" +
                        "sessionStorage.setItem(\"channelName\", \"" + datalist[i].child[j].Name + "\");" +
                        "sessionStorage.setItem(\"networkId\",\"" + datalist[i].Id + "\");" +
                        "sessionStorage.setItem(\"networkName\",\"" + datalist[i].Name + "\");use_thead()' id='" + datalist[i].child[j].child[k].Name + "'><i class='\
                    zmdi'></i>" + datalist[i].child[j].child[k].Name + "</a></li>";

                    //获取用户曾经选择的智能合约并设置disabled
                    $("#primary" + datalist[i].child[j].child[k].Id + "").attr("checked", "checked");
                    $("#primary" + datalist[i].child[j].child[k].Id + "").removeClass();
                    $("#primary" + datalist[i].child[j].child[k].Id + "").attr("disabled", "disabled")
                }
                $("#instantisted" + i + j + "").append(instantisted)
            }
        }
        //初始化侧边栏
        left_menu()
    }

    function error_of_respons_function() {
        alert("token失效,请重新登录。");
        setTimeout(function () {
            window.location.href = 'login.html'
        }, 100)
    }
}

//表头获取
function thead() {
    $("#instantisted_head").hide();
    $("#metadata_button").hide();
    $("#metadata").hide();
    $("#querydata").hide();
    $("#table_tbody").hide();


    //获取选择展示数
    var options = $("#table_page option:selected");
    //获取展示数
    var page = options.val();

    ccName = sessionStorage.getItem('ccName');
    channelName = sessionStorage.getItem('channelName');
    networkName = sessionStorage.getItem('networkName');
    networkId = sessionStorage.getItem('networkId');
    userid = localStorage.getItem('userid');
    skip = 0;

    data1 = {
        "ccName": ccName,
        "channelID": channelName,
        "networkID": networkId,
        "userId": userid
    };

    //获取token
    var token = localStorage.getItem('token');
    var thead_th = "";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/queryStructMember",
        type: "POST",
        headers: {
            "token": token
        },
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data1),
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        $(".json_code").remove();
        if (datalist.status == 501) {
            alert("后台已重启，请重新登录。");
            window.location.href = 'login.html'
        }
        //修改收到的数据，修改为数组list形式
        datalist = datalist.queryStructMemberSuccess.payload;
        datalist = $.base64.decode(datalist);
        datalist = JSON.parse(datalist);
        let thead_name = JSON.stringify(datalist.member)
        thead_name = thead_name.replace(/\(\*\)/g,"")
        sessionStorage.setItem('thead_name', thead_name);
        sessionStorage.setItem('key', datalist.key);

        for (j = 0; j < datalist.member.length; j++) {
            thead_th = thead_th + "<th>" + datalist.member[j] + "</th>"
        }

        $("#metadata").show();
        $("#table_thead").html("<tr>" + thead_th + "</tr>");
        $("#query_table_thead").html("<tr>" + thead_th + "</tr>");
        $("#instantisted_head").html("<button type=\"button\" class=\"btn btn-primary\
        waves-effect waves-light btn-sm m-1 smart_contract1\">" + networkName + "/" + channelName + "/" + ccName + "</button>");
        $("#instantisted_head").show()
    }

    function error_of_respons_function() {
        alert("token失效,请重新登录。");
        setTimeout(function () {
            window.location.href = 'login.html'
        }, 100)
    }

    setTimeout(function () {
        table_ajax(page, skip);
        json_ajax(page, skip);

    }, 500);
}


//table ajax代码封装
function table_ajax(page, skip) {
    var ccName = sessionStorage.getItem('ccName');
    var channelName = sessionStorage.getItem('channelName');
    var key = sessionStorage.getItem('key');
    var networkId = sessionStorage.getItem('networkId');

    data1 = {
        "ccName": ccName,
        "channelID": channelName,
        "networkID": networkId,
        "key": key,
        "pagesize": "" + page + "",
        "skip": "" + skip + "",
        "bookmark": ""
    };

    //获取token
    var token = localStorage.getItem('token');
    var tbody = "";
    var tbody_th = "";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/queryByConditionWithPagination",
        type: "POST",
        headers: {
            "token": token
        },
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data1),
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        if (datalist.status == 501) {
            alert("后台已重启，请重新登录。");
            window.location.href = 'login.html'
        }

        //修改收到的数据，修改为数组list形式
        var datalist = datalist.queryByConditionSuccess.payload;
        var datalist = $.base64.decode(datalist);
        datalist = datalist.replace(/\"\,\"Record\"\:\{\"/g, "\"\,\"");
        datalist = datalist.replace(/\"\}\}\,/g, "\"\}\,");
        datalist = "{\"data\":" + datalist + "}";
        datalist = JSON.parse(datalist);
        var thead_name = sessionStorage.getItem('thead_name');
        thead_name = JSON.parse(thead_name);

        //存入session备用
        sessionStorage.setItem('table_page', page);

        for (j = 0; j < datalist.data.length - 1; j++) {
            for (k = 0; k < thead_name.length; k++) {
                tbody_th = tbody_th + "<th>" + datalist.data[j][thead_name[k]] + "" + "</th>"
            }
            tbody = tbody + "<tr>" + tbody_th + "</tr>";
            tbody_th = ""
        }

        $("#table_tbody").html(tbody);
        $("#all").show();
        $("#table_tbody").show()
    }

    function error_of_respons_function() {
        tbody = "<div><h4>表中数据获取失败！</h4></div>";
        $("#table_tbody").html(tbody);
        setTimeout(function () {
            alert("token失效，请重新登录。");
            window.location.href = 'login.html'
        }, 100)
    }
}


//json ajax代码封装
function json_ajax(page, skip) {

    var ccName = sessionStorage.getItem('ccName');
    var channelName = sessionStorage.getItem('channelName');
    var key = sessionStorage.getItem('key');
    var networkId = sessionStorage.getItem('networkId');

    data1 = {
        "ccName": ccName,
        "channelID": channelName,
        "networkID": networkId,
        "key": key,
        "pagesize": "" + page + "",
        "skip": "" + skip + "",
        "bookmark": ""
    };

    //获取token
    var token = localStorage.getItem('token');

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/queryByConditionWithPagination",
        type: "POST",
        headers: {
            "token": token
        },
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data1),
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        if (datalist.status == 501) {
            alert("后台已重启，请重新登录。");
            window.location.href = 'login.html'
        }
        //修改收到的数据，改为数组list形式
        var datalist = datalist.queryByConditionSuccess.payload;
        var datalist = $.base64.decode(datalist);
        datalist = datalist.replace(/\"\,\"Record\"\:\{\"/g, "\"\,\"");
        datalist = datalist.replace(/\"\}\}\,/g, "\"\}\,");
        datalist = "{\"data\":" + datalist + "}";
        datalist = JSON.parse(datalist);

        //获取书签
        sessionStorage.setItem('json_page', page);

        for (j = 0; j < datalist.data.length - 1; j++) {
            //将数组list转成string
            json_data = JSON.stringify(datalist.data[j]);

            //增加回车符以及tab
            json_data = json_data.replace(/\,/g, "\,\r\t");
            json_data = json_data.replace(/\{/g, "\{\r\t");
            json_data = json_data.replace(/\}/g, "\r\}");

            //加入界面中
            $("#append_json").append("<div class='json_code'><h5 class='json_h5'>" + j + "</h4><pre id = 'json" + j + "' class = 'ace_editor json_pre' style = 'height:290px'><textarea class = 'ace_text-input'>" + json_data + "</textarea></pre><div>");

            //初始化对象
            editor = ace.edit("json" + j + "");

            //设置风格和语言（更多风格和语言，请到github上相应目录查看）
            language = "json";
            editor.session.setMode("ace/mode/" + language);

            //字体大小
            editor.setFontSize(20);

            //设置只读（true时只读，用于展示代码）
            editor.setReadOnly(true);

            //自动换行,设置为off关闭
            editor.setOption("wrap", "free");

            //启用提示菜单
            ace.require("ace/ext/language_tools");
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
        }
        query_code();
    }

    function error_of_respons_function() {
        $("#append_json").html("<div><h4>获取数据失败!</h4></div>");
    }
}


//query table ajax封装
//table ajax代码封装
function query_table_ajax(query_page, queryStr) {
    var ccName = sessionStorage.getItem('ccName');
    var channelName = sessionStorage.getItem('channelName');
    var networkId = sessionStorage.getItem('networkId');

    data1 = {
        "ccName": ccName,
        "channelID": channelName,
        "networkID": networkId,
        "queryStr": "" + queryStr + "",
        "pageSize": "" + query_page + "",
        "bookMark": ""
    };
    //获取token
    var token = localStorage.getItem('token');
    var tbody = "";
    var tbody_th = "";

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/queryByConditionWithPagination_q",
        type: "POST",
        headers: {
            "token": token
        },
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data1),
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        if (datalist.status == 501) {
            alert("后台已重启，请重新登录。");
            window.location.href = 'login.html'
        }
        // 修改收到的数据，修改为数组list形式
        var datalist = datalist.queryByConditionSuccess.payload;
        var datalist = $.base64.decode(datalist);
        datalist = datalist.replace(/\"\,\"Record\"\:\{\"/g, "\"\,\"");
        datalist = datalist.replace(/\"\}\}\,/g, "\"\}\,");
        datalist = "{\"data\":" + datalist + "}";
        datalist = JSON.parse(datalist);
        var thead_name = sessionStorage.getItem('thead_name');
        thead_name = JSON.parse(thead_name);

        sessionStorage.setItem('query_table_page', query_page);

        for (j = 0; j < datalist.data.length - 1; j++) {
            for (k = 0; k < thead_name.length; k++) {
                tbody_th = tbody_th + "<th>" + datalist.data[j][thead_name[k]] + "" + "</th>"
            }
            tbody = tbody + "<tr>" + tbody_th + "</tr>";
            tbody_th = ""
        }

        $("#query_table_tbody").html(tbody)
    }

    function error_of_respons_function() {
        tbody = "<div><h4>表中数据获取失败！</h4></div>";
        $("#table_tbody").html(tbody);
        setTimeout(function () {
            alert("token失效，请重新登录。");
            window.location.href = 'index.html'
        }, 100)
    }

}

//query_json ajax代码封装
function query_json_ajax(query_page, queryStr) {

    var ccName = sessionStorage.getItem('ccName');
    var channelName = sessionStorage.getItem('channelName');
    var networkId = sessionStorage.getItem('networkId');

    data1 = {
        "ccName": ccName,
        "channelID": channelName,
        "networkID": networkId,
        "queryStr": "" + queryStr + "",
        "pageSize": "" + query_page + "",
        "bookMark": ""
    };

    //获取token
    var token = localStorage.getItem('token');

    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/queryByConditionWithPagination_q",
        type: "POST",
        headers: {
            "token": token
        },
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data1),
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(datalist) {
        if (datalist.status == 501) {
            alert("后台已重启，请重新登录。");
            window.location.href = 'login.html'
        }
        //修改收到的数据，改为数组list形式
        var datalist = datalist.queryByConditionSuccess.payload;
        var datalist = $.base64.decode(datalist);
        datalist = datalist.replace(/\"\,\"Record\"\:\{\"/g, "\"\,\"");
        datalist = datalist.replace(/\"\}\}\,/g, "\"\}\,");
        datalist = "{\"data\":" + datalist + "}";
        datalist = JSON.parse(datalist);

        sessionStorage.setItem('query_json_page', query_page);


        for (j = 0; j < datalist.data.length - 1; j++) {
            //将数组list转成string
            query_json_data = JSON.stringify(datalist.data[j]);

            //增加回车符以及tab
            query_json_data = query_json_data.replace(/\,/g, "\,\r\t");
            query_json_data = query_json_data.replace(/\{/g, "\{\r\t");
            query_json_data = query_json_data.replace(/\}/g, "\r\}");

            //加入界面中
            $("#query_append_json").append("<div class='query_json_code'><h5 class='json_h5'>" + j + "</h4><pre id = 'query_json" + j + "' class = 'ace_editor json_pre' style = 'height:290px'><textarea class = 'ace_text-input'>" + query_json_data + "</textarea></pre><div>");

            //初始化对象
            editor = ace.edit("query_json" + j + "");

            //设置风格和语言（更多风格和语言，请到github上相应目录查看）
            language = "json";
            editor.session.setMode("ace/mode/" + language);

            //字体大小
            editor.setFontSize(20);

            //设置只读（true时只读，用于展示代码）
            editor.setReadOnly(true);

            //自动换行,设置为off关闭
            editor.setOption("wrap", "free");

            //启用提示菜单
            ace.require("ace/ext/language_tools");
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: true
            });
        }
    }

    function error_of_respons_function() {
        $("#append_json").html("<div><h4>获取数据失败!</h4></div>");
        setTimeout(function () {
            alert("token失效，请重新登录。");
            window.location.href = 'index.html'
        }, 100)
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
            network = "<li class=\"list-group-item node-treeview card-title\"></span>网络名称：" + data[i].networkname + "</li>";
            for (j = 0; j < data[i].channelList.length; j++) {
                network = network + "<li class=\"list-group-item node-treeview\"><span class=\"indent\"></span>通道名称：" + data[i].channelList[j].channelname + "</li>";
                for (k = 0; k < data[i].channelList[j].chaincodeList.length; k++) {
                    network = network + "<li class=\"list-group-item node-treeview\">\
                            <div class=\"icheck-material-primary\" style=\"margin left:6%\">\
                                <input type = \"checkbox\" class=\"chaincode_id\" value=\"" + data[i].channelList[j].chaincodeList[k].chaincodeId + "3\" id= \"primary" + data[i].channelList[j].chaincodeList[k].chaincodeId + "\"/>\
                                    <label for=\"primary" + data[i].channelList[j].chaincodeList[k].chaincodeId + "\">智能合约" + k + ": " + data[i].channelList[j].chaincodeList[k].chaincodeName + "\
                                </label>\
                            </div>\
                        </li>"
                }
            }

            allnetwork = allnetwork + "<ul class = \"list-group\">" + network + "\
                                    </ul>"
        }
        $(".treeview").html(allnetwork)
    }

    function error_of_respons_function() {
        $(".treeview").html("<ul class = \"list-group\">连接失败！</ul>")
    }

    setTimeout(function () {
        channel()
    }, 300);

}


//新权限申请 ajax代码封装
function reg_apply(chaincode_arr) {
    token = localStorage.getItem('token');
    userid = localStorage.getItem('userid');
    data = "{'userId':'" + userid + "','userApplyAuthority':'[" + chaincode_arr + "]','userApplyStarttime':'null','userApplyPasstime':'null'}";
    data = data.replace(/\'/g, "\"");
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/applyNewAuthority",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        headers: {
            "token": token
        },
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(back) {
        if (back.status == 200) {
            swal("申请成功！", "请等待管理员审核后刷新", "success")
        } else if (back.status == 502) {
            swal("申请不被接受", "存在未审批的申请", "error")
        } else {
            swal("申请失败！", "" + back.message + "", "error");
            alert("出现未知错误，请重新登录。");
            window.location.href = 'login.html'
        }
    }

    function error_of_respons_function() {
        alert("token失效,请重新登录。");
        setTimeout(function () {
            window.location.href = 'login.html'
        }, 100)
    }
}

//获取用户审批进度
function applying() {
    token = localStorage.getItem('token');
    userid = localStorage.getItem('userid');
    data = "{'userId':'" + userid + "'}";
    data = data.replace(/\'/g, "\"");
    $.ajax({
        async: true,
        url: "http://" + ip + ":" + port + "/fuchain/getUserAuthorityInfo ",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        headers: {
            "token": token
        },
        data: data,
        dataType: "json",
        success: success_of_respons_function,
        error: error_of_respons_function,
    });

    function success_of_respons_function(data) {
        applyingtbody = "";
        applyingthead = "<tr>\n" +
            "                                <th>申请网络名</th>\n" +
            "                                <th>申请通道名</th>\n" +
            "                                <th>申请智能合约名</th>\n" +
            "                                <th>状态</th>\n" +
            "                                <th>理由</th>\n" +
            "                            </tr>";
        for (i = 0; i < data.length; i++) {
            if (data[i].status == 0) {
                status = "待审批"
            } else if (data[i].status == 1) {
                status = "已通过请刷新查看"
            } else {
                status = "拒绝"
            }
            applyingtbody = applyingtbody + "<tr>\n" +
                "                                <th>" + data[i].networkName + "</th>\n" +
                "                                <th>" + data[i].channelName + "</th>\n" +
                "                                <th>" + data[i].chaincodeName + "</th>\n" +
                "                                <th>" + status + "</th>\n" +
                "                                <th>无</th>\n" +
                "                            </tr>"
        }
        applying_table = applyingthead + applyingtbody;
        $("#applying_table").html(applying_table)
    }

    function error_of_respons_function() {
        alert("token失效,请重新登录。");
        setTimeout(function () {
            window.location.href = 'login.html'
        }, 60000)
    }
}

//点击选择展示行数触发ajax
function changetable_page() {
    //获取选择展示数
    var options = $("#table_page option:selected");
    var page = options.val();
    skip = 0;

    //ajax接收
    table_ajax(page, skip);

}

//点击选择展示行数触发ajax
function changejson_page() {
    //获取选择展示数
    var options = $("#json_page option:selected");
    var page = options.val();
    $(".json_code").remove();
    skip = 0;

    //ajax接收
    json_ajax(page, skip);
}

//点击选择展示行数触发ajax
function changequery_table_page() {
    //获取选择展示数
    query_options = $("#query_table_page option:selected");
    query_page = query_options.val();
    queryStr = sessionStorage.getItem('w_queryStr');
    queryStr = queryStr.replace(/ /g, "");
    queryStr = queryStr.replace(/[\r\n]/g, "");

    queryStr = JSON.parse(queryStr);
    query_skip = 0;
    selector = queryStr.selector;
    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

    //ajax接收
    query_table_ajax(query_page, queryStr);

}

//点击选择展示行数触发ajax
function changequery_json_page() {
    //获取选择展示数
    query_options = $("#query_table_page option:selected");
    query_page = query_options.val();
    queryStr = sessionStorage.getItem('w_queryStr');
    queryStr = queryStr.replace(/ /g, "");
    queryStr = queryStr.replace(/[\r\n]/g, "");

    queryStr = JSON.parse(queryStr);
    query_skip = 0;
    selector = queryStr.selector;
    queryStr = "{\"selector\":" + JSON.stringify(selector) + ",\"skip\":" + query_skip + "}";

    //ajax接收
    query_json_ajax(query_page, queryStr);

}

//初始化侧边栏
function left_menu() {

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
    };

    for (var i = window.location, o = $(".sidebar-menu a").filter(function () {
        return this.href == i;
    }).addClass("active").parent().addClass("active"); ;) {
        if (!o.is("li")) break;
        o = o.parent().addClass("in").parent().addClass("active");
    }
}

//延迟删除token
// function settime() {
//     setTimeout(function () {
//         localStorage.removeItem('token')
//     }, 1000 * 60 * 60);
// }


// //login ajax代码封装
// function login() {
//     username = document.getElementById("exampleInputUsername").value
//     password = document.getElementById("exampleInputPassword").value

//     data = "{'username':'" + username + "','password':'" + password + "'}"
//     data = data.replace(/\'/g, "\"")
//     $.ajax({
//         async: true,
//         url: "http://" + ip + ":" + port + "/fuchain/user/login",
//         type: "POST",
//         contentType: "application/json;charset=utf-8",
//         data: data,
//         dataType: "json",
//         success: success_of_respons_function,
//         error: error_of_respons_function,
//     })

//     function success_of_respons_function(back) {
//         if (back.status == 200) {
//             sessionStorage.setItem('token', back.token)
//             $("#login_model").hide();
//         } else {
//             alert("密码错误")
//         }
//     }

//     function error_of_respons_function() {
//         alert("连接失败")
//     }


// }
