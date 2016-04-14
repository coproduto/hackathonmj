var controllers = angular.module('hackathon.controllers', ['hackathon.services']);



function mapController($scope,
    $cordovaGeolocation,
    geocoding,
    reverseGeocoding,
    consultaSiconv,
    $ionicLoading,
    $ionicPlatform) {

    $ionicPlatform.ready(function () {
        $scope.showGeolocationError = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Não foi possível adquirir sua localização.' +
                    '\nTentando novamente...'
            });

            var retry;
            retry = $interval(function () {
                if ($scope.hasPosition) {
                    $scope.endGeolocationError()
                }
            }, 3000);

            var getPositionAgain;
            getPositionAgain = $interval(function () {
                if ($scope.hasPosition) {
                    $scope.stopGettingPosition()
                } else {
                    $scope.getPosition(function () {})
                }
            }, 1000);
        };

        $scope.endGeolocationError = function () {
            if (angular.isDefined(retry)) {
                $interval.cancel(retry);
                retry = undefined;
            }
        };

        $scope.stopGettingPosition = function () {
            if (angular.isDefined(getPositionAgain)) {
                $interval.cancel(getPositionAgain);
                getPositionAgain = undefined;
            }
        };

        $scope.showRevGeocodingError = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Não foi possível identificar sua cidade.' +
                    '\nTentando novamente...'
            });

            var retryRG;
            retryRG = $interval(function () {
                if ($scope.hasAddress) {
                    $scope.endRevGeocodingError()
                }
            }, 3000);

            var reverseGeocodeAgain;
            reverseGeocodeAgain = $interval(function () {
                if ($scope.hasAddress) {
                    $scope.stopReverseGeocoding()
                } else {
                    $scope.reverseGeocodePosition($scope.latlon, function () {})
                }
            }, 1000);
        };

        $scope.stopReverseGeocoding = function () {
            if (angular.isDefined(reverseGeocodeAgain)) {
                $interval.cancel(reverseGeocodeAgain);
                reverseGeocodeAgain = undefined;
            }
        }

        $scope.endRevGeocodingError = function () {
            if (angular.isDefined(retryRG)) {
                $interval.cancel(retryRG);
                retryRG = undefined;
            }
        }

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };

        $scope.reverseGeocodePosition = function (latlon, errfun) {
            reverseGeocoding.get(latlon, function (data) {
                $scope.hasAddress = true
                getConvenios($scope.map, data.address, consultaSiconv, geocoding, $ionicLoading, function (locations) {
                    addMarkers($scope.map, locations);
                }, function (err) {
                    errfun()
                });
            });
        }

        $scope.getPosition = function (errfun) {
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.hasPosition = true

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                var map = new L.map('map').setView([lat, lng], 15)
                L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: 'Map data &cop; ' +
                        '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
                        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    id: 'mapbox.streets'
                }).addTo(map);

                map.whenReady(function () {
                    L.marker([lat, lng]).addTo(map);
                    $scope.map = map;
                    $scope.latlon = {
                        lat: lat,
                        lon: lng
                    };

                    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Recebendo dados...'
                    });

                    $scope.reverseGeocodePosition($scope.latlon, $scope.showRevGeocodingError);
                });

            }, function (err) {
                console.log(err);
                errfun()
            });
        };

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Adquirindo Localização...'
        });

        $scope.getPosition($scope.showGeolocationError);
    });
}

app.controller('MapController', ['$scope',
				 '$cordovaGeolocation',
				 'geocoding',
				 'reverseGeocoding',
				 'consultaSiconv',
				 '$ionicLoading',
				 '$ionicPlatform',
				 mapController]);

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

app.controller('TabController', function ($scope, $ionicSideMenuDelegate, $ionicHistory) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.myGoBack = function () {
        $ionicHistory.goBack();
    }

});

app.controller('FaqCtrl', function ($scope, $ionicSideMenuDelegate) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }
});

app.controller('DenunciasController', function ($scope, $ionicSideMenuDelegate) {
    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.posts = [];

    for (var i = 0; i < 7; i++) {
        // Data Fake
        var date = (+new Date) - (i * 1000 * 60 * 60);
        $scope.posts.push({
            created_at: date,
            text: 'Convenio ' + ((Math.floor(Math.random() * 2) === 1) ? '1233451' : '')
        });
    }
});

//app.controller('OrgaosController', ['$scope', 'Consulta-Siconv', '$ionicPlatform', orgaosController]);

//funções auxiliares
function getConvenios(map, addressData, consultaSiconv, geocoding, $ionicLoading, callback) {

    var dadosConvenio = {};

    consultaSiconv.municipios({
        nome: addressData.city
    }, function (cityData) {
        var cityId = cityData.municipios[0].id;
        consultaSiconv.proponentes({
            id_municipio: cityId
        }, function (propData) {
            var props = propData.proponentes;
            var propIds = props.map(function (prop) {
                return prop.id
            });
            console.log(propIds.slice(0, 10));
            dadosConvenio.endereco = props[0].endereco

            consultaSiconv.convenios({
                id_proponente: propIds[0]
            }, function (convData) {
                var convs = convData.convenios

                //tratar caso de não ter nenhum convênio
                dadosConvenio.valor_repasse = convs[0].valor_repasse;
                dadosConvenio.id_orgao = convs[0].orgao_concedente.Orgao.id;

                console.log(dadosConvenio);

                geocoding.get({
                        address: dadosConvenio.endereco + ', ' + addressData.city + ', ' + addressData.state
                    },
                    function (geoData) {
                        dadosConvenio.latlon = geoData.results[0].geometry.location;
                        console.log(dadosConvenio.latlon);
                        $ionicLoading.hide();
                        callback([dadosConvenio])
                    },
                    function (err) { //geocodificação falhou
                    });
            }, function (err) { //não encontrou convênios
            });
        }, function (err) { //não encontrou proponentes
        });
    }, function (err) { //não encontrou o município
    });
}

function addMarkers(dataPoints, $scope) {}
