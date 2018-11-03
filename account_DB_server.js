var path = require("path");
var MG = require(path.resolve(__dirname, "./MongoGraph.js"));

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser());

const fs = require("fs");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "copper.iron.29@gmail.com",
    pass: "JungJun_0829"
  }
});

var dbName = "account_server_db";
var collectionName = "members";

var sessionAccount = { identity: null, firstName: null, lastName: null };
var resetIdentity = null;
var resetCode = null;
var resetCodeCheck = 0;

app.post("/login_account", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    console.log("server req = " + JSON.stringify(req.body));
    let identity = (req.body.identity)? req.body.identity : null;
    let password = (req.body.password)? req.body.password : null;
    if (!identity || !password) {
      params.msg = "Fill up the blanks."
      return;
    }
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    let gdb = new MG.Graph(client, { print_out: true });
    let query = { identity: identity };
    let results = await gdb.get(dbName, collectionName, query);
    client.close();
    console.log("results = " + results);
    if (results.length == 0) {
      params.msg = identity + " doesn't exist.";
    }
    else {
      let result = results[0];
      if (result.password == password) {
        sessionAccount.identity = result.identity;
        sessionAccount.firstName = result.firstName;
        sessionAccount.lastName = result.lastName;
        params.success = 1;
        params.msg = identity + " login successfully.";
      }
      else {
        params.msg = identity + "'s password is different.";
      }
    }
  }
  catch (err) {
    console.log(err.message);
  }
  finally {
    params_str = JSON.stringify(params);
    console.log("server res = " + params_str);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(params_str);
  }
});

app.post("/create_account", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    console.log("server req = " + JSON.stringify(req.body));
    let identity = (req.body.identity)? req.body.identity : null;
    let password1 = (req.body.password1)? req.body.password1 : null;
    let password2 = (req.body.password2)? req.body.password2 : null;
    let firstName = (req.body.firstName)? req.body.firstName : null;
    let lastName = (req.body.lastName)? req.body.lastName : null;
    if (!identity || !password1 || !password2 || !firstName || !lastName) {
      params.msg = "Fill up the blanks."
      return;
    }
    let personal = { identity: identity, password: password1, firstName: firstName, lastName: lastName };
    let client = await MongoClient.connect(url, { useNewUrlParser: true })
    let gdb = new MG.Graph(client, { print_out: true });
    let query = { identity: identity };
    let results = await gdb.get(dbName, collectionName, query);
    if (results.length == 0) {
      if (password1 == password2) {
        let info = await gdb.insert(dbName, collectionName, personal);
        params.msg = identity+" is created successfully.";
      }
      else {
        params.msg = "The two passwords are different.";
      }
    }
    else {
      params.msg = identity+" already exists.";
    }
    client.close();
  }
  catch (err) {
    console.log(err.message);
  }
  finally {
    params_str = JSON.stringify(params);
    console.log("server res = " + params_str);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(params_str);
  }
});

