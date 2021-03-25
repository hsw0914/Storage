// JavaScript Document
$(function () {
    // function pageEvent() {
    //     var hash = location.hash.replace(/^#/,"").split('/');
    //
    //     switch (hash[0]) {
    //         case "info":
    //             console.log(hash[1]);
    //             setInfo(hash[1]);
    //             break;
    //         case "admin":
    //             var login = localStorage.getItem('login');
    //             alert(login);
    //             if(login === "true") {
    //                 setAdminLogin();
    //             }else {
    //                 var result =
    //                 "<div class='admin-wrap'>" +
    //                     "<input type='text' placeholder='Admin ID' class='admin-input-id'> " +
    //                     "<input type='password' placeholder='Password' class='admin-input-pw'>" +
    //                     "<button class='admin-submit'>Login</button>" +
    //                 "</div>";
    //                 $('.center-title').html("관리자페이지");
    //                 $('.center-title').addClass("title-center");
    //                 $('.left-btn').css({'visibility':'visible'});
    //                 setWrap(result);
    //             }
    //
    //             break;
    //         case "home":
    //         default:
    //             setWrap();
    //             break;
    //     }
    // }
    // window.addEventListener('hashchange',pageEvent);
    // pageEvent();
    var pageStack = [];
    setWrap(); //초기 맵 설정
    function setWrap(htm, city) {
        if (arguments.length == 0) { // 초기 맵 설정일 경우 매개변수 0개받음
            $.get('../svg/map.svg', function (map) {
                // addPageStack();
                pageStack = []; //pageStack 초기화 (어차피 홈에서는 뒤로가기 못누름 ㅎ)
                $('.left-btn a').css('visibility', 'hidden'); //홈에서는 홈버튼,뒤로가기 없어야됨
                $('.wrap').html(map);
            }, 'text');
            $('.left-btn').css('visibility', 'hidden');
        } else if (arguments.length == 1 || arguments.length == 2) { // 만약 따로 받은 값이 있으면 그거로 처리
            $('.left-btn a').css('visibility', 'visible'); //홈에서 어딘가로 넘어가면 뒤로가기 생겨야됨
            $('.wrap').html(htm);
        } else {
            alert("error");
        }
    }

    function addPageStack() {
        var titleText = $('.center-title').text().trim();
        console.log("스택 쌓을때 쌓이는거 : "+titleText);
        if (titleText === "인사이트서울") {
            pageStack.push("main");
        } else if (titleText === "관리자페이지") {
            pageStack.push("admin");
        } else { //메인도 아니고 관리자도 아니면 쉬티임
            var eee = $('.pageStackCityText').text();
            console.log("도시 저장 : "+eee);
            pageStack.push(eee);
        }
        console.log(pageStack);
    }

    $('.left-btn a:last-child img').on('click', function () {
        backPage(pageStack.pop());
    });
    function backPage(text) {
        var result;
        console.log("뒤로가기 눌르면 나오는 텍스트 : "+text);
        switch (text) {
            case "admin": //admin일때 어차피 뒤로가는 경로가 메인밖에 없음 ㅇㅇ
            case "main":
                console.log("뒤로가기 메인입니다!");
                setWrap();
                break;
            default: // 와 이거 하나하나 도시 일일이 할뻔한걸 안보이는 태그 하나 써서 그거로 컨트롤하면되네;
                setInfo(text);
        }
        console.log("뒤로가기 후에 남은 스택 : "+pageStack);
    }

    function setInfo(id) {
        $.get('../json/description.json', function (data) {
            var data = data['WardOffice'];
            $.each(data, function (i, o) {
                if (o['name_en'] === id) {
                    $('.left-btn').css('visibility', 'visible');
                    var city = o.name_en;
                    var result =
                        "<div class='infor-div'>" +
                        "<div class='infor-img-div'>" +
                        "<img src='" + o['map'] + "'>" +
                        "</div>" +
                        "<div class='infor-text-div'>" +
                        "<h1>" + o['name_ko'] + "&nbsp;" + o['name_en'] + "</h1>" +
                        "<p><span>면&nbsp;&nbsp;적&nbsp;:</span><span>" + o['square'] + "</span></p>" +
                        "<p><span>인&nbsp;&nbsp;구&nbsp;:</span><span>" + o['population'] + "</span></p>" +
                        "<p><span class='infor-site'>안내사이트&nbsp;:</span><span>" + o['url'] + "</span></p>" +
                        "<p>" + o['description'] + "</p>" +
                        "</div>" +
                        "<div class='infor-data-div'>" +
                        "</div>" +
                        "<canvas id='canvas'></canvas>" +
                        "</div>" +
                        "<p class='hidden-data'>"+o['name_en']+"</p>";
                    setWrap(result, city);
                    getInfoData(o.name_ko);
                }
            });
        });
    }

    // $(document).on('click', '.left-btn a:last-child', function(e) {
    //     e.preventDefault();
    //     history.back();
    // });
    $('.wrap').on('click', '.st0', function () { // 각 도시 클릭하면 정보 창으로 넘어감
        var id = $(this).attr('id');
        $.get('../json/description.json', function (data) {
            var data = data['WardOffice'];
            $.each(data, function (i, o) {
                if (o.name_en === id) {
                    addPageStack(); //titletext 바뀌기 전에 미리 스택 쌓아줌
                    $('.center-title').text(o.name_ko + " 정보안내");
                    setInfo(id);
                }
            });
        });
    });

    function getInfoData(city) {
        var objectStore = db.transaction("loyeeee").objectStore("loyeeee");
        objectStore.getAll().onsuccess = function (event) {
            var result = event.target.result;
            $.each(result, function (i, o) {
                var ext = o.src.substring(5, 10);
                if (ext === "image" && o.city === city) {
                    $('.infor-data-div').append("<button class='info-data-btn'><img class='info-data' src='" + o.src + "'></button>");
                } else if (ext === "video" && o.city === city) {
                    $('.infor-data-div').append("<button class='info-data-btn'><img class='info-data' src='" + o.img + "'></button>");
                }
            });
        };
    }

    $('.wrap').on('click', '.info-data-btn', function () { //이미지나 동영상 클릭하면 팝업으로 보여줌
        console.log("나니>");
        $('.admin').off('click');
        $('.home').off('click');
        $('.back').off('click');
        $('.hidden-data').on('dialogclose', function(event) {
            $('.admin').on('click',function () {
                admin();
            })
            $('.home').on('click',function () {
                GetSvgFile();
            })
            $('.back').on('click',function () {
                var popStack = pageStack.pop();
                if (popStack === "main") {
                    var titleText = $('.center-title').text().trim();
                    addStack(titleText);
                    GetSvgFile();
                }else if (popStack === "admin") {
                    admin();
                }else {
                    console.log(popStack);
                    infoPage(popStack);
                }
            })
        });
        $('.hidden-data').dialog({
            title: "ㅎㅇ",
            modal: true,
            width: 400,
            height: 320
        });
    });
    function setAdminLogin() {
        $('.center-title').html("관리자페이지");
        $('.left-btn>a:last-child').css('visibility', 'visible');
        var options = "";
        $.get('../json/description.json', function (data) {
            var json = data['WardOffice'];
            $.each(json, function (i, o) {
                options += "<option value='" + o['name_ko'] + "'>" + o['name_ko'] + "</option>";
            });
            var result =
                "<div class='admin-wrap'>" +
                "<span>구 선택 : </span>" +
                "<select class='admin-city'>" +
                options +
                "</select>" +
                "<div class='admin-drag-div'>" +
                "<p>Drag HERE</p>" +
                "</div>" +
                "<div class='admin-select-div'>" +

                "</div>" +
                "<canvas id='canvas' style='display: block'></canvas> " +
                "</div>";
            setWrap(result); // 관리자 페이지 로그인  했었을때
            $('.admin-drag-div').on({
                dragenter: function (e) {
                    $(this).css('background-color', 'lightBlue');
                },
                dragleave: function (e) {
                    $(this).css('background-color', '#ccc');
                },
                drop: function (e) {
                    var msg_result = "";
                    $(this).css('background-color', '#ccc');
                    e.preventDefault();
                    var files = e.originalEvent.dataTransfer.files;
                    $.each(files, function (i, o) {
                        var reader = new FileReader();
                        var filename = o.name;
                        var ext = filename.substr(filename.length - 3, filename.length);
                        if (ext == "mp4" || ext == "jpg" || ext == "JPG" || ext == "png" || ext == "PNG") {
                            var test = document.createElement("img");
                            test.file = o;
                            reader.onload = (function (aImg) {
                                return function (e) {
                                    if (ext == "mp4") {
                                        $(".admin-select-div").append("<video src='" + e.target.result + "' width='0' height='0' id='info-video-" + i + "' style='display:none;'></video>");
                                        var video = document.getElementById("info-video-" + i);
                                        video.currentTime = 10;
                                        video.oncanplay = function () {
                                            var canvas = document.getElementById('canvas');
                                            canvas.getContext('2d').drawImage(video, 0, 0, 320, 240);
                                            setTimeout(function () {
                                                var request = db.transaction(['loyeeee'], 'readwrite')
                                                    .objectStore('loyeeee')
                                                    .add({
                                                        city: $('.admin-city option:selected').text(),
                                                        src: e.target.result,
                                                        img: canvas.toDataURL()
                                                    });
                                                $(video).remove();
                                            });
                                        };
                                    } else {
                                        var request = db.transaction(["loyeeee"], "readwrite")
                                            .objectStore("loyeeee")
                                            .add({city: $('.admin-city option:selected').text(), src: e.target.result});
                                    }
                                };
                            }(test));
                            reader.readAsDataURL(o);
                            reader.onloadend = (function () {
                                $('.screen')
                                msg_result += filename + " : 업로드 성공!\n";
                                if (i + 1 == files.length)
                                    alert("업로드 성공!");
                            });
                        } else {
                            msg_result += filename + " : 확장자가 mp4, jpg, png만 업로드 해주세요!\n";
                        }
                    });

                }
            });
            $(document).on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            $(document).on('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
        });
    }

    $('.left-btn a:first-child').click(function () {
        setWrap(); // 홈 버튼 눌렀을때
        $('.center-title').text("인사이트서울");
    });
    $('.right-btn').click(function () {
        addPageStack();
        adminMove();
    });
    function adminMove() { //톱니바퀴 누를때랑 스택쌓아서 움직일때랑 하려고 함수로 만듬
        var login = sessionStorage.getItem('login');
        if (login === "true") {
            setAdminLogin();
        } else {
            var result =
                "<div class='admin-wrap'>" +
                "<input type='text' placeholder='Admin ID' class='admin-input-id'> " +
                "<input type='password' placeholder='Password' class='admin-input-pw'>" +
                "<button class='admin-submit'>Login</button>" +
                "</div>";
            $('.center-title').html("관리자페이지");
            $('.center-title').addClass("title-center");
            $('.left-btn').css({'visibility': 'visible'});
            setWrap(result); //관리자 페이지 로그인 안했을 때
        }
    }

    var db;
    var request = window.indexedDB.open("WoWWwww", 7);
    request.onerror = function (event) {
        console.log("error: " + event);
    };
    request.onsuccess = function (event) {
        db = request.result;
        console.log("success: " + db);
    };
    const employeeData = {city: "", src: ""};
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("loyeeee", {autoIncrement: true});
        objectStore.add(employeeData);
    };

    $('.wrap').on('click', '.admin-submit', function () {
        var id = $('.admin-input-id').val();
        var pw = $('.admin-input-pw').val();
        if (id === "admin" && pw === "1234") {
            setAdminLogin();
            alert("로그인 성공!");
            sessionStorage.setItem('login', true);

            function read() {
                var transaction = db.transaction(["loyee"]);
                var objectStore = transaction.objectStore("loyee");
                var request = objectStore.get("1");

                request.onerror = function (event) {
                    alert("Unable to retrieve daa from database!");
                };

                request.onsuccess = function (event) {
                    // Do something with the request.result!
                    if (request.result) {
                        alert("idx(key): " + request.key + ", src: " + request.result.src + ", city: " + request.result.city);
                    }

                    else {
                        alert("Kenny couldn't be found in your database!");
                    }
                };
            }

            function readAll() {
                var objectStore = db.transaction("WoWWwww").objectStore("loyee");
                objectStore.getAll().onsuccess = function (event) {
                    alert("Got all customers: " + event.target.result);
                };
                // objectStore.openCursor().onsuccess = function(event) {
                //     var cursor = event.target.result;
                //
                //     if (cursor) {
                //         alert("Key for id " + cursor.key + " src is " + cursor.result.src + " city is " + cursor.result.city);
                //         cursor.continue();
                //     } else {
                //         alert("No more entries!");
                //     }
                // };
            }

            function add(city, src) {
                var request = db.transaction(["loyee"], "readwrite")
                    .objectStore("loyee")
                    .add({city: city, src: src});

                request.onsuccess = function (event) {
                    alert("Kenny has been added to your database.");
                };

                request.onerror = function (event) {
                    alert("Unable to add data\r\nKenny is aready exist in your database! ");
                }
            }

            // function remove() {
            //     var request = db.transaction(["employee"], "readwrite")
            //         .objectStore("employee")
            //         .delete("00-03");
            //
            //     request.onsuccess = function(event) {
            //         alert("Kenny's entry has been removed from your database.");
            //     };
            // }

        } else {
            alert("로그인 실패!");
        }
    });


});