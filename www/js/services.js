var services = angular.module('hackathon.services', ['ngResource']);

var apiUrl = "http://api.convenios.gov.br/siconv/v1/consulta/"

services.factory('Consulta-Siconv',  ['$resource',
    function($resource) { 
	return $resource('http://api.convenios.gov.br/siconv/v1/consulta/:methodId.json', {}, { 
	    orgaos: { method: 'GET', params: { methodId: 'orgaos' }, isArray:  false }
	});
}]);
    
