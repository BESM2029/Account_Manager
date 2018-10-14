var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'copper.iron.29@gmail.com',
		pass: 'JungJun_0829'
	}
});

var sessionAccount = {ID: null, firstName: null, lastName: null, index: null};
var reset_account = null;
var reset_code = null;
var reset_code_success = 0;

function find_index(data_arr, identity){
	let found_index = -1;
	for (let ii in data_arr) {
		let account_info = data_arr[ii];
		if (account_info.ID == identity) {
			found_index = ii;
			break;
		}
	}
	return found_index;
}

app.post('/login_account', function (req, res) {
    console.log("req = "+JSON.stringify(req.body));
	let identity = (req.body.identity)?req.body.identity:'identity_error';
	let password = (req.body.password)?req.body.password:'password_error';
	let params = {msg: "", success: 0, sessionAccount: sessionAccount};
	fs.readFile('data.txt', 'utf8', function(err, data) {
		let data_arr = JSON.parse(data);
		let account_index = find_index(data_arr, identity);
		if (account_index < 0) {
			params.msg = identity+" doesn't exist.";
		}
		else {
			let account_info = data_arr[account_index];
			if (account_info.PW == password) {
				sessionAccount.ID = account_info.ID;
				sessionAccount.firstName = account_info.FirstName;
				sessionAccount.lastName = account_info.LastName;
				sessionAccount.index = account_index;
				params.success = 1;
				params.msg = identity + " login successfully.";
			}
			else {
				params.msg = identity+"'s password is different.";
			}
		}
		let params_str = JSON.stringify(params)
		console.log(JSON.stringify(params.msg));
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(params_str);
	});
});

app.post('/create_account', function (req, res) {
    console.log("req = "+JSON.stringify(req.body));
	let identity = (req.body.identity)?req.body.identity: 'identity_error';
	let password1 = (req.body.password1)?req.body.password1: 'password1_error';
	let password2 = (req.body.password2)?req.body.password2: 'password2_error';
	let firstName = (req.body.firstName)?req.body.firstName: 'firstName_error';
	let lastName = (req.body.lastName)?req.body.lastName: 'lastName_error';
	//let recoveryEmail = (req.body.recoveryEmail)?req.body.recoveryEmail: 'lastName_error';
	let personal = {ID: identity, PW: password1, FirstName: firstName, LastName: lastName/*, recoveryEmail: recoveryEmail*/};
	let params = {msg: "", success: 0, sessionAccount: sessionAccount};
	fs.readFile('data.txt', 'utf8', function(err, data) {
		let data_arr = JSON.parse(data);
		let account_index = find_index(data_arr, identity);
		if (account_index < 0) { // account doesn't exist
			if (password1 == password2) {
				data_arr.push(personal);
				var data_str = JSON.stringify(data_arr);
				console.log("stack = "+data_str);
				fs.writeFile('Data.txt', data_str, function (err) {
					if (err) {
						params.msg = "Creating "+identity+" failed."; // throw err;
						let params_str = JSON.stringify(params)
						console.log(JSON.stringify(params.msg));
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end(params_str);
					}
					else {
						params.msg = identity+" is created.";
						let params_str = JSON.stringify(params)
						console.log(JSON.stringify(params.msg));
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end(params_str);
					}
				});
			}
			else {
				params.msg = "The two passwords are different.";
				let params_str = JSON.stringify(params)
				console.log(JSON.stringify(params.msg));
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(params_str);
			}
		}
		else { // account exists
			params.msg = identity+" already exists.";
			let params_str = JSON.stringify(params)
			console.log(JSON.stringify(params.msg));
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(params_str);
		}
	});
});

app.post('/get_account_info', function (req, res) {
	let params = {msg: "", success: 1, sessionAccount: sessionAccount};
	if (sessionAccount && sessionAccount.ID) {
		params.msg = 'account ID is '+sessionAccount.ID;
	}
	else {
		params.msg = "Login account doesn't exist. Login first!";
	}
	let params_str = JSON.stringify(params);
	console.log(params_str);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(params_str);
});

app.post('/logout_account', function (req, res) {
	let msg = 'logout successfully.';
	//sessionAccount.account = null;
	sessionAccount.ID = null;
	sessionAccount.firstName = null;
	sessionAccount.lastName = null;
	sessionAccount.index = null;
	console.log(msg);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(msg);
});

