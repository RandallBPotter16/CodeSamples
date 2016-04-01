(function (SCFIT, undefined) {
    
    SCFIT.Food.Search = {
        combinedResults: {},
        searchCustomFoods: function (searchPhrase) {
                /*
                    {
                        "extUsersId":SCFIT.Config.uid,
                        "searchString":searchPhrase,
                        "matchAny":false,
                        "maxRows":5
                    }
                */ 
                SCFIT.Utils.Logging.WriteToConsole("MESSAGE", "", "QUERYING User's Custom Foods: " + searchPhrase);
                var serviceUrl, options = {}, data = {}, service = "", serviceParameters = "", dataSet = {};

                dataSet.extUsersId = SCFIT.Config.uid;
                dataSet.searchString = searchPhrase;
                dataSet.matchAny = false;
                dataSet.maxRows = 5;

                service = SCFIT.Config.Food.Nutritionix.SearchCustomFoods;
                options.url = SCFIT.Utils.Strings.serviceURLBuilder(service, serviceParameters);
                options.type = service.httpMethod;
                options.async = false;
                options.contentType = SCFIT.Config.JSONContentType;
                options.jsonp = true;
                options.crossDomain = true;
                options.cache = false;
                options.dataType = "text";
                data = JSON.stringify(dataSet);

                // Make request
                SCFIT.Utils.Data.customAjaxRequest(options.url, options, data, SCFIT.Food.Log.drawCustomFoodSearchresults, SCFIT.Errors.errorHandler);
            },
        searchFavoriteFoods: function (searchPhrase) {
            /*
                {
                    "extUsersId":SCFIT.Config.uid,
                    "searchString":searchPhrase,
                    "matchAny":true,
                    "maxRows":3
                }
            */
            SCFIT.Utils.Logging.WriteToConsole("MESSAGE", "", "QUERYING User's Favorite Foods: " + searchPhrase);
            var serviceUrl, options = {}, data = {}, service = "", serviceParameters = "", dataSet = {};
            
            dataSet.extUsersId = SCFIT.Config.uid;
            dataSet.searchString = searchPhrase;
            dataSet.matchAny = true;
            dataSet.maxRows = 5;

            service = SCFIT.Config.Food.Nutritionix.SearchFavoriteFoods;
            options.url = SCFIT.Utils.Strings.serviceURLBuilder(service, serviceParameters);
            options.type = service.httpMethod;
            options.async = false;
            options.contentType = SCFIT.Config.JSONContentType;
            options.jsonp = true;
            options.crossDomain = true;
            options.cache = false;
            options.dataType = "text";
            data = JSON.stringify(dataSet);

            // Make request
            SCFIT.Utils.Data.favoritesAjaxRequest(options.url, options, data, SCFIT.Food.Log.drawFavoriteSearchresults, SCFIT.Errors.errorHandler);
        },
        searchGetRecentFoodLog: function (searchPhrase) {
            /*
                {
                   {{url}}/api/FoodLog/GetRecentFoodLog/{{ExtUsersId}}/10
                }
            */
            SCFIT.Utils.Logging.WriteToConsole("MESSAGE", "", "GETTING User's Recently Logged Foods: " + searchPhrase);
            var serviceUrl, numberOfRows, options = {}, data = {}, service = "", serviceParameters = "", dataSet = {};
            numberOfRows = 3;
            serviceParameters = "/" + SCFIT.Config.uid + "/" + numberOfRows;
            service = SCFIT.Config.Food.Nutritionix.GetRecentFoodLog;
            options.url = SCFIT.Utils.Strings.serviceURLBuilder(service, serviceParameters);
            options.type = service.httpMethod;
            options.async = false;
            options.contentType = SCFIT.Config.JSONContentType;
            options.jsonp = true;
            options.crossDomain = true;
            options.cache = false;
            options.dataType = "text";
            //data = JSON.stringify(dataSet);

            // Make request
            SCFIT.Utils.Data.recentAjaxRequest(options.url, options, data, SCFIT.Food.Log.drawGetRecentFoodSearchresults, SCFIT.Errors.errorHandler);
        },

        init: function () {

        }
    };
})(window.SCFIT = window.SCFIT || {});