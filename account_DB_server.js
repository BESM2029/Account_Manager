var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

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
var reset_account = null;
var reset_code = null;
var reset_code_success = 0;

app.post('/login_account', function (req, res) {
    console.log("req = "+JSON.stringify(req.body));
  let identity = (req.body.identity)?req.body.identity:'identity_error';
  let password = (req.body.password)?req.body.password:'password_error';
  let params = {msg: "", success: 0, session_account: session_account};
  let params_str = JSON.stringify(params)
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {ID: identity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      console.log(result);
      if (!result) {
        params.msg = identity+" doesn't exist.";
          params_str = JSON.stringify(params);
        console.log(params_str);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(params_str);
      }
      else {
        if (result.PW == password) {
          session_account.ID = result.ID;
          session_account.firstName = result.FirstName;
          session_account.lastName = result.LastName;
          session_account.index = result._id;
          params.success = 1;
          params.msg = identity + " login successfully.";
          params_str = JSON.stringify(params);
          console.log(params_str);
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
        else {
          params.msg = identity+"'s password is different.";
            params_str = JSON.stringify(params);
          console.log(params_str);
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
      }
    });
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
  let params = {msg: "", success: 0, session_account: session_account};
  let params_str = JSON.stringify(params)
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {ID: identity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) {
        throw err;
        params.msg = "Creating "+identity+" failed."; // throw err;
        let params_str = JSON.stringify(params)
        console.log(JSON.stringify(params.msg));
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(params_str);
      }
      if (!result) {
        if (password1 == password2) {
          dbo.collection("members").insertOne(personal, function(err, res) {
            if (err) throw err;
            params.msg = identity+" is created.";
            console.log(JSON.stringify(params.msg));
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(params_str);
          });
        }
        else {
          params.msg = "The two passwords are different.";
          console.log(JSON.stringify(params.msg));
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
      }
      else {
        params.msg = identity+" already exists.";
        console.log(JSON.stringify(params.msg));
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(params_str);
      }
      db.close();
    });
  });
});

app.post('/get_account_info', function (req, res) {
  let params = {msg: "", success: 1, session_account: session_account};
  let params_str = JSON.stringify(params);
  if (session_account && session_account.ID) {
    params.msg = 'account ID is '+session_account.ID;
    console.log(params_str);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(params_str);
  }
  else {
    params.msg = "Login account doesn't exist. Login first!";
    console.log(params_str);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(params_str);
  }
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

app.post('/send_reset_code', function (req, res) {
    console.log('req = '+JSON.stringify(req.body));
  let identity = (req.body.identity)?req.body.identity: 'identity_error';
  let msg = '';
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {ID: identity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        msg = identity+' does not exist.'; // throw err;
        console.log(msg);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(msg);
      }
      else {
        let rnd_str = "";
        reset_account = result.ID;
        for ( let ii = 0; ii<5; ii++ ){
          rnd_str += Math.floor(Math.random() * 10);
        }
        reset_code = rnd_str;
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
      db.close();
      }
    });
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
    reset_code_success = 0;
    params.msg = "Error. Reset code is incorrect."
    let params_str = JSON.stringify(params);
    console.log(params_str);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(params_str);
  }
});

app.post('/change_password', function (req, res) {
  console.log("req = "+JSON.stringify(req.body));
  let params = {msg: "", success: 0, session_account: session_account};
  if (reset_code_success == 0) {
    params.msg = 'You need to check the reset code first.'; // throw err;
    let params_str = JSON.stringify(params);
    console.log(params_str);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(params_str);
    return;
  }
  let password1 = (req.body.password1)?req.body.password1: 'password1_error';
  let password2 = (req.body.password2)?req.body.password2: 'password2_error';
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {ID: reset_account};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        msg = reset_account+' does not exist.'; // throw err;
        console.log(msg);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(msg);
      }
      else {
        if (password1 == password2) {
          let update = { $set: { PW: password1 } };
          dbo.collection("members").updateOne(query, update, function(err, res) {
            if (err) throw err;
          console.log("1 document updated");
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
      db.close();
    });
  });
});

app.post('/change_account_info', function (req, res) {
  console.log("req = "+JSON.stringify(req.body));
  let password1 = (req.body.password1)?req.body.password1: 'password1_error';
  let password2 = (req.body.password2)?req.body.password2: 'password2_error';
  let firstName = (req.body.firstName)?req.body.firstName: 'firstName_error';
  let lastName = (req.body.lastName)?req.body.lastName: 'lastName_error';
  let params = {msg: "", success: 0, session_account: session_account};
  let params_str = JSON.stringify(params)
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) {
      throw err;
      params.msg = "Password changing failed."; // throw err;
    }
    let dbo = db.db("account_server_db");
    if (password1 == password2) {
      let query = {ID: session_account.ID};
      let update = { $set: { PW: password1, FirstName: firstName, LastName: lastName } };
      dbo.collection("members").updateOne(query, update, function(err, res) {
        if (err) {
          throw err;
          params.msg = "Password changing failed."; // throw err;
          console.log(JSON.stringify(params.msg));
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
        else {
          params.msg = "Password is changed Successfully";
          console.log(JSON.stringify(params.msg));
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
      });
    }
    else {
      params.msg = "The two passwords are different.";
      console.log(JSON.stringify(params.msg));
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(params_str);
    }
    db.close();
  });
});

app.use('/', express.static(__dirname)); //  + '/public'));

var server = app.listen(8103, '127.0.0.1', function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port);
});