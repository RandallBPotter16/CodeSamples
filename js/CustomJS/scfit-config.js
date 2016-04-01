(function (SCFIT, undefined) {
    "use strict";

    SCFIT.Config = {};

    // DEBUG LEVELS as of 11/21/2013:  VERBOSE, PROD triggers no tracing.
    SCFIT.Config.DebugLevel = "PROD";
    SCFIT.Config.uid = window.uid;
    SCFIT.Config.isAdHoc = window.isAdHoc;

    SCFIT.Config.OutOfProgramUser = window.OutOfProgramUser ;
    SCFIT.Config.InPhaseUser = window.InPhaseUser;
    SCFIT.Config.InterPhaseUser = window.InterPhaseUser;
    
    SCFIT.Config.hasAnyWeightData = window.hasAnyWeightData;

    SCFIT.Config.ShowIntro = window.ShowIntro;
    SCFIT.Config.IntroRemindLater = window.IntroRemindLater;
    SCFIT.Config.ShowEndPhase = window.ShowEndPhase;
    SCFIT.Config.ShowEndProgram = window.ShowEndProgram;
    SCFIT.Config.ShowBadge = window.ShowBadge;
    
    SCFIT.Config.authKey = window.k;
    SCFIT.Config.pref = window.pref;
    SCFIT.Config.CurrentTheme = window.CurrentTheme;
    SCFIT.Config.env = "dev";
    if (typeof window.SCProgramsPath != "undefined") {
        SCFIT.Config.SCProgramsPath = window.SCProgramsPath.replace("http://", "https://");
    } else {
        SCFIT.Config.SCProgramsPath = "";
    }

    SCFIT.Config.Theme = {};
    SCFIT.Config.Theme.CurrentTheme = { "Colors": {} };

    if (SCFIT.Config.CurrentTheme == "Army") {
        SCFIT.Config.CurrentTheme = "armyfit";
    }
    // GET the breakpoint data.
    $.get('/themes/'+SCFIT.Config.CurrentTheme+'/sass/vars/json/colors.json')
        .done(function (res) {
            // Parse the JSON.
            SCFIT.Config.Theme.CurrentTheme.Colors = res;
        });
 


    SCFIT.Config.Social = {};
    SCFIT.Config.Social.Facebook = {};
    SCFIT.Config.Social.Twitter = {};
    SCFIT.Config.Social.GooglePlus = {};
    
    SCFIT.Config.Social.Facebook.FacebookAppId = window.FacebookAppId;
    SCFIT.Config.Social.Facebook.FacebookChannelUrlSuffix = window.FacebookChannelUrlSuffix;
    SCFIT.Config.Social.Facebook.TYDBStaticLandingPage = window.TYDBStaticLandingPage;

    SCFIT.Config.SSOURL = window.SSOURL;
    SCFIT.Config.SSOClient = window.SSOClient;
    SCFIT.Config.SSOPageJSURL = SCFIT.Config.SSOURL + "/tools/page.js?response_type=token&client_id=" + SCFIT.Config.SSOClient;
    SCFIT.Config.UserTime = window.userTime;

    SCFIT.Config.SCProgramsPath = "";

    SCFIT.Config.jsPath = window.pathPrefix + "js/scfit/";
    SCFIT.Config.s3Path = window.s3Path;
    SCFIT.Config.programThemePath = window.programThemePath;
    SCFIT.Config.brightCovePlayerID = window.BRIGHTCOVEPLAYERID;
    SCFIT.Config.brightCovePlayerKey = window.BRIGHTCOVEPLAYERKEY;
    SCFIT.Config.todaysDate = {};
    SCFIT.Config.selectedDate = {};
    SCFIT.Config.autoCompletePause = .1;
    SCFIT.Graphs = {};
    SCFIT.Config.Food = {};
    SCFIT.Config.Food.Nutritionix = {};
    SCFIT.Config.Food.Images = {};
    SCFIT.Config.Food.Forms = {};
    SCFIT.Config.Food.Filters = {};
    SCFIT.Config.JSONContentType = "application/json; charset=utf-8";
    
    // #### Nutritionix API Config Values ##########################################
    // 1 = Breakfast, 2 = Lunch, 3 = Dinner, 4 = Snack, 5 = Not Applicable  
    SCFIT.Config.Food.Nutritionix.mealTypes = {};
    SCFIT.Config.Food.Nutritionix.mealTypes["1"] = "Breakfast";
    SCFIT.Config.Food.Nutritionix.mealTypes["2"] = "Lunch";
    SCFIT.Config.Food.Nutritionix.mealTypes["3"] = "Dinner";
    SCFIT.Config.Food.Nutritionix.mealTypes["4"] = "Snacks &amp; Desserts";
    SCFIT.Config.Food.Nutritionix.mealTypes["5"] = "Not Applicable";
    SCFIT.Config.Food.SearchFilters = {};
    SCFIT.Config.Food.SearchFilters["1"] = "Basic Foods";
    SCFIT.Config.Food.SearchFilters["2"] = "Brand Names";
    SCFIT.Config.Food.SearchFilters["3"] = "Restaurants";
    // #### Nutritionix Service ##########################################
    // Need to denote http verb per endpoint method
    SCFIT.Config.Food.Nutritionix.appId = "d1762500";
    SCFIT.Config.Food.Nutritionix.appKey = "7d4a609f85a2d7c60897109050b4cf86";
    SCFIT.Config.Food.Nutritionix.apiBaseUrl = "https://api.nutritionix.com/v1_1/";
    SCFIT.Config.Food.Nutritionix.apiSearch = "search/";


    if (document.location.hostname == "localhost") {
        SCFIT.Config.Food.Nutritionix.ServiceBase = "https://localhost/nutix/";
    } else {
        SCFIT.Config.Food.Nutritionix.ServiceBase = SCFIT.Config.SCProgramsPath + "nutix/";
    }

    SCFIT.Config.Food.Nutritionix.FoodLog = { api: "api/", controller: "FoodLog/", method: "", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.FoodLogSave = { api: "api/", controller: "FoodLog/", method: "SaveFoodToLog", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.FoodLogSave2 = { api: "api/", controller: "FoodLog/", method: "SaveFoodToLog2", default: "", httpMethod: "POST" };

    SCFIT.Config.Food.Nutritionix.FoodLogChange = { api: "api/", controller: "FoodLog/", method: "ChangeFoodLogEntry", default: "", httpMethod: "PUT" };
    SCFIT.Config.Food.Nutritionix.FoodLogDelete = { api: "api/", controller: "FoodLog/", method: "DeleteFoodLogEntry", default: "", httpMethod: "DELETE" };
    SCFIT.Config.Food.Nutritionix.SetUnsetFavorite = { api: "api/", controller: "FoodLog/", method: "SetUnsetFoodFavorite", default: "", httpMethod: "PUT" };
    SCFIT.Config.Food.Nutritionix.SetUnsetFavoriteByFoodLog = { api: "api/", controller: "FoodLog/", method: "SetUnsetFoodFavoriteByFoodLog", default: "", httpMethod: "PUT" };
    SCFIT.Config.Food.Nutritionix.UpdateQuantity = { api: "api/", controller: "FoodLog/", method: "UpdateQuantity", default: "", httpMethod: "PUT" };
    SCFIT.Config.Food.Nutritionix.UpdateServing = { api: "api/", controller: "FoodLog/", method: "UpdateServing", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetFoodLog = { api: "api/", controller: "FoodLog/", method: "GetFoodLog", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetFoodLogNested = { api: "api/", controller: "FoodLog/", method: "GetFoodLogNested", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.SearchNutix = { api: "api/", controller: "Nutritionix/", method: "SearchNutix", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.PowerSearchNutix = { api: "api/", controller: "Nutritionix/", method: "PowerSearchNutix", default: "", httpMethod: "POST" };

    SCFIT.Config.Food.Nutritionix.SearchCustomFoods = { api: "api/", controller: "CustomFoodLog/", method: "SearchCustomFoods", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.SearchFavoriteFoods = { api: "api/", controller: "FoodLog/", method: "SearchFavoriteFoods", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.GetRecentFoodLog = { api: "api/", controller: "FoodLog/", method: "GetRecentFoodLog", default: "", httpMethod: "GET" };

    SCFIT.Config.Food.Nutritionix.GetFavoriteFoodList = { api: "api/", controller: "FoodLog/", method: "GetFavoriteFoodList", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.CustomFoodLog = { api: "api/", controller: "CustomFoodLog/", method: "", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetCustomFoodLog = { api: "api/", controller: "CustomFoodLog/", method: "GetCustomFoodPerUser", default: "/0/", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.SaveCustomFoodToLog = { api: "api/", controller: "CustomFoodLog/", method: "SaveCustomFoodToLog", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.CreateCustomFood = { api: "api/", controller: "CustomFoodLog/", method: "CreateCustomFood", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.CreateAndLogCustomFood = { api: "api/", controller: "CustomFoodLog/", method: "CreateAndLogCustomFood", default: "", httpMethod: "POST" };


    SCFIT.Config.Food.Nutritionix.UpdateCustomFoodEntry = { api: "api/", controller: "CustomFoodLog/", method: "UpdateCustomFoodEntry", default: "", httpMethod: "PUT" };
    SCFIT.Config.Food.Nutritionix.DeleteCustomFoodEntry = { api: "api/", controller: "CustomFoodLog/", method: "DeleteCustomFoodEntry/", default: "", httpMethod: "DELETE" };
    SCFIT.Config.Food.Nutritionix.AddQuickCal = { api: "api/", controller: "QuickCalorie/", method: "AddQuickCal", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.MealLog = { api: "api/", controller: "MealLog/", method: "", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.SaveMealToFoodLog = { api: "api/", controller: "MealLog/", method: "SaveMealToFoodLog", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.SaveMealFavorite = { api: "api/", controller: "MealLog/", method: "SaveMealFavorite", default: "", httpMethod: "POST" };
    SCFIT.Config.Food.Nutritionix.DeleteMealfavorite = { api: "api/", controller: "MealLog/", method: "DeleteMealFavorite", default: "", httpMethod: "DELETE" };
    SCFIT.Config.Food.Nutritionix.GetFavoriteMeals = { api: "api/", controller: "MealLog/", method: "GetFavoriteMeals", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetFavoriteMealsNested = { api: "api/", controller: "MealLog/", method: "GetFavoriteMealsNested", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.IsAMeal = { api: "api/", controller: "MealLog/", method: "IsAMeal", default: "", httpMethod: "PUT" };


    SCFIT.Config.Food.Nutritionix.GetCaloriesForDay = { api: "api/", controller: "User/", method: "GetCaloriesForDay", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetCaloriesForWeek = { api: "api/", controller: "User/", method: "GetCaloriesForWeek", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetCaloriesForMonth = { api: "api/", controller: "User/", method: "GetCaloriesForMonth", default: "", httpMethod: "GET" };
    SCFIT.Config.Food.Nutritionix.GetCaloriesForYear = { api: "api/", controller: "User/", method: "GetCaloriesForYear", default: "", httpMethod: "GET" };


    SCFIT.Config.Food.Nutritionix.GetGoalCalories = { api: "api/", controller: "User/", method: "GetGoalCalories", default: "", httpMethod: "GET" };
    SCFIT.Config.Modules = {};
    SCFIT.Config.Modules.Settings = {};
    SCFIT.Config.Modules.Settings =
        {
            fancybox: {
                autoSize: false,
                fitToView: false,
                centerOnScroll: true,
                hideOnOverlayClick: true,
                fixed: true,
                width: 735,
                height: "auto",
                padding: 1, // enables rounded corners
                margin: 0,
                scrolling: "no",
                openEffect: "fade",
                closeEffect: "fade",
                title: "",
                helpers: {
                    overlay: {
                        closeClick: true
                    },
                    title: null
                }
            }
        };
    // #############################################################################

    // Food Images
    SCFIT.Config.Food.Images.Favorite = SCFIT.Config.programThemePath + "images/symbol-star-selected.png";
    SCFIT.Config.Food.Images.NotFavorite = SCFIT.Config.programThemePath + "images/symbol-star-not-selected.png";
    SCFIT.Config.Food.Images.Expand = SCFIT.Config.programThemePath + "images/symbol-small-arrow-point-right.png";
    SCFIT.Config.Food.Images.Expanded = SCFIT.Config.programThemePath + "images/symbol-wide-arrow-pointed-down.png";

})(window.SCFIT = window.SCFIT || {});
