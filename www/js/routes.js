var app = angular.module('hackathon.routes', ['ionic', '$ionicPlatform'])

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('' / templates / inicio '')

    $stateProvider.state('tab.filtro', {
        url: '/filtros',
        views: {
            filtros: {
                templateUrl: 'templates/tab-filtros.html'
            }
        }
    })
})
