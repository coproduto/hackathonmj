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

            var map = new L.map('map').setView([lat, lng], 15)

            L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                maxZoom: 18
            }).addTo(map);

            map.whenReady(function () {

                L.marker([lat, lng]).addTo(map);
                $scope.map = map;
                $ionicLoading.hide();
            });

        }, function (err) {
            $ionicLoading.hide();
            console.log(err);
        });
    });

}
app.controller('MapController', ['$scope', '$cordovaGeolocation', '$ionicLoading', '$ionicPlatform', mapController]);

//controlador de teste
function orgaosController($scope, consulta, $ionicPlatform) {
    $ionicPlatform.ready(function () {
        consulta.orgaos({
            nome: "turismo"
        }, function (data) {
            $scope.orgaos = data.orgaos;
        }, function (err) {
            $scope.orgaos = [{
                nome: "Não foi possível carregar as informações requisitadas."
            }];
            console.log(err)
        });
    });
}

app.controller('TabController', function ($scope, $ionicSideMenuDelegate) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }

});

app.controller('FaqCtrl', function ($scope, $ionicSideMenuDelegate) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }
});

//app.controller('OrgaosController', ['$scope', 'Consulta-Siconv', '$ionicPlatform', orgaosController]);
