var services = angular.module('hackathon.services', ['ngResource']);

var reverseGeocodingZoomLevel = 13 //mudar para alterar o nível de precisão do geocoding reverso (se for muito baixo o sistema não vai encontrar a cidade do usuário)

var apiUrl = "http://api.convenios.gov.br/siconv/v1/consulta/"

var googleGeocodingKey = "AIzaSyCB3ksf5AXw-6ijgoM8yloebS4Rc-AnmCA"

services.factory('consultaSiconv',  ['$resource',
    function($resource) { 
	return $resource('http://api.convenios.gov.br/siconv/v1/consulta/:methodId.json', {}, { 
	    orgaos: { method: 'GET', params: { methodId: 'orgaos' }, isArray:  false },
	    proponentes: { method: 'GET', params: { methodId: 'proponentes' }, isArray: false },
	    municipios: { method: 'GET', params: { methodId: 'municipios' }, isArray: false },
	    convenios: { method: 'GET', params: { methodId: 'convenios' }, isArray: false},
	    situacoes_convenios: { method: 'GET', params: { methodId: 'situacoes_convenios' }, isArray: false},
	});
}]);

services.factory('reverseGeocoding', ['$resource',
    function($resource) { 
	return $resource('http://nominatim.openstreetmap.org/reverse?format=json&lat=:lat&lon=:lon&zoom=:zoomLevel',
			 {zoomLevel: reverseGeocodingZoomLevel}, {});
    }
]);

services.factory('geocoding', ['$resource',
    function($resource) {
	return $resource('https://maps.googleapis.com/maps/api/geocode/json?address=:address&key=:key',
			 {key: googleGeocodingKey}, {});
    }
]);

//fluxo de consulta:

//descobre o município do usuário
//busca convênios do município
//ordena por distância para o usuário