app.post("/get_account_info", (req, res) => {
  let params = { msg: "", sessionAccount: sessionAccount };
  let params_str = "";
  console.log("server req = " + JSON.stringify(req.body));
  if (sessionAccount.identity) {
    params.msg = "Displayed.";
  }
  else {
    params.msg = "Login account doesn't exist. Login first!";
  }
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.post("/logout_account", (req, res) => {
  let params = { msg: "" };
  let params_str = "";
  console.log("server req = " + JSON.stringify(req.body));
  sessionAccount.identity = null;
  sessionAccount.firstName = null;
  sessionAccount.lastName = null;
  params.msg = "logout successfully.";
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.post("/send_reset_code", async(req, res) => {
  let params = { msg: "" };
  let params_str = "";
  try {
    console.log("server req = " + JSON.stringify(req.body));
    let identity = (req.body.identity)? req.body.identity : null;
    if (!identity) {
      params.msg = "Fill up the blanks."
      return;
    }
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    let gdb = new MG.Graph(client, { print_out: true });
    let query = { identity: identity };
    let results = await gdb.get(dbName, collectionName, query);
    client.close();
    if (results.length == 0) {
      params.msg = identity+" does not exist.";
    }
    else {
      resetIdentity = identity;
      let rndNum = "";
      for (let ii = 0; ii < 5; ii ++) {
        rndNum += Math.floor(Math.random() * 10);
      }
      resetCode = rndNum;
      let mailOptions = {
        from: "copper.iron.29@gmail.com",
        to: identity,
        subject: "subject.",
        text: "text '" + rndNum + "'."
      };
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      params.msg = "Reset code has been sent to " + identity + ". Please check it out.";
    }
  }
  catch (err) {
    console.log(err.message);
  }
  finally {
    params_str = JSON.stringify(params);
    console.log("server res = " + params_str);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(params_str);
  }
});

app.post("/check_reset_code", (req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  console.log("server req = " + JSON.stringify(req.body));
  let code = (req.body.code)? req.body.code : null;
  if (!code) {
    params.msg = "Fill up the blanks."
    return;
  }
  if (code == resetCode) {
    resetCode = null;
    resetCodeCheck = 1;
    params.success = 1;
    params.msg = "Reset code is correct."
  }
  else {
    params.msg = "Reset code is incorrect."
  }
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.post("/change_password", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    if (resetCodeCheck == 0) {
      params.msg = 'You need to check the reset code first.';
      return;
    }
    console.log("server req = " + JSON.stringify(req.body));
    let password1 = (req.body.password1)? req.body.password1 : null;
    let password2 = (req.body.password2)? req.body.password2 : null;
    if (!password1 || !password2) {
      params.msg = "Fill up the blanks."
      return;
    }
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    let gdb = new MG.Graph(client, { print_out: true });
    let query = { identity: resetIdentity };
    let results = await gdb.get(dbName, collectionName, query);
    if (results.length == 0) {
      params.msg = resetIdentity + " does not exist.";
    }
    else {
      if (password1 == password2) {
        let update = { password: password1 };
        let result = await gdb.update(dbName, collectionName, query, update);
        // check result later.
        resetIdentity = null;
        resetCodeCheck = 0;
        params.success = 1;
        params.msg = "Password is changed Successfully.";
      }
      else {
        params.msg = "The two passwords are different.";
      }
    }
    client.close();
  }
  catch (err) {
    console.log(err.message);
  }
  finally {
    params_str = JSON.stringify(params);
    console.log("server res = " + params_str);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(params_str);
  }
});

app.post("/change_account_info", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    console.log("server req = " + JSON.stringify(req.body));
    let password1 = (req.body.password1)? req.body.password1 : null;
    let password2 = (req.body.password2)? req.body.password2 : null;
    let firstName = (req.body.firstName)? req.body.firstName : null;
    let lastName = (req.body.lastName)? req.body.lastName : null;
    if (!password1 || !password2 || !firstName || !lastName) {
      params.msg = "Fill up the blanks."
      return;
    }
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    let gdb = new MG.Graph(client, { print_out: true });
    let query = { identity: sessionAccount.identity };
    let results = await gdb.get(dbName, collectionName, query);
    if (results.length == 1) {
      if (password1 == password2) {
        let update = { password: password1, firstName: firstName, lastName: lastName };
        let result = await gdb.update(dbName, collectionName, query, update);
        params.success = 1;
        params.msg = "Informaion is changed successfully.";
      }
      else {
        params.msg = "The two passwords are different.";
      }
    }
    else {
      params.msg = sessionAccount.identity + " doesn't exist.";
    }
    client.close();
  }
  catch (err) {
    console.log(err.message);
  }
  finally {
    params_str = JSON.stringify(params);
    console.log("server res = " + params_str);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(params_str);
  }
});

app.use("/", express.static(__dirname)); //  + '/public'));

var server = app.listen(8103, "127.0.0.1", function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});


/*  function(err, db) {
    if (err) throw err;
    let dbo = db.db(dbName);
    let query = {identity:identity};
    dbo.collection(collectionName).findOne(query, function(err, result) {
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
*/

/*
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
    let dbo = db.db(dbName);
    let query = {identity:identity};
    dbo.collection(collectionName).findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        if (password1 == password2) {
          dbo.collection(collectionName).insertOne(personal, function(err, info) {
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
*/

/*
  console.log("server req = " + JSON.stringify(req.body));
  let identity = (req.body.identity)?req.body.identity:"identity error";
  let params = { msg: "" };
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err) throw err;
    let dbo = db.db(dbName);
    let query = {identity: identity};
    dbo.collection(collectionName).findOne(query, function(err, result) {
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
*/

/*
  console.log("server req = "+JSON.stringify(req.body));
  if (resetCodeCheck == 0) {
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
    let dbo = db.db(dbName);
    let query = {identity: resetIdentity};
    dbo.collection(collectionName).findOne(query, function(err, result) {
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
          dbo.collection(collectionName).updateOne(query, update, function(err, res) {
            if (err) throw err;
          resetCodeCheck = 0;
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
*/

/*
  console.log("server req = "+JSON.stringify(req.body));
  let password1 = (req.body.password1)?req.body.password1:"password1 error";
  let password2 = (req.body.password2)?req.body.password2:"password2 error";
  let firstName = (req.body.firstName)?req.body.firstName:"firstName error";
  let lastName = (req.body.lastName)?req.body.lastName:"lastName error";
  let params = {msg:""};
  let params_str = "";
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if (err)  throw err;
    let dbo = db.db(dbName);
    if (password1 == password2) {
      let query = {identity: sessionAccount.identity};
      let update = {$set:{password:password1, firstName:firstName, lastName:lastName}};
      dbo.collection(collectionName).updateOne(query, update, function(err, info) {
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
*/
