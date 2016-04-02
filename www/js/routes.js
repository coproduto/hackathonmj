.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('tab.filtros', {
        url: '/filtros',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-filtros.html',
                controller: 'FiltrosCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/filtros');

});
