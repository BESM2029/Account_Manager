var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser());

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "copper.iron.29@gmail.com",
    pass: "JungJun_0829"
  }
});

var sessionAccount = {identity:null, firstName:null, lastName:null, index:null};
var resetIdentity = null;
var resetCode = null;
var resetSuccess = 0;

app.post("/login_account", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let identity = (req.body.identity)?req.body.identity:"identity error";
  let password = (req.body.password)?req.body.password:"password error";
  let params = {msg:"", success:0};
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {identity:identity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        params.msg = identity+" doesn't exist.";
        db.close();
        params_str = JSON.stringify(params);
        console.log("server res = "+params_str);
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.end(params_str);
      }
      else {
        if (result.password == password) {
          sessionAccount.identity = result.identity;
          sessionAccount.firstName = result.firstName;
          sessionAccount.lastName = result.lastName;
          sessionAccount.index = result._id;
          params.success = 1;
          params.msg = identity+" login successfully..";
          db.close();
          params_str = JSON.stringify(params);
          console.log("server res = "+params_str);
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
        else {
          params.msg = identity+"'s password is different.";
          db.close();
          params_str = JSON.stringify(params);
          console.log("server res = "+params_str);
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(params_str);
        }
      }
    });
  });
});

app.post("/create_account", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let identity = (req.body.identity)?req.body.identity:"identity error";
  let password1 = (req.body.password1)?req.body.password1:"password1 error";
  let password2 = (req.body.password2)?req.body.password2:"password2 error";
  let firstName = (req.body.firstName)?req.body.firstName:"firstName error";
  let lastName = (req.body.lastName)?req.body.lastName:"lastName error";
  let personal = {identity:identity, password:password1, firstName:firstName, lastName:lastName};
  let params = {msg:"", success:0};
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {identity:identity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        if (password1 == password2) {
          dbo.collection("members").insertOne(personal, function(err, info) {
            if (err) throw err;
            params.msg = identity+" is created successfully.";
            db.close();
            params_str = JSON.stringify(params);
            console.log("server res = "+params_str);
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end(params_str);
          });
        }
        else {
          params.msg = "The two passwords are different.";
          db.close();
          params_str = JSON.stringify(params);
          console.log("server res = "+params_str);
          res.writeHead(200, {"Content-Type":"text/plain"});
          res.end(params_str);
        }
      }
      else {
        params.msg = identity+" already exists.";
        db.close();
        params_str = JSON.stringify(params);
        console.log("server res = "+params_str);
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.end(params_str);
      }
    });
  });
});

app.post("/get_account_info", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let params = {msg:"", sessionAccount:sessionAccount};
  let params_str = "";
  if (sessionAccount.identity) {
    params.msg = 'account ID is '+sessionAccount.identity;
    params_str = JSON.stringify(params);
    console.log("server res = "+params_str);
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end(params_str);
  }
  else {
    params.msg = "Login account doesn't exist. Login first!";
    params_str = JSON.stringify(params);
    console.log("server res = "+params_str);
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end(params_str);
  }
});

app.post("/logout_account", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let params = {msg:""};
  let params_str = "";
  sessionAccount.identity = null;
  sessionAccount.firstName = null;
  sessionAccount.lastName = null;
  sessionAccount.index = null;
  params.msg = "logout successfully.";
  params_str = JSON.stringify(params);
  console.log("server res = "+params_str);
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.end(params_str);
});

