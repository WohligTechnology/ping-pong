var optid = 2;
//var ref = 0;
angular.module('starter.controllers', ['ngAnimate', 'ngCordova', 'starter.services'])

.controller('AppCtrl', function($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal, $cordovaImagePicker, $cordovaFileTransfer, $cordovaCamera, MyServices, $ionicLoading, $interval) {
    $scope.changestatus = 0;
    $scope.demo = "testing";
    var options = {
        maximumImagesCount: 9,
        width: 800,
        height: 800,
        quality: 80,
        //        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true

    };


    $scope.cameraimage = [];

    //	open create attach modal
    $ionicModal.fromTemplateUrl('templates/post.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal3 = modal;
    });

    $scope.openCreate = function() {
        $scope.oModal3.show();
    }

    $scope.closeCreate = function() {
        $scope.oModal3.hide();
    }
    $ionicModal.fromTemplateUrl('templates/upload.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal2 = modal;
    });

    $ionicModal.fromTemplateUrl('templates/search.html', {
        id: '4',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal4 = modal;
    });

    $scope.openSearch = function() {
        $scope.oModal4.show();
    }

    $scope.closeSearch = function() {
        $scope.oModal4.hide();
    }

    $scope.closeuploadElements = function() {
        $scope.oModal2.hide();
    }


    //	open upload $ionicPopover element

    $ionicPopover.fromTemplateUrl('templates/upload.html', {
        scope: $scope,
    }).then(function(popover1) {
        $scope.popover1 = popover1;
    });


    $scope.options = [{
        id: 1,
        text: "",
        status: false
    }, {
        id: 2,
        text: "",
        status: false
    }];

    $scope.opt = {
        text: "",
        status: false
    };
    $scope.onChangeAdd = function(index) {
        console.log("index is");
        console.log(index);
        if ($scope.options.length - 1 == index) {
            console.log("id is");
            console.log($scope.options.length + 1);
            $scope.options.push({
                id: $scope.options.length + 1,
                text: "",
                status: false
            });
        }
        console.log($scope.options);
    }

    $scope.openUploadElements = function() {
        $scope.oModal2.show();
    }


    //	pick image from gallery
    $scope.picFromGallery = function() {
        console.log("picture");
        $cordovaImagePicker.getPictures(options).then(function(resultImage) {
            // Success! Image data is here
            _.forEach(resultImage, function(n, key) {
                $scope.cameraimage.push({
                    status: false,
                    image: n
                });
            });

            console.log($scope.cameraimage);
        }, function(err) {
            // An error occured. Show a message to the user
        });

    };

    //	camera image

    $scope.clickPhoto = function() {

        $cordovaCamera.getPicture({
            quality: 80,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true
        }).then(function(imageData) {
            $scope.cameraimage.push({
                status: false,
                image: imageData
            });
            console.log($scope.cameraimage);
            $cordovaFileTransfer.upload(adminurl + "imageuploadproduct", imageData, {})
                .then(function(result) {
                    console.log(result);
                    var data = JSON.parse(result.response);
                    callback(data);
                }, function(err) {
                    console.log(err);
                }, function(progress) {
                    console.log("progress");
                });

            console.log(imageData);
        }, function(err) {
            // error
        });

    }




    var stopinterval = 0;

    var checkfb = function(data, status) {
        console.log(data);
        if (data.value == null) {
            console.log("Do nothing");
        } else {
            ref.close();
            if (data.value == "SUCCESS") {
                if (data.type == "Facebook") {
                    $scope.facebookPhoto();
                }
                if (data.type == "Instagram") {
                    $scope.instagramPhoto();
                }
            }
            $interval.cancel(stopinterval);
        }
    }

    var callAtIntervalfb = function() {
        MyServices.checkLogid($scope.facebooklogid).success(checkfb);
    };



    $scope.facebookPhoto = function() {
        console.log("Data");
        $scope.toPushSocial = [];
        $ionicLoading.show({
            template: 'Loading...'
        });

        MyServices.checkLogin("Facebook").success(
            function(data, status) {
                console.log(data);
                if (data.value) {
                    MyServices.getFacebookImages().success(function(data) {
                        console.log(data);
                        $ionicLoading.hide();
                        $scope.socialimages = [];
                        _.each(data, function(n) {
                            $scope.socialimages.push({
                                url: n,
                                status: false
                            });
                        });

                        $scope.showimages = true;
                        //                            $scope.socialimagesrow = partitionarray($scope.socialimages, 3);
                    });
                } else {
                    $ionicLoading.hide();
                    $scope.socialimages = [];
                    $scope.facebooklogid = data.id;
                    $scope.facebookLogin("Facebook");
                }
            }
        );
    };


    $scope.facebookLogin = function(provider) {
        ref = window.open(adminhauth + 'login/' + provider + '?logid=' + $scope.facebooklogid, '_blank', 'location=no');
        stopinterval = $interval(callAtIntervalfb, 1000);
        ref.addEventListener('exit', function(event) {
            $interval.cancel(stopinterval);
        });
    };


    $scope.poll = {};
    $scope.createAttach = function() {
        console.log($scope.poll);
        $scope.poll.id = $.jStorage.get("user").id;
        $scope.poll.images = $scope.cameraimage;

        $scope.options.pop();
        $scope.poll.options = $scope.options;
        MyServices.createAttach($scope.poll).success(function(data, status) {
            console.log(data);
            $scope.closeCreate();
            window.location.reload();
            $location.url("/tab/dash");

        });
    };
})
    .controller('DashCtrl', function($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal, MyServices) {

        $scope.feeds = {};
        $scope.isfavactive = false;
        $scope.favactive = "";
        $scope.shownoappliance = false;
        $scope.showloading = true;

        if (!$.jStorage.get("user")) {
            //            $location.url("/login");
        }

        MyServices.getallpolls().success(function(data, status) {
            if (data.queryresult.length == 0) {
                $scope.showloading = false;
                $scope.shownoappliance = true;
            } else {
                $scope.showloading = false;
                $scope.feeds = data.queryresult;
                _.each($scope.feeds, function(n) {
                    n.isfav = "";
                    if (n.images)
                        n.images = n.images.split(',');
                })
            }
            console.log(data);
        });

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });


        //        $scope.feeds = [{
        //            id: 1,
        //            name: "Justin Taylor",
        //            nameat: "@JustinGraphitas",
        //            image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
        //            more: false,
        //            height: 0,
        //            series: [{
        //                name: 'Jane',
        //                data: [1, 0, 4]
        //            }, {
        //                name: 'John',
        //                data: [5, 7, 3]
        //            }]
        //        }, {
        //            id: 2,
        //            name: "Other",
        //            nameat: "@JustinGraphitas",
        //            image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
        //            more: false,
        //            height: 0,
        //            series: [{
        //                name: 'Jane',
        //                data: [1, 0, 4]
        //            }, {
        //                name: 'John',
        //                data: [5, 7, 3]
        //            }]
        //        }];
        $scope.changemore = function(feed, index) {
            var indexno = index;
            var idtomove = "more";
            feed.more = !feed.more;
            if (feed.more) {
                var height = $("ion-item").eq(indexno).children(".contentright").children(".more").children(".more-content").height();
                feed.height = height;
                console.log(height);
            } else {
                idtomove = "item"
                feed.height = 0;
            }

            $timeout(function() {
                $ionicScrollDelegate.resize();
                $location.hash(idtomove + index);
                console.log($location.hash());
                $ionicScrollDelegate.anchorScroll(true, 4000);
            }, 1000)
        };

        $scope.opendetail = function(id) {
            $location.url("/tab/dash/" + id);
        }

        $scope.markasfav = function(feed) {
            console.log(feed);
            if (feed.isfav == "") {
                feed.isfav = "favactive";
            } else {
                feed.isfav = "";
            }
            MyServices.addtofavourites(feed.id).success(
                function(data, status) {
                    console.log(data);
                }
            )
        };

    })

