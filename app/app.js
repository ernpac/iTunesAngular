var app = angular.module('app', ['kendo.directives', 'ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: '/app/views/main.html', controller: 'MainController', controllerAs: 'ctrl' })
    .when('/grid', { templateUrl: '/app/views/grid.html', controller: 'KendoController', controllerAs: 'ctrl' })
    .otherwise({ redirectTo: '/' })
}]);

app.factory('dataService', function ($http) {
    function _search(searchTerm) {
        var itunes = 'https://itunes.apple.com/search?term=ARTIST&entity=album&attribute=artistTerm';

        itunes = itunes.replace('ARTIST', searchTerm);
        return $http.jsonp(itunes, {
            params: {
                "callback": "JSON_CALLBACK",
                "term": searchTerm
            }
        });
    }

    function _getTracks(id) {
        var itunes = 'https://itunes.apple.com/lookup?id=' + id + '&entity=song';
        return $http.jsonp(itunes, {
            params: {
                "callback": "JSON_CALLBACK",
                "collectionId": id
            }
        });
    }

    function _getTv() {
        var itunes = 'https://itunes.apple.com/search?term=scrubs&media=tvShow&limit=200&entity=tvEpisode&attribute=tvSeasonTerm';//search?term=scrubs+season+2&media=tvShow';
        return $http.jsonp(itunes, {
            params: {
                "callback": "JSON_CALLBACK",
                "term": "scrubs"
            }
        });

    }
    return {
        search: _search,
        getTracks: _getTracks,
        getTv: _getTv
    }
});

app.directive('tracksColumn', ['dataService', function (dataService, $compile) {
    var getTracks = function (scope, elem, attrs) {
            var builder = '';
            dataService.getTracks(scope.album)
            .then(function (tracks) {
                builder += '<ol>';
                angular.forEach(tracks.data.results, function (track) {
                    if (track.kind == 'song') {
                        builder = builder + '<li>' + track.trackName + '</li>';
                    }
                })
                elem.append(builder);
            });
    }

    return {
        restrict: 'AE',
        replace: false,
        template: '',
        scope: {
            album: '@album'
        },
        link: getTracks
    }
}]);