var services = angular.module('hackathon.services', ['ngResource']);

var reverseGeocodingZoomLevel = 13 //mudar para alterar o nível de precisão do geocoding reverso (se for muito baixo o sistema não vai encontrar a cidade do usuário)

var apiUrl = "http://api.convenios.gov.br/siconv/v1/consulta/"

services.factory('Consulta-Siconv',  ['$resource',
    function($resource) { 
	return $resource('http://api.convenios.gov.br/siconv/v1/consulta/:methodId.json', {}, { 
	    orgaos: { method: 'GET', params: { methodId: 'orgaos' }, isArray:  false },
	    proponentes: { method: 'GET', params: { methodId: 'proponentes' }, isArray: false },
	    municipios: { method: 'GET', params: { methodId: 'municipios' }, isArray: false },
	    convenios: { method: 'GET', params: { methodId: 'convenios' }, isArray: false},
	    situacoes_convenios: { method: 'GET', params: { methodId: 'situacoes_convenios' }, isArray: false},
	});
}]);

services.factory('Reverse-Geocoding', ['$resource',
    function($resource) { 
	return $resource('http://nominatim.openstreetmap.org/reverse?format=json&lat=:lat&lon=:lon&zoom=:zoomLevel',
			 {zoomLevel: reverseGeocodingZoomLevel}, {});
    }
]);


//fluxo de consulta:

//descobre o município do usuário
//busca convênios do município
//ordena por distância para o usuário
