// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('hackathon', ['ionic', 'ngCordova', 'hackathon.services', 'hackathon.controllers', 'jett.ionic.filter.bar'])

// A simple relative timestamp filter
app.filter('relativets', function () {
    return function (value) {
        var now = new Date();
        var diff = now - value;

        // ms units
        var second = 1000;
        var minute = second * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var year = day * 365;
        var month = day * 30;

        var unit = day;
        var unitStr = 'd';
        if (diff > year) {
            unit = year;
            unitStr = 'y';
        } else if (diff > day) {
            unit = day;
            unitStr = 'd';
        } else if (diff > hour) {
            unit = hour;
            unitStr = 'h';
        } else if (diff > minute) {
            unit = minute;
            unitStr = 'm';
        } else {
            unit = second;
            unitStr = 's';
        }

        var amt = Math.ceil(diff / unit);
        return amt + '' + unitStr;
    }
})

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider

    // setup an abstract state for the tabs directive


        .state('tab', {
        url: "/tab",
        abstract: true,
        controller: 'TabController',
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.mapa', {
        url: '/mapa',
        views: {
            'tab-mapa': {
                templateUrl: 'templates/mapa.html',
                controller: 'MapController'
            }
        }
    })

    .state('tab.filtros', {
        url: '/filtros',
        views: {
            'tab-filtros': {
                templateUrl: 'templates/filtros.html',
            }
        }
    })

    .state('faq', {
        url: '/faq',
        controller: 'TabController',
        templateUrl: 'templates/faq.html'
    })

    .state('conta', {
        url: '/conta',
        controller: 'TabController',
        templateUrl: 'templates/conta.html'
    })

    .state('denuncias', {
        url: '/denuncias',
        controller: 'DenunciasController',
        templateUrl: 'templates/denuncias.html'
    })

    .state('sobre', {
        url: '/sobre',
        controller: 'TabController',
        templateUrl: 'templates/sobre.html'
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/mapa');

});

app.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
});
