/*jslint node: true */
"use strict";
/*

	Project:  SalesFusion Coding Exercise
	Developer:  Randall Potter
	Date:  03/31/2016
	Architecture:  NodeJS running NPM modules and base JavaScript.
	Note:  Global JS NameSpace is not polluted as NodeJS autowraps variables within their context.

	Reasoning:
	JavaScript has fast object and string manipulation capabilities particularly with comma separated strings.
	This app can also be minimized and cached on the server and does not require the overhead runtime of a compiled application.

	Assumptions:
	JavaScript is not a strict-typed language so the data needs to be in the best shape possible.
	
	Other languages that would be good for this exercise:
	Google's "Go" as it is statically typed.
	Python for it's speed and low overhead.
	PowerShell could also be used, but then again it is accessing the .NET runtime on the machine.

	Unit Tests:
	test/scoringengine.js
	to run:  npm test
*/


var mime = require('mime');
var scoringengine = require('commander');
var fs = require('fs');
var fileName = "";

scoringengine
  	// setup command line interface, arguments, etc.
    .command('exec <cmd>')
    .alias('ex')  .description('execute the given remote cmd')
    // command parameter and arguments
    .option("-f, --file <file>", "Which file to use")
    .action(function(cmd, options){
    	var file = options.file;
	    switch (cmd) {
		  case "digestCSV":
		  	fileName = file;
	 		digestCSV(fileName);	    
	 		break;
		  default:
		    console.log("No recognized command specified.");
		}
  	}
  );

scoringengine.parse(process.argv);

function doesFileExist(file) {
	var status = false;
  	try
    {
        status = fs.statSync(file).isFile();
    }
    catch (err)
    {
        status = false;
    }
    return status;
}

function inputFileIsCSV(file) {
	var type = mime.lookup(file),
		status = false;
	if(type === "text/csv") {
		status = true;
	}
	return status;
}	

// Export functions for unit tests
module.exports.inputFileIsCSV = inputFileIsCSV;
module.exports.doesFileExist = doesFileExist;


var finalResult = {};
// Main part of App.
function digestCSV(file) {

	if (doesFileExist(file) === true && inputFileIsCSV(file) === true) {

		console.log("digestCSV: file: " + file);
		/* 
		Instantiate csv converter class and make sure values have trimmed whitespace(trim), open up the second
		processor core if it's available(workerNum).  Flatten keys(flatKeys) as much as possible during converstion and make sure
		types are as safe as they can(checkType).
		*/
		var Converter = require("csvtojson").Converter,
			converter = new Converter({
			trim: true,
			workerNum: 2,
			flatKeys: true,
			checkType: true
		});

		require("fs").createReadStream(file).pipe(converter);

		//end_parsed will be emitted once parsing finished and we're ready to use our data
		converter.on("end_parsed", function (jsonArray) {
		    console.log("end parse");

			function reduceAndSum(array) {
				var result = [],
				totalScore,
			    multiplier = 1;

			    // begin group by contact id and subsequent score summation.
				array.reduce(function (res, value) {

				    if (!res[value["contact id"]]) {
				        res[value["contact id"]] = {
				            score: 0,
				            "contact id": value["contact id"],
				            quartile: ""
				        };
				        result.push(res[value["contact id"]]);
				    }

				    // Define non-normalized score multiplier based on event type
				   	// if statements are faster than switch in this context
				   	var eventType = value.event;
				   	if(eventType == "web") {
						multiplier = 1.0;
				   	}
				   	if(eventType == "email") {
						multiplier = 1.2;
				   	}
				   	if(eventType == "social") {
						multiplier = 1.5;
				   	}
				   	if(eventType == "webinar") {
						multiplier = 2.0;
				   	} else {
						multiplier = 1.0;
				   	}

				    parseFloat(res[value["contact id"]].score += (value.score * multiplier),10).toFixed(2);

				    totalScore = res[value["contact id"]].score;

					res[value["contact id"]].quartile = quartileValue;
				    finalResult = res;
				    return res;
				}, {});
			}

			// Group jsonArray by contact id and sum score values per contact id
			reduceAndSum(jsonArray);
			
			// Normalize final per contact id scores to 100.
			var normalizeThis = [], ratio;
			for(var k in finalResult) {
			    normalizeThis.push(finalResult[k].score);
				ratio = Math.max.apply(this, normalizeThis) / 100;
			}

			// Populate quartile key/value based on final normalized scores.
			for(var k in finalResult) {
			    finalResult[k].score = Math.round( finalResult[k].score / ratio );
			    var quartileValue = "unassigned", normalizedScore = finalResult[k].score;	
			    	// if statements are also faster than switch in this context
					if(normalizedScore >= 75 && normalizedScore <= 100) {
						quartileValue = "Platinum";
					}
					if(normalizedScore>= 50 && normalizedScore <= 74) {
						quartileValue = "Gold";
					}
					if(normalizedScore >= 25 && normalizedScore <= 49) {
						quartileValue = "Silver";
					}
					if(normalizedScore < 25) {
						quartileValue = "Bronze";
					}
					finalResult[k].quartile = quartileValue;
			}

			// Write result out to console.
			console.log(finalResult);
			return finalResult;
		});
	} else {
		throw new Error("Problem with file: " + file)
	}
}