var request = require( 'request'),
    Q = require( 'q'),
    HttpServiceError = require( '../errors/httpServiceError'),
    querystring = require( 'querystring' );

var SmartyStreets = function( authId, authToken ) {

    if ( !authId || !authToken ) {
        throw new Error( 'Smarty Streets Auth ID and Auth Token are required' );
    }

    var autocompleteHost = 'https://autocomplete-api.smartystreets.com';
    var apiHost = 'https://api.smartystreets.com';

    this.verifyAddress = function( street, city, state, ip ) {

        var deferred = Q.defer();

        var queryParameters = {
            "auth-id": authId,
            "auth-token": authToken,
            street: street,
            city: city,
            state: state
        };

        request( {
                uri: apiHost + '/street-address',
                qs: queryParameters,
                json: true,
                headers: {
                    "X-Forwarded-For": ip
                }
            },
            function ( error, response, body ) {
                if ( error ) {
                    return deferred.reject( error );
                }
                if ( response.statusCode >= 400 ) {
                    return deferred.reject( new HttpServiceError( response.statusCode, 'mapbox', body ) );
                }
                if ( !body ) {
                    return deferred.reject( new HttpServiceError( 500, 'mapbox', 'No response body received' ) );
                }

                deferred.resolve( body.map( function( currentAddress ) {
                    return {
                        href: "/addresses/" + querystring.escape( currentAddress.delivery_line_1 + " " + currentAddress.components.city_name + " " + currentAddress.components.state_abbreviation + " " + currentAddress.components.zipcode ),
                        //TODO: Address Line 2?
                        street: currentAddress.delivery_line_1,
                        city: currentAddress.components.city_name,
                        state: currentAddress.components.state_abbreviation,
                        zipCode: currentAddress.components.zipcode,
                        loc: {
                            latitude: currentAddress.metadata.latitude,
                            longitude: currentAddress.metadata.longitude
                        }
                    }
                } ) );
            } );

        return deferred.promise;

    };

    this.getAutocompleteSuggestions = function( prefix, ip, options ) {

        var deferred = Q.defer();

        var queryParameters = {
            "auth-id": authId,
            prefix: prefix,
            headers: {
                "X-Forwarded-For": ip
            }
        };

        if ( options.city ) {
            queryParameters[ 'city_filter' ] = options.city;
        }
        if ( options.state ) {
            queryParameters[ 'state_filter' ] = options.state;
        }

        request( {
                uri: autocompleteHost + '/suggest',
                qs: queryParameters,
                json: true
            },
            function ( error, response, body ) {
                if ( error ) {
                    return deferred.reject( error );
                }
                if ( response.statusCode >= 400 ) {
                    return deferred.reject( new HttpServiceError( response.statusCode, 'mapbox', body ) );
                }
                if ( !body ) {
                    return deferred.reject( new HttpServiceError( 500, 'mapbox', 'No response body received' ) );
                }
                if ( !body.suggestions ) {
                    return deferred.resolve( [] );
                }

                deferred.resolve( body.suggestions.map( function( currentSuggestion ) {
                    return {
                        href: '/addresses/?' + querystring.encode( {
                                street: currentSuggestion.street_line,
                                city: currentSuggestion.city,
                                state: currentSuggestion.state
                            } ),
                        street: currentSuggestion.street_line,
                        city: currentSuggestion.city,
                        state: currentSuggestion.state,
                        combined: currentSuggestion.street_line + ' ' + currentSuggestion.city + ', ' + currentSuggestion.state
                    };
                } ) );
            } );

        return deferred.promise;

    };

};

module.exports = SmartyStreets;