app.post('/send_reset_code', function (req, res) {
    console.log('req = '+JSON.stringify(req.body));
	let identity = (req.body.identity)?req.body.identity: 'identity_error';
	let msg = '';
	fs.readFile('Data.txt', 'utf8', function(err, data) {
		let data_arr = JSON.parse(data);
		let account_index = find_index(data_arr, identity);
		if (account_index < 0) { // account doesn't exist
			msg = identity+' does not exist.'; // throw err;
			console.log(msg);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(msg);
		}
		else { // account exists
			let account = data_arr[account_index];
			let rnd_str = "";
			reset_account = account.ID;
			for ( let ii = 0; ii<5; ii++ ){
				rnd_str += Math.floor(Math.random() * 10);
			}
			reset_code = rnd_str;
			var data_str = JSON.stringify(data_arr);
			console.log('stack = '+data_str);
			fs.writeFile('Data.txt', data_str, function (err) {
				if (err) {
					msg = 'Send reset code failed.'; // throw err;
					console.log(msg);
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end(msg);
				}
				else {
					var mailOptions = {
						from: 'copper.iron.29@gmail.com',
						to: identity,
						subject: "어버버버버버버.",
						text: "에베베베베베베베 '"+rnd_str+"'."
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
							msg = 'Sending reset code to '+identity+" FAILED. Please check "+identity+" is valid.";
							console.log(msg);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(msg);
						}
						else {
							console.log('Email sent: ' + info.response);
							msg = 'Reset code has been sent to '+identity+". Please check it out.";
							console.log(msg);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(msg);
						}
					});
				}
			});
		}
	});
});

app.post('/check_reset_code', function (req, res) {
    console.log('req = '+JSON.stringify(req.body));
	let type_code = (req.body.code)?req.body.code: 'code_error';
	let params = {msg: "", success: 0};
	if (type_code == reset_code) {
		reset_code_success = 1;
		params.success = 1;
		params.msg = "Reset code is correct."
		let params_str = JSON.stringify(params);
		console.log(params_str);
		reset_code = null;
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(params_str);
	}
	else {
		params.msg = "Error. Reset code is incorrect."
		let params_str = JSON.stringify(params);
		console.log(params_str);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(params_str);
	}
});

app.post('/change_password', function (req, res) {
  console.log("req = "+JSON.stringify(req.body));
	let password1 = (req.body.password1)?req.body.password1: 'password1_error';
	let password2 = (req.body.password2)?req.body.password2: 'password2_error';
	let params = {msg: "", success: 0, sessionAccount: sessionAccount};
	fs.readFile('Data.txt', 'utf8', function(err, data) {
		let data_arr = JSON.parse(data);
		let account_index = find_index(data_arr, reset_account);
		if (account_index < 0 && reset_code_success != 1) { // account doesn't exist
			params.msg = reset_account+' does not exist.'; // throw err;
			let params_str = JSON.stringify(params);
			console.log(params_str);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(params_str);
		}
		else {
			let this_account = data_arr[account_index]
			if (password1 == password2) {
				this_account.PW = password1;
				var data_str = JSON.stringify(data_arr);
				fs.writeFile('Data.txt', data_str, function (err) {
					if (err) {
						params.msg = "Password changing failed."; // throw err;
						let params_str = JSON.stringify(params);
						console.log(params_str);
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end(params_str);
					}
					else {
						params.msg = "Password is changed Successfully";
						let params_str = JSON.stringify(params);
						console.log(params_str);
						reset_account = null;
						res.writeHead(200, {'Content-Type': 'text/plain'});
						res.end(params_str);
					}
				});
			}
			else {
				params.msg = "The two passwords are different.";
				let params_str = JSON.stringify(params);
				console.log(params_str);
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(params_str);
			}
		}
	});
});

app.post('/change_account_info', function (req, res) {
    console.log("req = "+JSON.stringify(req.body));
	let password1 = (req.body.password1)?req.body.password1: 'password1_error';
	let password2 = (req.body.password2)?req.body.password2: 'password2_error';
	let firstName = (req.body.firstName)?req.body.firstName: 'firstName_error';
	let lastName = (req.body.lastName)?req.body.lastName: 'lastName_error';
	let params = {msg: "", success: 0, sessionAccount: sessionAccount};
	fs.readFile('Data.txt', 'utf8', function(err, data) {
		if (password1 == password2) {
			let data_arr = JSON.parse(data);
			let this_account = data_arr[sessionAccount.index]
			this_account.PW = password1;
			this_account.FirstName = firstName;
			this_account.LastName = lastName;
			var data_str = JSON.stringify(data_arr);
			fs.writeFile('Data.txt', data_str, function (err) {
				if (err) {
					params.msg = "Password changing failed."; // throw err;
					let params_str = JSON.stringify(params);
					console.log(params_str);
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end(params_str);
				}
				else {
					params.msg = "Password is changed Successfully";
					let params_str = JSON.stringify(params);
					console.log(params_str);
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end(params_str);

				}
			});
		}
		else {
			params.msg = "The two passwords are different.";
			let params_str = JSON.stringify(params);
			console.log(params_str);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(params_str);
		}
	});
});

app.use('/', express.static(__dirname)); //  + '/public'));

var server = app.listen(8103, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port);
});