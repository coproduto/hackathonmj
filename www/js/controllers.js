var controllers = angular.module('hackathon.controllers', []);

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

function orgaosController($scope, consulta, $ionicPlatform) {
    $ionicPlatform.ready(function () {
	consulta.orgaos({nome: "turismo"}, function(data) {
	    $scope.orgaos = data.orgaos;
	}, function(err) {
	    $scope.orgaos = [{ nome: "Não foi possível carregar as informações requisitadas." }];
	    console.log(err)
	});
    });
}

//app.controller('OrgaosController', ['$scope', 'Consulta-Siconv', '$ionicPlatform', orgaosController]);

