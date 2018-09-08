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

var session_account = {ID: null, firstName: null, lastName: null, index: null};

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
	let params = {msg: "", success: 0, session_account: session_account};
	fs.readFile('data.txt', 'utf8', function(err, data) {
		let data_arr = JSON.parse(data);
		let account_index = find_index(data_arr, identity);
		if (account_index < 0) {
			params.msg = identity+" doesn't exist.";
		}
		else {
			let account_info = data_arr[account_index];
			if (account_info.PW == password) {
				session_account.ID = account_info.ID;
				session_account.firstName = account_info.FirstName;
				session_account.lastName = account_info.LastName;
				session_account.index = account_index;
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
	let personal = {ID: identity, PW: password1, FirstName: firstName, LastName: lastName};
	let params = {msg: "", success: 0, session_account: session_account};
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
	let params = {msg: "", success: 1, session_account: session_account};
	if (session_account && session_account.ID) {
		params.msg = 'account ID is '+session_account.ID;
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
	//session_account.account = null;
	session_account.ID = null;
	session_account.firstName = null;
	session_account.lastName = null;
	session_account.index = null;
	console.log(msg);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(msg);
});

app.post('/reset_password', function (req, res) {
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
			for ( let ii = 0; ii<5; ii++ ){
				rnd_str += Math.floor(Math.random() * 10);
			}
			account.PW = rnd_str;
			var data_str = JSON.stringify(data_arr);
			console.log('stack = '+data_str);
			fs.writeFile('Data.txt', data_str, function (err) {
				if (err) {
					msg = 'Changing password failed.'; // throw err;
					console.log(msg);
					res.writeHead(200, {'Content-Type': 'text/plain'});
					res.end(msg);
				}
				else {
					var mailOptions = {
						from: 'testless08@gmail.com',
						to: identity,
						subject: "Resetting password for HWANG'S has been completed.",
						text: "Resetting password for HWANG'S has been completed.\nNew password is '"+rnd_str+"'."
					};
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
							msg = 'Sending new password to '+identity+" FAILED. Please check "+identity+" is valid.";
							console.log(msg);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(msg);
						} else {
							console.log('Email sent: ' + info.response);
							msg = 'New password has been sent to '+identity+". Please check it out.";
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

app.post('/change_account_info', function (req, res) {
    console.log("req = "+JSON.stringify(req.body));
	let password1 = (req.body.password1)?req.body.password1: 'password1_error';
	let password2 = (req.body.password2)?req.body.password2: 'password2_error';
	let firstName = (req.body.firstName)?req.body.firstName: 'firstName_error';
	let lastName = (req.body.lastName)?req.body.lastName: 'lastName_error';
	let params = {msg: "", success: 0, session_account: session_account};
	fs.readFile('Data.txt', 'utf8', function(err, data) {
		if (password1 == password2) {
			let data_arr = JSON.parse(data);
			let this_account = data_arr[session_account.index]
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