var expect = require("chai").expect;
var ScoreEngine = require("../scoringengine.js");

describe("Scoring Engine:", function() {

	describe("File Status: ", function() {
		it("Checks to make sure the file EXISTS", function() {

			var fileDoesExist = ScoreEngine.doesFileExist("event-log-03312016.csv");
			expect(fileDoesExist).to.equal(true);

		});
		it("Checks what happens if file DOES NOT EXIST.", function() {
			var fileDoesExist = ScoreEngine.doesFileExist("event-log-04012016.xls");
			expect(fileDoesExist).to.equal(false);
		});
	});
		


	describe("File MIME Type: ", function() {
		it("Checks to make sure the file IS A CSV file", function() {

			var fileTypeIsCSV = ScoreEngine.inputFileIsCSV("event-log-03312016.csv");
			expect(fileTypeIsCSV).to.equal(true);

		});
		it("Checks what happens if file IS NOT a CSV file", function() {
			var fileTypeIsCSV = ScoreEngine.inputFileIsCSV("event-log-03312016.xls");
			expect(fileTypeIsCSV).to.equal(false);
		});
	});

})