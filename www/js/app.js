// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('hackathon', ['ionic', 'ngCordova'])

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


function mapController($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

    $ionicPlatform.ready(function () {

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Adquirindo Localização...'
        });


        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            var myLatLng = new google.maps.LatLng(lat, lng);

            var mapOptions = {
                center: myLatLng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            $scope.map = map;
            $ionicLoading.hide();

        }, function (err) {
            $ionicLoading.hide();
            console.log(err);
        });
    });
}

app.controller('MapController', ['$scope', '$cordovaGeolocation', '$ionicLoading', '$ionicPlatform', mapController]);
