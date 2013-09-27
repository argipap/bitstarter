#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');//commander des arguments
var cheerio = require('cheerio');//implementaion of jquery..loads html
var HTMLFILE_DEFAULT = "index.html";//default html file
var CHECKSFILE_DEFAULT = "checks.json";//default file gia ta checks
var URLFILE_DEFAULT = "http://fathomless-crag-6852.herokuapp.com/";//default url -- dokimi
var rest = require('restler');//dokimi

var assertFileExists = function(infile) {//pairnei ws orisma ena arxeio kai elegxei an auto to arxeio yparxei
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;//epistrefei to onoma tou arxeioy an yparxei
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));//epistrefei ta periexomena toy htmlfile kai ta kanei load sto cheriohtmlfile
};

var loadChecks = function(checksfile) {//epistrefei ta periexomena toy checks.json kai ta kanei parse
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);//kanei load to html file apo thn sunartisi cheerioHtmlFile
    var checks = loadChecks(checksfile).sort();//taksinomei ta stoixeia
    var out = {};//kenos pinakas
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;//an to ii tou pinaka checks exei lenght>0
	out[checks[ii]] = present;//to vazi ston pinaka out
    }
    return out;//episrtefei enan pinaka out me ola ta stoixeria apo to parsing
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {//testaroume an to arxeio trexei apeutheias apo to node diladi testaroume an o xristis pliktrologei node grader.js
    program//commander
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url_file>' , 'Path to index.html via url' , clone(assertFileExists), URLFILE_DEFAULT)
	.parse(process.argv);
    var checkJson=null;
/*    if (program.url !== null){
	fs2 = require('fs');
	fs2.writeFile('urlfile',rest.get(program.url),function (err) {
	if (err) return console.log(err);
	console.log('Something went wrong...');
	});
	checkJson = checkHtmlFile('urlfile', program.checks);
    }*/
    checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}