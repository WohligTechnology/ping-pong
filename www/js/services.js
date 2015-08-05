var adminbase = "http://wohlig.co.in/attachbackend/";
//var adminbase = "http://localhost/attachbackend/";
var adminurl = adminbase + "index.php/json/";
var adminhauth = adminbase + "index.php/hauth/";

angular.module('starter.services', [])
    .factory('MyServices', function ($http) {
        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            checkLogin: function (type) {
                //		   return $http.get(adminhauth + "checkLogin?type="+type);
                return $http({
                    url: adminhauth + 'checkLogin',
                    method: "POST",
                    data: {
                        'type': type
                    }
                });
            },
            getFacebookImages: function () {

                return $http.get(adminhauth + "getFacebookImages");
            },
            getInstagramImages: function () {
                return $http.get(adminhauth + "getInstagramImages");
            },
            logout: function () {
                return $http.get(adminbase + "index.php/json/logout");
            },
            getsingleuserpoll: function (id) {
                return $http.get(adminurl + "getsingleuserpoll?id="+id);
            },
            getalluserpoll: function () {
                return $http({
                    url: adminurl + 'getalluserpoll',
                    method: "POST",
                    data: {
                        'id': $.jStorage.get("user").id
                            //                        'id': 14
                    }
                });
            },
            getallpolls: function () {
                return $http({
                    url: adminurl + 'getallpolls',
                    method: "POST"
                });
            },
            createAttach: function (poll) {
                return $http({
                    url: adminurl + 'createuserpoll',
                    method: "POST",
                    data: poll
                });
            },
            authenticate: function () {
                return $http({
                    url: adminurl + 'authenticate',
                    method: "POST"
                });
            },
            checkLogid: function (logid) {
                return $http.get(adminhauth + "checkLogid", {
                    params: {
                        logid: logid
                    }
                });
            },
            addtofavourites: function (pollid) {
                return $http({
                    url: adminurl + 'createuserpollfavourites',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "pollid": pollid,
                        "userid": $.jStorage.get("user").id
                    }
                });
            },
            getuserfavourites: function (pollid) {
                return $http({
                    url: adminurl + 'getfavouriteuserpolls',
                    withCredentials: true,
                    method: "POST",
                    data: {
                        "userid": $.jStorage.get("user").id
                    }
                });
            }
        };
    });