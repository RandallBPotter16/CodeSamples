angular.module('discovery.controller.discovery.location', [ 'ionic', 'config', 'config-api', 'ion-autocomplete', 'discovery.services.user', 'imagitas.services.geolocation', 'discovery.services.autocomplete' ])
    .controller( 'LocationCtrl', function(
        $ionicPlatform,
        $log,
        $scope,
        $http,
        LocationService,
        AnalyticsService,
        AutocompleteDataService,
        GPS_LOCATION_MODE,
        ZIP_CODE_LOCATION_MODE,
        BASE_API_CONFIG,
        API_ENDPOINT_SMARTYSTREET_ADDRESS_SUGGESTION,
        API_ENDPOINT_SMARTYSTREET_ADDRESS_VERIFICATION,
        AUTO_SUGGEST_LOCATION_MODE)
    {
        'use strict';

        var _this = this;
        $scope.user = {
            zip: ""
        };
        $scope.model = "";
        $scope.callbackValueModel = "";
        $scope.data = { "addresses" : [], "search" : '' };

        $scope.geoLocationMode = function() {
            $scope.loadingInProgress = true;
            $log.info("LocationController.js $scope.geoLocationMode has been selected");
            LocationService.initializeLocation(GPS_LOCATION_MODE);
            $scope.loadingInProgress = false;
        };

        $scope.manualLocationMode = function() {
            //TODO: Right now there is no validation of the manually entered zip code - we just use whatever we get, even if it's nothing
            $log.info("LocationController.js $scope.manualLocationMode has been selected: user's input zip: " + $scope.user.zip);
            $scope.loadingInProgress = true;
            LocationService.setZipCode($scope.user.zip);
            LocationService.initializeLocation(ZIP_CODE_LOCATION_MODE);
            $scope.loadingInProgress = false;
        };

        $scope.getAddresses= function (query) {

            var baseUrl = BASE_API_CONFIG.domain + API_ENDPOINT_SMARTYSTREET_ADDRESS_SUGGESTION.endpoint,
                searchTerm = encodeURI(query),
                requestUrl = baseUrl + searchTerm;
            return $http.get(requestUrl);


        };

        $scope.itemsClicked = function (callback) {
            $scope.callbackValueModel = callback;
            var baseUrl = BASE_API_CONFIG.domain + API_ENDPOINT_SMARTYSTREET_ADDRESS_VERIFICATION.endpoint,
                streetAddress = "street=" + callback.item.street +"&city="+callback.item.city + "&state="+callback.item.state,
                requestUrl = baseUrl + encodeURI(streetAddress);

            //TODO:  Add error condition.
            $http.get(requestUrl)
                .success(function(json) {
                    console.log(json[0].loc);
                    if(typeof json !== "undefined") {
                        var addressInformation = json[0];
                        if (Object.keys(addressInformation).length > 0) {
                            var latitude = addressInformation.loc.latitude,
                                longitude = addressInformation.loc.longitude;
                            //store information into local storage and user memory object;
                            LocationService.setCurrentLocation(addressInformation.loc);
                            LocationService.setZipCode(addressInformation.zipCode);
                            LocationService.setCurrentCity(addressInformation.city);
                            LocationService.setCurrentState(addressInformation.state);
                            LocationService.initializeLocation(AUTO_SUGGEST_LOCATION_MODE);
                        }
                    }
                });
        };
        $ionicPlatform.ready(function() {
            AnalyticsService.trackState( 'Address' );
        });
    });