.controller('LoginCtrl', function($scope, $location, $interval, MyServices) {

    $.jStorage.flush();

    MyServices.logout().success(function(data, status) {

    });

    var authenticatesuccess = function(data, status) {
        console.log(data);
        if (data != "false") {
            $.jStorage.set("user", data);
            user = data;
            $location.url("/tab/dash");
        } else {
            console.log("stay here");
        };
    };

    //    MyServices.authenticate().success(authenticatesuccess);

    var checktwitter = function(data, status) {
        if (data != "false") {
            console.log("Facebook Login");
            $interval.cancel(stopinterval);
            ref.close();
            MyServices.authenticate().success(authenticatesuccess);
        } else {
            console.log("Do nothing");
        }
    };

    var callAtIntervaltwitter = function() {
        MyServices.authenticate().success(checktwitter);
    };

    $scope.twitterlogin = function() {
        console.log("in twitter");

        ref = window.open(adminhauth + 'login/Twitter', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            MyServices.authenticate().success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
    $scope.instalogin = function() {

        ref = window.open(adminhauth + 'login/Instagram?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            MyServices.authenticate().success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
    $scope.googlelogin = function() {

        ref = window.open(adminhauth + 'login/Google?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            MyServices.authenticate().success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
    $scope.fblogin = function() {

        ref = window.open(adminhauth + 'login/Facebook?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            MyServices.authenticate().success(authenticatesuccessauthenticatesuccess);
            $interval.cancel(stopinterval);
        });
        //        $location.url("/tab/dash");
    }
})

.controller('ChatsCtrl', function($scope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };

    $scope.followers = [{
        name: "Sohan"
    }, {
        name: "Mahesh"
    }, {
        name: "Vignesh"
    }];
})

.controller('ChatDetailCtrl', function($scope, $stateParams, MyServices) {
    $scope.chat = MyServices.get($stateParams.chatId);
})

.controller('DashDetailCtrl', function($scope, $stateParams, MyServices, $ionicPopover) {
    //    $scope.chat = MyServices.get($stateParams.chatId);
	console.log($stateParams.chatId);
	MyServices.getsingleuserpoll($stateParams.chatId).success(function(data, status){
		console.log(data);
		$scope.feeds = data;
	});
	
    $scope.feed = {
        id: 1,
        name: "Justin Taylor",
        nameat: "@JustinGraphitas",
        image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
        more: false,
        height: 0,
        series: [{
            name: 'Jane',
            data: [1, 7, 4]
        }]
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
})

.controller('AccountCtrl', function($scope, $ionicPopover, $timeout, $ionicScrollDelegate, $location, $ionicModal, MyServices) {

    //get user
    $scope.user = $.jStorage.get("user");
    $scope.isfavactive = false;
    $scope.favouritefeeds = {};
    $scope.tabvalue = 1;
    $scope.changetab = function(tab) {
        $scope.tabvalue = tab;
    }

    MyServices.getuserfavourites().success(function(data, status) {
        console.log(data);
        $scope.favouritefeeds = data.queryresult;
    })

    MyServices.getalluserpoll().success(function(data, status) {
        console.log(data);
        $scope.feeds = data.queryresult;
    });

    $scope.settings = {
        enableFriends: true
    };

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

    //
    //    $scope.feeds = [{
    //        id: 1,
    //        name: "Justin Taylor",
    //        nameat: "@JustinGraphitas",
    //        image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
    //        more: false,
    //        height: 0,
    //        isfav: "",
    //        series: [{
    //            name: 'Jane',
    //            data: [1, 0, 4]
    //        }, {
    //            name: 'John',
    //            data: [5, 7, 3]
    //        }]
    //    }, {
    //        id: 2,
    //        name: "Other",
    //        nameat: "@JustinGraphitas",
    //        image: "img/Spring-Lamb.-Image-shot-2-011.jpg",
    //        more: false,
    //        height: 0,
    //        isfav: "",
    //        series: [{
    //            name: 'Jane',
    //            data: [1, 0, 4]
    //        }, {
    //            name: 'John',
    //            data: [5, 7, 3]
    //        }]
    //    }];
    $scope.changemore = function(feed, index) {
        var indexno = index;
        var idtomove = "more";
        feed.more = !feed.more;
        if (feed.more) {
            var height = $("ion-item").eq(indexno).children(".contentright").children(".more").children(".more-content").height();
            feed.height = height;
            console.log(height);
        } else {
            idtomove = "item"
            feed.height = 0;
        }

        $timeout(function() {
            $ionicScrollDelegate.resize();
            $location.hash(idtomove + index);
            console.log($location.hash());
            $ionicScrollDelegate.anchorScroll(true, 4000);
        }, 1000)
    };

    $scope.opendetail = function(id) {
        $location.url("/tab/dash/" + id);
    }

    $ionicModal.fromTemplateUrl('templates/upload.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal2 = modal;
    });

    $scope.openUploadElements = function() {
        $scope.oModal2.show();
    }

    $scope.closeuploadElements = function() {
        $scope.oModal2.hide();
    }

    //	open edit profile modal
    $ionicModal.fromTemplateUrl('templates/editprofile.html', {
        id: '3',
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.oModal1 = modal;
    });

    $scope.openEditProfile = function() {
        $scope.oModal1.show();
    }

    $scope.closeEditProfile = function() {
        $scope.oModal1.hide();
    }

    $scope.markasfav = function(feed) {
        if (feed.isfav == "") {
            feed.isfav = "favactive";
        } else {
            feed.isfav = "";
        }
    };

});