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

var MG = require("@mhhwang2002/MongoGraph");
const jungJun = require("./session_manager.js");
const sessionManager = new jungJun.SessionManager();

var dbNameDefault = "account_server_db_default";
var collectionName = "members";

app.post("/login_account", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    console.log("---------------------------------------------'/login_account' called.---------------------------------------------");
    console.log("server req = " + JSON.stringify(req.body));
    let dbName = (req.body.__dbName__)? req.body.__dbName__ : dbNameDefault;
    let identity = req.body.identity;
    let password = req.body.password;
    if (!req.body.identity || !req.body.password) {
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
        let session = { identity: result.identity, firstName: result.firstName, lastName: result.lastName }
        sessionManager.loginSession(session);
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
    console.log("---------------------------------------------'/create_account' called.---------------------------------------------");
    console.log("server req = " + JSON.stringify(req.body));
    let dbName = (req.body.__dbName__)? req.body.__dbName__ : dbNameDefault;
    let identity = (req.body.identity)? req.body.identity : null;
    let password1 = req.body.password1;
    let password2 = req.body.password2;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
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
        params.success = 1;
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
  console.log("server req = " + JSON.stringify(req.body));
  let params = { msg: "", success: 0 };
  if (req.body.identity){
    let sessionInfo = sessionManager.getSessionAccountInfo(req.body.identity);
    let params_str = "";
    console.log("---------------------------------------------'/get_account_info' called.---------------------------------------------");
    if (sessionInfo) {
      params.success = 1;
      params["sessionAccount"] = sessionInfo;
      params.msg = "Displayed.";
    }
    else {
      params.msg = "Login has not been made. Login first!";
    }
  }
  else {
    params.msg = "Session identity has not been passed.";
  }
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.post("/logout_account", (req, res) => {
  console.log("server req = " + JSON.stringify(req.body));
  let params = { msg: "", success: 0 };
  let params_str = "";
  console.log("---------------------------------------------'/logout_account' called.---------------------------------------------");
  if (req.body.identity){
    sessionManager.logoutSession(req.body.identity);
    let params_str = "";
    params.msg = "logout successfully.";
    params.success = 1;
  }
  else {
    params.msg = "Session identity has not been passed.";
  }
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.post("/forgot_password", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    console.log("---------------------------------------------'/forgot_password' called.---------------------------------------------");
    console.log("server req = " + JSON.stringify(req.body));
    let dbName = (req.body.__dbName__)? req.body.__dbName__ : dbNameDefault;
    let identity = req.body.identity;
    let testRequest = req.body.__testRequest__;
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
      let rndNum = "";
      for (let ii = 0; ii < 5; ii ++) {
        rndNum += Math.floor(Math.random() * 10);
      }
      sessionManager.resettingPasswordSession(identity, rndNum);
      let mailOptions = {
        from: "copper.iron.29@gmail.com",
        to: identity,
        subject: "Security code for changing password",
        text: "Security code: " + rndNum
      };
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      params.success = 1;
      params.msg = "Reset code has been sent to " + identity + ". Please check it out.";
      if (testRequest) {
        params["resetCode"] = resetCode;
        //params = params || { resetCode: resetCode };
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

app.post("/check_reset_code", (req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  console.log("---------------------------------------------'/check_reset_code' called.---------------------------------------------");
  console.log("server req = " + JSON.stringify(req.body));
  if (req.body.identity) {
    if (req.body.code) {
      let resetCode = sessionManager.getResetCode(req.body.identity);
      if (resetCode) {
        if (req.body.code == resetCode) {
          sessionManager.setResetCodeVerified(req.body.identity);
          params.success = 1;
          params.msg = "Reset code is correct."
        }
        else {
          params.msg = "Reset code is incorrect."
        }
      }
      else {
        params.msg = "Resetting password has not been requested.";
      }
    }
    else {
      params.msg = "ResetCode was not set.";
    }
  }
  else {
    params.msg = "Session ID was not set.";
  }
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.post("/change_password", async(req, res) => {
  console.log("---------------------------------------------'/change_password' called.---------------------------------------------");
  console.log("server req = " + JSON.stringify(req.body));
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    if (req.body.identity) {
      if (sessionManager.checkResetCodeVerified(req.body.identity)) {
        let dbName = (req.body.__dbName__)? req.body.__dbName__ : dbNameDefault;
        let password1 = req.body.password1;
        let password2 = req.body.password2;
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
            sessionManager.completingResetPasswordSession(req.body.identity);
            params.success = 1;
            params.msg = "Password is changed Successfully.";
          }
          else {
            params.msg = "The two passwords are different.";
          }
        }
        client.close();
      }
      else {
        params.msg = "ResetCode has not been verified.";
      }
    }
    else {
      params.msg = "Session ID was no set.";
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

app.post("/change_account_info", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  try {
    console.log("---------------------------------------------'/change_account_info' called.---------------------------------------------");
    console.log("server req = " + JSON.stringify(req.body));
    if (req.body.identity) {
      if (sessionManager.checkSessionLogin(req.body.identity)) {
        let dbName = (req.body.__dbName__)? req.body.__dbName__ : dbNameDefault;
        let password1 = req.body.password1;
        let password2 = req.body.password2;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        if (password1 && password2 && firstName && lastName) {
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
        else {
          params.msg = "Fill up the blanks."
        }
      }
      else {
        params.msg = "Login was not made.";
      }
    }
    else {
      params.msg = "Session ID was no set.";
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

app.post("/__drop_account_db__", async(req, res) => {
  let params = { msg: "", success: 0 };
  let params_str = "";
  console.log("---------------------------------------------'/__drop_account_db__' called.---------------------------------------------");
  console.log("server req = " + JSON.stringify(req.body));
  let dbName = req.body.__dbName__;
  if (dbName) {
    try {
      let client = await MongoClient.connect(url, { useNewUrlParser: true });
      let gdb = new MG.Graph(client, { print_out: true });
      await gdb.clearDB(dbName);
      await client.close();
      sessionManager.clearSessions();
      params.success = 1;
      params.msg = dbName + " is successfully droped.";
    }
    catch (err) {
      console.log(err);
    }
  }
  else {
    params.msg = "db doesn't exist.";
  }
  params_str = JSON.stringify(params);
  console.log("server res = " + params_str);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(params_str);
});

app.use("/", express.static(__dirname)); //  + '/public'));

var server = app.listen(8103, "127.0.0.1", function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});