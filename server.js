var express = require('express');
var qr = require('qr-image');
var fs = require('fs');
var moment = require('moment');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var SUCCESS = 'success';
var FAILURE = 'failure';

app.get("/generateQR", function(req, res){
	let QRCodeDir = __dirname + '/QRCodes';
	
	if (!fs.existsSync(QRCodeDir)) {
		fs.mkdirSync(QRCodeDir);
	}

	var encodedText = fs.readFileSync('encodeTpxid.txt', 'utf-8');
	var encodedTpxIDs = encodedText.split("\n");

	for(var i=0;i<encodedTpxIDs.length;i++){
		//console.log(encodedTpxIDs[i]);
		var values = encodedTpxIDs[i].split(" ");
		var key = values[0];
		var value = values[1];
		var imageName = './QRCodes/'+key+'.png';
		var qr_image = qr.image(value, { type: 'png', ec_level: 'H', size: 10});
		qr_image.pipe(fs.createWriteStream(imageName));
	}
	res.status(200).json({"status":SUCCESS, "value":encodedTpxIDs});
	// var qr_svg = qr.image('I love QR!', { type: 'png' });
	// qr_svg.pipe(require('fs').createWriteStream('./QRCodes/i_love_qr.png'));
	// var svg_string = qr.imageSync('I love QR!', { type: 'png' });
});

// app.get("/encodeTpxid", function(req, res){
// 	var fileName = 'encodeTpxid.txt';
// 	for(var i=0;i<100;i++){
// 		fs.appendFileSync(fileName, i+"\n", 'utf8');
// 	}
// 	res.send("DONE");
// });

app.post("/register", function(req, res){
	if(!(req.body && req.body.tpxID)){
		//console.log("ERROR CONDITION");
		res.status(400).json({"status":FAILURE, "message":"Value missing"});
	} else {
		//console.log(req.body.tpxID);
		var timestamp = moment().format('HH:mm:ss');
		var outputText = req.body.tpxID + ',' + timestamp + '\n';
		fs.appendFileSync('output.csv', outputText, 'utf8');
		res.status(200).json({"status":SUCCESS, "message":"Registration successful"});
	}
});

app.listen(8020);