// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function ($ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
            StatusBar.overlaysWebView(true);
            //            $cordovaStatusbar.styleHex('#9036B5') //red
            $cordovaStatusbar.styleHex('#804896') //dark violet
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

    $httpProvider.defaults.withCredentials = true;
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.dash-detail', {
        url: '/dash/:chatId',
        views: {
            'tab-dash': {
                templateUrl: 'templates/feeds-detail.html',
                controller: 'DashDetailCtrl'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    })

    .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
            'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

})

.filter('time', function () {
    return function (input) {
        var a = moment(input);
        var b = moment(new Date());
        //        return dif = b.diff(a, 'Months') + "s";
        var dif = b.diff(a, 'months');
        if (dif > 0) {
            return dif + "M";
        } else if (b.diff(a, 'days') > 0) {
            return b.diff(a, 'days') + "d";
        } else if (b.diff(a, 'hours') > 0) {
            return b.diff(a, 'hours') + "h";
        } else if (b.diff(a, 'minutes') > 0) {
            return b.diff(a, 'minutes') + "min";
        } else {
            return b.diff(a, 'seconds') + "s";
        }
    };
})


.directive('barhighchart', function () {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            obj: "="
        },
        templateUrl: 'templates/directive/barhighchart.html',
        link: function ($scope, element, attr) {
            $element = $(element);

            //                        $element.children('#container').highcharts({
            //                            chart: {
            //                                type: 'bar'
            //                            },
            //                            title: {
            //                                text: 'Historic World Population by Region'
            //                            },
            //                            subtitle: {
            //                                text: 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>'
            //                            },
            //                            xAxis: {
            //                                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
            //                                title: {
            //                                    text: null
            //                                }
            //                            },
            //                            yAxis: {
            //                                min: 0,
            //                                title: {
            //                                    text: 'Population (millions)',
            //                                    align: 'high'
            //                                },
            //                                labels: {
            //                                    overflow: 'justify'
            //                                }
            //                            },
            //                            tooltip: {
            //                                valueSuffix: ' millions'
            //                            },
            //                            plotOptions: {
            //                                bar: {
            //                                    dataLabels: {
            //                                        enabled: true
            //                                    }
            //                                }
            //                            },
            //                            legend: {
            //                                layout: 'vertical',
            //                                align: 'right',
            //                                verticalAlign: 'top',
            //                                x: -40,
            //                                y: 80,
            //                                floating: true,
            //                                borderWidth: 1,
            //                                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            //                                shadow: true
            //                            },
            //                            credits: {
            //                                enabled: false
            //                            },
            //                            series:$scope.obj 
            //                        });

            $element.children('#container').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Browser market shares. January, 2015 to May, 2015'
                },
                subtitle: {
                    text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
//                        stacking: 'percent',
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                series: [{
//                    name: "Brands",
                    colorByPoint: true,
                    data: [{
                        name: "Microsoft Internet Explorer",
                        y: 96.33,
                        drilldown: "Microsoft Internet Explorer"
                    }, {
                        name: "Chrome",
                        y: 24.03,
                        drilldown: "Chrome"
                    }, {
                        name: "Firefox",
                        y: 10.38,
                        drilldown: "Firefox"
                    }, {
                        name: "Safari",
                        y: 4.77,
                        drilldown: "Safari"
                    }, {
                        name: "Opera",
                        y: 0.91,
                        drilldown: "Opera"
                    }, {
                        name: "Proprietary or Undetectable",
                        y: 0.2,
                        drilldown: null
                    }]
                }]
            });
        }
    };
});