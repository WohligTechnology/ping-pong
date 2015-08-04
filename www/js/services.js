var adminbase = "http://www.wohlig.co.in/attachbackend/";
//var adminbase = "http://localhost/attachbackend/";
var adminurl = adminbase + "index.php/json/";
var adminhauth = adminbase + "index.php/hauth/";


angular.module('starter.services', [])

.factory('MyServices', function($http) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        },
        checkLogin: function(type) {
//		   return $http.get(adminhauth + "checkLogin?type="+type);
		   return $http({
                url: adminhauth + 'checkLogin',
                method: "POST",
                data: {
                    'type': type
                }
            });
        },
        getFacebookImages: function() {
            return $http.get(adminhauth + "getFacebookImages");
        },
        getInstagramImages: function() {
            return $http.get(adminhauth + "getInstagramImages");
        },
        getalluserpoll: function() {
		   return $http({
                url: adminurl + 'getalluserpoll',
                method: "POST",
                data: {
                    'id': $.jStorage.get("user").id
                }
            });
        },
        createAttach: function(poll) {
		   return $http({
                url: adminurl + 'createuserpoll',
                method: "POST",
                data: poll
            });
        },
        authenticate: function() {
            return $http.get(adminurl + "authenticate");
        },
        checkLogid: function(logid) {
            return $http.get(adminhauth + "checkLogid", {
                params: {
                    logid: logid
                }
            });
        }

    };
});