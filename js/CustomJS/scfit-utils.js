(function (SCFIT, undefined) {

    SCFIT.Utils = {};
    
    SCFIT.Utils.Numbers = {
        safePrecisionNumber: function (number, precision) {
            if (typeof number == "undefined" || number == "" || $.trim(number).toLowerCase() == "null" || $.trim(number).toLowerCase() == "N/A") {
                number = 0;
            } else {
                number = Number(number);
            }
            if (typeof precision != "undefined" && precision != "" && $.trim(precision).toLowerCase() != "null") {
                number = SCFIT.Utils.Numbers.toPrecisionFactor(precision);
            }
            return number;
        },
        toPrecisionFactor: function(amount, factor) {
            return Number(amount).toFixed(factor);
        },
        toPrecisionFactorString: function (amount, factor) {
            return Number(amount).toFixed(factor).toString();
        },
    };

    SCFIT.Utils.Strings =
    {
        generateUniqueID: function (uniqIDLength) {
            var uniqueID = '', dateStamp = Date().toString().replace(/\s/g, ''),
                alphaChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            /*symbolChars: ['!', '@', '£', '$', '%', '^', '*', '(', ')', '_', '-', '~'],*/
            if (!uniqIDLength) {
                var uniqIDLength = 10;
            }
            for (var uniqIDCounter = 0; uniqIDCounter < uniqIDLength; uniqIDCounter++) {
                uniqueID += alphaChars[Math.round(Math.random() * 25).toString()];
                uniqueID += Math.round(Math.random() * 10);
                uniqueID += dateStamp.charAt(Math.random() * (dateStamp.length - 1));
            }
            return SCFIT.Utils.Strings.sanitize(uniqueID);
        },
        sanitize: function (str) {
            var sanitized = '',
                trimmed = $.trim(str);
            sanitized = trimmed.replace(/[^a-z0-9-]/gi, '-').
                replace(/-+/g, '-').
                replace(/^-|-$/g, '');
            return sanitized;
        },
        sanitizeQuery: function(string) {
            string = string.replace(new RegExp("<[^>]+>"), "");
            return string;
        },
        getQueryStringVariable: function (variable, type) {
            var query = window.location.search.substring(1),

            vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    if (SCFIT.Utils.Data.typeCheck(pair[1], type)) {
                        return SCFIT.Utils.Strings.sanitize(pair[1]);
                    } else {
                        return false;
                    }
                }
            }
            return (false);
        },
        jsonPrintR: function (json) {
            json = JSON.stringify(json, undefined, 2); // indentation level = 2
        },
        cleanScrape: function (obj) {
            obj = obj.results[0];
            obj = $(obj).text().trim();;
            obj = jQuery.parseJSON(obj);
            return obj;
        },
        serviceURLBuilder: function (serviceObj, serviceParameters) {
            var serviceUrl = SCFIT.Config.Food.Nutritionix.ServiceBase
            + serviceObj.api
            + serviceObj.controller
            + serviceObj.method
            + serviceObj.default
            + serviceParameters;
            return serviceUrl;
        }
    };
    SCFIT.Utils.Objects =
    {
        trusted: function(obj) {
            obj = SCFIT.Utils.Objects.replaceNullValues(obj);
            return obj;
        },
        replaceNullValues: function(obj, value) {
            var result = {};
            for (var i in obj) {
                if (!obj[i] || obj[i] === null) {
                    result[i] = "";
                } else {
                    result[i] = SCFIT.Utils.Strings.sanitize(obj[i]);
                }
            }
            return result;
        },
        
        objectToString: function(obj) {
            var properties = "";
            $.each(obj, function(key, val) {
                if (val && val !== "undefined") {
                    properties += val;
                }
            });
            return properties;
        },
        objectLength: function(obj) {
            return Object.keys(obj).length;
        },
        findDifferences: function(objectA, objectB) {
            var propertyChanges = [];
            var objectGraphPath = ["this"];
            (function(a, b) {
                if (a.constructor == Array) {
                    // BIG assumptions here: That both arrays are same length, that
                    // the members of those arrays are _essentially_ the same, and 
                    // that those array members are in the same order...
                    for (var i = 0; i < a.length; i++) {
                        objectGraphPath.push("[" + i.toString() + "]");
                        arguments.callee(a[i], b[i]);
                        objectGraphPath.pop();
                    }
                } else if (a.constructor == Object || (a.constructor != Number &&
                    a.constructor != String && a.constructor != Date &&
                    a.constructor != RegExp && a.constructor != Function &&
                    a.constructor != Boolean)) {
                    // we can safely assume that the objects have the 
                    // same property lists, else why compare them?
                    for (var property in a) {
                        objectGraphPath.push(("." + property));
                        if (a[property].constructor != Function) {
                            arguments.callee(a[property], b[property]);
                        }
                        objectGraphPath.pop();
                    }
                } else if (a.constructor != Function) { // filter out functions
                    if (a != b) {
                        propertyChanges.push({ "Property": objectGraphPath.join(""), "ObjectA": a, "ObjectB": b });
                    }
                }
            })(objectA, objectB);
            return propertyChanges;
        },
        combineTwoObjects: function (objA, objB) {
            var superObject = {};
            SCFIT.Data.Food.CustomFoods.forEach(
                function (el) {
                    superObject[el.NutixName] = el
                }
            );
            SCFIT.Data.Food.FavoriteFoods.forEach(
                function (el) {
                    superObject[el.NutixName] = el
                }
            );


            return superObject;
        },
        removeDuplicatesBetweenTwoObjects: function(objA, objB) {
            var superObject = $.extend({}, objA, objB);
            var seen = {};

            $(superObject).each(function (key, value) {
                var txt = value[key];
                if (seen[txt]) {
                    $(superObject).remove();
                }
            });

            superObject = seen;
            return superObject;
        }
    };
    SCFIT.Utils.DateTime =
    {
        getDateString: function (sdate, ti) {
            sdate = sdate.replace(/\-/g, '/').replace(/T/g, ' ').split(' ')[0];
            if ((ti == 'w') && new Date().getDate() === new Date(sdate).getDate()) {
                return '<strong>Today</strong>';
            } else if (ti == 'w') {
                if (window.location.href.lastIndexOf('/') == (window.location.href.length - 1))
                    return (new Date(sdate).getMonth() + 1) + '/' + new Date(sdate).getDate();
                else
                    return actWeekDays[new Date(sdate).getDay()] + ' ' + (new Date(sdate).getMonth() + 1) + '/' + new Date(sdate).getDate();
            } else if (ti == 'm')
                return new Date(sdate).getDate();
            else
                return monthNames[new Date(sdate).getMonth()];
        },
        getTodaysDateMMDDYYYY: function () {
            var today = new Date(SCFIT.Config.UserTime);
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            today = mm + '/' + dd + '/' + yyyy;
            return today;
        },
        // date is at : 10-20-2014
        // needs to be: log_food&activity[date]=2012-12-07"
        getDateYYYYMMDD: function (date) {
            var inputDate = new Date(date);
            var yyyy = inputDate.getFullYear().toString();
            var mm = (inputDate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = inputDate.getDate().toString();
            return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
        },
        getDateTimeWithOffset: function () {
            var dateString = new Date();
            dateString = dateString + " UTC Offset: " + dateString.getTimezoneOffset();
            return dateString;
        },
        formatDateMMDDYYYY: function (date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!

            var yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            date = mm + '/' + dd + '/' + yyyy;
            return date;
        }

    };
    SCFIT.Utils.Data =
    {
        typeCheck: function(obj, type) {
            switch (type) {
                case "Number":
                    return !isNaN(Number(obj));
                case "String":
                    return typeof obj === 'string';
                default:
                    return false;
            }
        },
        // saving time by just creating a separate method for the autocomplete.  This could all be made into a module.
        foodAjaxRequest: function(url, options, data, successCallback, errorCallback, element) {
            $.support.cors = true;

            var timeOut = 30000,
                authString = Base64.encode(SCFIT.Config.uid + " : " + SCFIT.Config.authKey);

            if (!element) {
                element = "";
            }

            if (options.timeOut > 0) {
                timeout = options.timeOut;
            }

            if (typeof options.async == "undefined" || options.async == "") {
                options.async = true;
            }

            // if an existing ajax call requests - abort it and start a new one.
            if (SCFIT.Food.Log.Services.AjaxCalls.newAjaxRequest) {
                SCFIT.Food.Log.Services.AjaxCalls.newAjaxRequest.abort();
            }

            SCFIT.Food.Log.Services.AjaxCalls.newAjaxRequest = $.ajax({
                type: options.type,
                headers: {
                    "Authorization": "Basic " + authString,
                    "UID": SCFIT.Config.uid
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + authString);
                    xhr.setRequestHeader("UID", SCFIT.Config.uid);
                },
                contentType: options.contentType,
                /* encoding - cleaning - add here */
                url: options.url,
                crossDomain: options.crossDomain,
                timeout: timeOut,
                data: data,
                async: options.async,
                jsonp: options.jsonp,
                cache: options.cache,
                dataType: options.dataType,
                complete: function(xhr) {

                    if (xhr.readyState == 4) {
                        switch (xhr.status) {
                            case "200":
                                break;
                            case "201":
                                break;
                            case "304":
                                break;
                            case "403":
                                break;
                            case "404":
                                break;
                            case "500":
                                break;
                        }
                    } else {
                        // alert("NoGood");
                    }
                }
            });
            SCFIT.Food.Log.Services.AjaxCalls.newAjaxRequest.done(function(data, textStatus, jqXHR) {
                if (typeof successCallback == "function") {
                    SCFIT.Food.Log.Services.AjaxCalls.newAjaxRequest = "";
                    successCallback(data, $(element));
                    obj = "", data = "";
                } else {
                }
            });
            SCFIT.Food.Log.Services.AjaxCalls.newAjaxRequest.fail(function(jqXHR, textStatus) {
                var errorObjectString = SCFIT.Utils.Objects.objectToString(jqXHR);
                // optimize this later.
                if (errorObjectString.toLowerCase().indexOf("no transport") >= 0) {
                    textStatus = "IE8/9 No Transport Error";
                }
                if (errorObjectString.toLowerCase().indexOf("abort") >= 0) {
                    textStatus = "Call Aborted";
                }
                if (typeof errorCallback == "function") {
                    errorCallback(jqXHR, textStatus);
                } else {
                }
            });
            timeOut = 0;
        },
    };
    SCFIT.Utils.Resources =
    {
        image404Error: function (image, remove) {

            if (remove) {
                $(image).parent().remove();
            } else {
                image.onerror = "";
                // image.src = SCFIT.Config.programThemePath + "images/carousel-image-default-ph.gif";
            }

            return true;
        },
        url404Checker: function (value, replacement, callback) {
            var http = jQuery.ajax({
                type: "HEAD",
                url: value,
                async: true,
                success: function () {
                    return callback(value, true, replacement);
                },
                error: function () {
                    //console.log(callback(value, false, replacement));
                    return callback(value, false, replacement);
                }
            });

        },
        imageNullChecker: function (value, replacement) {
            return SCFIT.Utils.Resources.url404Checker(value, replacement, SCFIT.Utils.Resources.imageReturnFunction);

        },
        imageReturnFunction: function (response, isSuccessful, replacement) {
            if (typeof value === "undefined" || !value || value == "" || value === "undefined" || isSuccessful == false) {
                return replacement;
            } else {
                return value;
            }
        },
        imageLocalToS3: function (value, replacement) {
            if (typeof value != "undefined" && value && value != "" && value != "undefined") {
                var s3Prefix = SCFIT.Config.s3Path + SCFIT.Config.env + "/";
                value = s3Prefix + value.toLowerCase();
                return value;
            }
        },
        nullCheck: function (value, replacement, s3) {
            if (typeof value != "undefined" && value && value != "" && value != "undefined") {
                if (s3) {
                    value = SCFIT.Utils.Resources.imageLocalToS3(value);
                }
                return value;
            } else {
                return replacement;
            }
        }

    };
    SCFIT.Utils.Arrays =
    {
        sortByKey: function(array, key) {
           var arr = array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
           });
           return arr.reverse();
        },
        removeFromArrayByValue: function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
            return arr;
        },
        removeRangeFromArray: function (array, from, to) {
            var rest = array.slice((to || from) + 1 || array.length);
            array.length = from < 0 ? array.length + from : from;
            return array.push.apply(array, rest);
        },
        assocArraySize: function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        findValueByKey: function (array, query) {
            var found = "", obj;
            query--;
            if (array.hasOwnProperty(query)) {
                obj = array[query];
                for (value in obj) {
                    found = obj[value];
                }

            } else {
                found = "";
            }
            return found;
        },

        findLikeSearchInArray: function (searchTerm, array) {
            
            SCFIT.Utils.Logging.WriteToConsole("INFO", arguments, "findLikeSearchInArray");
            SCFIT.Utils.Logging.WriteToConsole("INFO", arguments, "Search Term: " + searchTerm);

            var resultArray = $.map(array,
                            function (value) {

                                var objectStringNutixName = "",
                                    objectStringBrandName = "",
                                    searchString = "(" + searchTerm.toLowerCase() + ")",
                                    searchString = new RegExp(searchString, "gi"),
                                    result;
                                
                                if (typeof value.BrandName != "undefined" && value.BrandName != "") {
                                    objectStringBrandName = (value.BrandName).toLowerCase();
                                }

                                if (typeof value.NutixName != "undefined" && value.NutixName != "") {
                                    objectStringNutixName = (value.NutixName).toLowerCase();
                                } 
                                
                                SCFIT.Utils.Logging.WriteToConsole("INFO", arguments, "Nutix Name: " + objectStringNutixName + " Brand Name: " + objectStringBrandName + " | SearchTerm: " + searchTerm, true);

                                if (objectStringNutixName.match(searchString) || objectStringBrandName.match(searchString)) {
                                    result = value;
                                } else {
                                    result = null;
                                }
                                
                                return result;
                            }
                        );
            return resultArray;
        },
        array_flip: function(trans) {
            //  discuss at: http://phpjs.org/functions/array_flip/
            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: Pier Paolo Ramon (http://www.mastersoup.com/)
            // improved by: Brett Zamir (http://brett-zamir.me)
            //  depends on: array
            //        test: skip
            //   example 1: array_flip( {a: 1, b: 1, c: 2} );
            //   returns 1: {1: 'b', 2: 'c'}
            //   example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
            //   example 2: array_flip(array({a: 0}, {b: 1}, {c: 2}))[1];
            //   returns 2: 'b'

            var key, tmp_ar = {};

            // Duck-type check for our own array()-created PHPJS_Array
            if (trans && typeof trans === 'object' && trans.change_key_case) {
                return trans.flip();
            }

            for (key in trans) {
                if (!trans.hasOwnProperty(key)) {
                    continue;
                }
                tmp_ar[trans[key]] = key;
            }

            return tmp_ar;
            }
        };
    //  Need to break this out into cookie, history, and breadcrumb functions/modules.
    SCFIT.Utils.Cookies = {
        init: function () {
            var cookie = SCFIT.Utils.Cookies.checkCookie($.cookie("workoutHistory"));
            SCFIT.Utils.Cookies.updateCookie(cookie);
            SCFIT.Utils.Cookies.displayCookie($.cookie("workoutHistory"));
        },

        checkCookie: function (cookie) {
            if (typeof cookie === "undefined" || !cookie || cookie === "undefined") {
                $.cookie("workoutHistory", [""], { path: '/' });
                cookie = $.cookie("workoutHistory");
            }
            return cookie;
        },
        updateCookie: function (cookie) {
            var thisPage = document.location.pathname + window.location.search, history = new Array(cookie);
            if (history.length <= 5) {
                if ($.cookie("workoutHistory").indexOf(thisPage) === -1) {
                    var pageInfo = [$.trim($('title').html()) + "&&" + thisPage];
                    if (history.length > 0) {
                        history.push(pageInfo);
                    } else {
                        history = [pageInfo];
                    }
                    $.cookie("workoutHistory", history, { path: '/' });
                }

                var breadCrumbArray = cookie.split(","), lastPosition = breadCrumbArray.length - 1, lastPage = breadCrumbArray[lastPosition].split("&&"), lastPageURL = lastPage[1];

                if (typeof lastPageURL === "undefined" || !lastPageURL || lastPageURL == "" || lastPageURL === "undefined") {
                } else {

                    if ($.cookie("workoutHistory").indexOf(lastPageURL) > $.cookie("workoutHistory").indexOf(thisPage)) {
                        SCFIT.Utils.Arrays.removeRangeFromArray(breadCrumbArray, lastPosition, lastPosition);
                        $.cookie("workoutHistory", breadCrumbArray, { path: '/' });

                    }
                }
            } else {
                $.removeCookie('workoutHistory', { path: '/' });
                $.cookie("workoutHistory", [], { path: '/' });
            }
            breadCrumbArray = "";
            lastPosition = 0;
            lastPage = "";
            lastPageURL = "";
        },
        displayCookie: function (cookie) {
            if (typeof cookie === "undefined" || !cookie || cookie == "" || cookie === "undefined") {
            } else {
                var contents = cookie.split(","), i, breadCrumbHTML = "";
                breadCrumbHTML += ' <!-- Breadcrumbs -->' + '<ul id="breadcrumbs">';
                for (i = 0; i < contents.length; i++) {
                    if (i != 0) {
                        var pageInformation = contents[i].split("&&");
                        if ((i + 1) == contents.length) {
                            breadCrumbHTML += '<li><a class="active" ref="' + contents[i] + '" url="' + pageInformation[1] + '">' + pageInformation[0] + '</a></li>';
                        } else {
                            breadCrumbHTML += '<li><a class="link" ref="' + contents[i] + '" url="' + pageInformation[1] + '">' + pageInformation[0] + '</a><div class="arrow-right"></div></li>';
                        }
                    }
                }
                breadCrumbHTML += '</ul>';
                $("#breadcrumbs-container").html(breadCrumbHTML);
                $("#breadcrumbs-container li a").on("click", function () {
                    var breadCrumbArray = $.cookie("workoutHistory").split(",");
                    var targetLinkIndex = breadCrumbArray.indexOf($(this).attr("ref"));
                    SCFIT.Utils.Arrays.removeRangeFromArray(breadCrumbArray, targetLinkIndex, breadCrumbArray.length - 1);
                    $.cookie("workoutHistory", breadCrumbArray, { path: '/' });
                    window.location = $(this).attr("url");
                });
            }
        }
    };
    SCFIT.Utils.Colors = {
        rgb2hex: function (rgb) {
            if (rgb.search("rgb") == -1) {
                return rgb;
            } else {
                rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
        }
    };
    SCFIT.Utils.Logging = {
        // look at http://stacktracejs.com/
      GetCurrentMethodName:  function(object) {
          var functionData = object.callee.toString();
          var functionName = functionData.substr('function '.length);
          functionName += functionData.substr(0, functionData.indexOf('('));
          functionName = object.callee.name;
          return functionName;
      },
      WriteToConsole: function(type, methodArguments, content, disabled, dateTimeOffset) { 
          if (!disabled) {
              SCFIT.Data.Utils.Logging.WriteToConsoleCount++;
              if (SCFIT.Config.DebugLevel === "VERBOSE") {
                    try {
                        if (window.console != null) {

                            switch (type) {
                                case 'TRACEOBJECT':
                                    window.console.log(SCFIT.Data.Utils.Logging.WriteToConsoleCount + ") " + "TRACING OBJECT:-----------------------------------------------------");
                                    window.console.log(content);
                                    window.console.log("--------------------------------------------------------------------");
                                    break;
                                case 'INFO':
                                    window.console.log(SCFIT.Data.Utils.Logging.WriteToConsoleCount + ") " + type.toUpperCase() + ": " + "Function: " + SCFIT.Utils.Logging.GetCurrentMethodName(methodArguments) + " Message: " + content);
                                    break;
                                case 'MESSAGE':
                                    window.console.log(SCFIT.Data.Utils.Logging.WriteToConsoleCount + ") " + "["+"     " + type.toUpperCase() + ": " + " Message: " + content + " -----]");
                                    window.console.log();
                                    break;
                                case 'DEBUG':
                                    window.console.log(SCFIT.Data.Utils.Logging.WriteToConsoleCount + ") " + type.toUpperCase() + ": " + "Function: " + SCFIT.Utils.Logging.GetCurrentMethodName(methodArguments) + " Message: " + content);
                                    break;
                                case 'JSERROR':
                                    window.console.log(SCFIT.Data.Utils.Logging.WriteToConsoleCount + ") " + type.toUpperCase() + ": " + content.message + " Line Number: " + content.linenumber + " URL: " + content.url);
                                    break;
                                case 'ERROR':
                                    window.console.log(SCFIT.Data.Utils.Logging.WriteToConsoleCount + ") " + "ERROR:--------------------------------------------------------------");
                                    window.console.log("USER ID: " + SCFIT.Config.uid);
                                    window.console.log("Date and Time: " + dateTimeOffset);
                                    window.console.log("User Service AUTH Key: " + SCFIT.Config.authKey);
                                    window.console.log("Current Program Theme Path: " + SCFIT.Config.programThemePath);
                                    window.console.log(type.toUpperCase() + ": " + "Function: " + SCFIT.Utils.Logging.GetCurrentMethodName(methodArguments) + " Message: " + content);
                                    window.console.log("--------------------------------------------------------------------");
                                    break;
                            }

                        }
                    } catch(errr) {
                    }
              }
          }
        }
    };

})(window.SCFIT = window.SCFIT || {});