app.post("/send_reset_code", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let identity = (req.body.identity)?req.body.identity:"identity error";
  let params = {msg:""};
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {identity: identity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        params.msg = identity+" does not exist.";
        db.close();
        params_str = JSON.stringify(params);
        console.log("server res = "+params_str);
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.end(params_str);
      }
      else {
        resetIdentity = identity;
        let rndNum = "";
        for (let ii = 0; ii<5; ii++) {
          rndNum += Math.floor(Math.random() * 10);
        }
        resetCode = rndNum;
        let mailOptions = {
          from: "copper.iron.29@gmail.com",
          to: identity,
          subject: "subject.",
          text: "text '"+rndNum+"'."
        };
        db.close();
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            params.msg = "Sending reset code to "+identity+" FAILED.";
            params_str = JSON.stringify(params);
            console.log("server res = "+params_str);
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end(params_str);
          }
          else {
            console.log("Email sent: "+info.response);
            params.msg = "Reset code has been sent to "+identity+". Please check it out.";
            params_str = JSON.stringify(params);
            console.log("server res = "+params_str);
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end(params_str);
          }
        });
      }
    });
  });
});

app.post("/check_reset_code", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let code = (req.body.code)?req.body.code:"code error";
  let params = {msg:"", success:0};
  let params_str = "";
  if (code == resetCode) {
    resetCode = null;
    resetSuccess = 1;
    params.msg = "Reset code is correct."
    params.success = 1;
    params_str = JSON.stringify(params);
    console.log("server res = "+params_str);
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end(params_str);
  }
  else {
    params.msg = "Reset code is incorrect."
    params_str = JSON.stringify(params);
    console.log("server res = "+params_str);
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end(params_str);
  }
});

app.post("/change_password", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  if (resetSuccess == 0) {
    params.msg = 'You need to check the reset code first.';
    params_str = JSON.stringify(params);
    console.log("server res = "+params_str);
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end(params_str);
    return;
  }
  let password1 = (req.body.password1)?req.body.password1:"password1 error";
  let password2 = (req.body.password2)?req.body.password2:"password2 error";
  let params = {msg:""};
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    let dbo = db.db("account_server_db");
    let query = {identity: resetIdentity};
    dbo.collection("members").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        params.msg = resetIdentity+" does not exist.";
        db.close();
        params_str = JSON.stringify(params);
        console.log("server res = "+params_str);
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.end(params_str);
      }
      else {
        if (password1 == password2) {
          let update = {$set:{password:password1}};
          dbo.collection("members").updateOne(query, update, function(err, res) {
            if (err) throw err;
          resetSuccess = 0;
          params.msg = "Password is changed Successfully";
          db.close();
          params_str = JSON.stringify(params);
          console.log("server res = "+params_str);
          res.writeHead(200, {"Content-Type":"text/plain"});
          res.end(params_str);
          });
        }
        else {
          params.msg = "The two passwords are different.";
          db.close();
          params_str = JSON.stringify(params);
          console.log("server res = "+params_str);
          res.writeHead(200, {"Content-Type":"text/plain"});
          res.end(params_str);
        }
      }
    });
  });
});

app.post("/change_account_info", function (req, res) {
  console.log("server req = "+JSON.stringify(req.body));
  let password1 = (req.body.password1)?req.body.password1:"password1 error";
  let password2 = (req.body.password2)?req.body.password2:"password2 error";
  let firstName = (req.body.firstName)?req.body.firstName:"firstName error";
  let lastName = (req.body.lastName)?req.body.lastName:"lastName error";
  let params = {msg:""};
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err)  throw err;
    let dbo = db.db("account_server_db");
    if (password1 == password2) {
      let query = {identity: sessionAccount.identity};
      let update = {$set:{password:password1, firstName:firstName, lastName:lastName}};
      dbo.collection("members").updateOne(query, update, function(err, info) {
        if (err) throw err;
        params.msg = "Informaion is changed successfully";
        db.close();
        params_str = JSON.stringify(params);
        console.log("server res = "+params_str);
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.end(params_str);
      });
    }
    else {
      params.msg = "The two passwords are different.";
      db.close();
      params_str = JSON.stringify(params);
      console.log("server res = "+params_str);
      res.writeHead(200, {"Content-Type":"text/plain"});
      res.end(params_str);
    }
  });
});

app.use("/", express.static(__dirname)); //  + '/public'));

var server = app.listen(8103, "127.0.0.1", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});