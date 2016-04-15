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
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Não foi possível adquirir sua localização.'+
                    '\nTentando novamente...'
            });

            $scope.retry = $interval(function () {
                if ($scope.hasPosition) {
                    $scope.endGeolocationError()
                }
            }, 3000);


            $scope.getPositionAgain = $interval(function () {
                if ($scope.hasPosition) {
                    $scope.stopGettingPosition()
                } else {
                    $scope.getPosition(function () {})
                }
            }, 1000);
        };

        $scope.endGeolocationError = function () {
            if (angular.isDefined($scope.retry)) {
                $interval.cancel($scope.retry);
                retry = undefined;
            }
        };

        $scope.stopGettingPosition = function () {
            if (angular.isDefined($scope.getPositionAgain)) {
                $interval.cancel($scope.getPositionAgain);
                getPositionAgain = undefined;
            }
        };

        $scope.showRevGeocodingError = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Não foi possível identificar sua cidade.' +
                    '\nTentando novamente...'
            });

            $scope.retryRG = $interval(function () {
                if ($scope.hasAddress) {
                    $scope.endRevGeocodingError()
                }
            }, 3000);

            $scope.reverseGeocodeAgain = $interval(function () {
                if ($scope.hasAddress) {
                    $scope.stopReverseGeocoding()
                } else {
                    $scope.reverseGeocodePosition($scope.latlon, function () {})
                }
            }, 1000);
        };

        $scope.stopReverseGeocoding = function () {
            if (angular.isDefined($scope.reverseGeocodeAgain)) {
                $interval.cancel($scope.reverseGeocodeAgain);
                reverseGeocodeAgain = undefined;
            }
        }

        $scope.endRevGeocodingError = function () {
            if (angular.isDefined($scope.retryRG)) {
                $interval.cancel($scope.retryRG);
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
                getConvenios($scope.map, data.address, consultaSiconv, geocoding, $ionicLoading, function (locations, shouldClear) {
                    addMarkers($scope, locations, shouldClear); //add markers, clear old markers
                }, function (err) {
                    errfun()
                });
            });
        }

        $scope.getPosition = function (errfun) {
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.hasPosition = true;

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

		$scope.latlon = {
                    lat: lat,
                    lon: lng
		};


		if(!angular.isDefined($scope.map)) { 
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
			$scope.userPosition = L.marker([lat, lng]);
			$scope.userPosition.addTo(map);
			$scope.map = map;
		
			$ionicLoading.show({
                            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Recebendo dados...'
			});

			$scope.reverseGeocodePosition($scope.latlon, $scope.showRevGeocodingError);
                    });
		} else {
		    $ionicLoading.show({
                        template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Recebendo dados...'
		    });

		    $scope.reverseGeocodePosition($scope.latlon, $scope.showRevGeocodingError);
		}

            }, function (err) {
                console.log(err);
                errfun()
            });
        };

	$scope.centerAtUser = function() {
	    console.log("Button click event!");
	}

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

//funções auxiliares
function getConvenios(map, addressData, consultaSiconv, geocoding, $ionicLoading, callback) {

    consultaSiconv.municipios({
        nome: addressData.city
    }, function (cityData) {
        var cityId = cityData.municipios[0].id;

	$ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Buscando proponentes...<br/>(Este processo pode demorar)'
        });

        consultaSiconv.proponentes({
            id_municipio: cityId
        }, function (propData) {

            var props = propData.proponentes;
            var propIds = props.map(function (prop) {
                return prop.id
            });

	    var enderecos = {};
	    
	    var someProps = propIds;
            for(i = 0; i < someProps.length; ++i) {
		enderecos[propIds[i]] = props[i].endereco
		//console.log(enderecos[propIds[i]]);

		consultaSiconv.convenios({
                    id_proponente: propIds[i]
		}, function (convData) {
                    var convs = convData.convenios;
		    var dadosConvenio = {};

                    if(convs.length > 0) { 
			console.log(convs[0].proponente.Proponente.id);
			dadosConvenio.valor_repasse = convs[0].valor_repasse;
			dadosConvenio.id_orgao = convs[0].orgao_concedente.Orgao.id;

			geocoding.get({
                            address: enderecos[convs[0].proponente.Proponente.id] + ', ' + addressData.city + ', ' + addressData.state
			},
				      function (geoData) {
					  dadosConvenio.latlon = geoData.results[0].geometry.location;
					  $ionicLoading.hide();
					  callback([dadosConvenio],true)
				      },
				      function (err) { //geocodificação falhou
				      });
		    }
		}, function (err) { //não encontrou convênios
		});
	    }
        }, function (err) { //não encontrou proponentes
        });
    }, function (err) { //não encontrou o município
    });
}



function addMarkers($scope, dataPoints, shouldClear) {
    var markers = [];

    if(shouldClear) {
	clearMarkers($scope)
    } 

    if(angular.isDefined($scope.markers)) { 
	markers = $scope.markers;
    } 
    
    for( index in dataPoints ) {
	var marker = L.marker([dataPoints[index].latlon.lat, dataPoints[index].latlon.lng]);
	markers.push(marker);
	console.log("Added marker at " + dataPoints[index].latlon.lat + " , " + 
		    dataPoints[index].latlon.lng + "\n");
    }
    
    $scope.markers = markers;
    
    for( index in markers ) { 
	markers[index].addTo($scope.map);
    }
}

function clearMarkers($scope) {
    if(angular.isDefined($scope.markers)) {
	for(index in $scope.markers) { 
	    $scope.map.removeLayer($scope.markers[index]);
	}
    }    
}
