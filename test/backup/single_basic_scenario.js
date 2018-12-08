const assert = require("chai").assert;
const nock = require("nock");

const bsf = require("./basic_scenario_functions.js");
// const createAccount = require("./basic_scenario_functions.js").createAccount;

const dbName = "account_server_db_test";

describe("Account DB Server Test", () => {
  let _code;
  it("Drop test db", async() => {
    let res = await bsf.dropDB(dbName);
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 1);
  });
  it("Create an incomplete account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "moon.hwang@gmail.com",
      password1: "ironbag123",
      password2: "ironbag123",
      firstName: "Moon Ho", 
      lastName: null
    };
    let res = await bsf.createAccount(accountData)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
  });
  it("Create an account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "moon.hwang@gmail.com",
      password1: "ironbag123",
      password2: "ironbag123",
      firstName: "Moon Ho",
      lastName: "Hwang"
    };
    let res = await bsf.createAccount(accountData)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
  it("Create same account again", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "moon.hwang@gmail.com",
      password1: "ironbag123",
      password2: "ironbag123",
      firstName: "Moon Ho",
      lastName: "Hwang"
    };
    let res = await bsf.createAccount(accountData)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
  });
  it("Login account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "moon.hwang@gmail.com",
      password: "ironbag123"
    };
    let res = await bsf.loginAccount(accountData)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
  it("Get Account Info", async() => {
    let res = await bsf.getAccountInfo()
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.sessionAccount.identity == "moon.hwang@gmail.com");
    assert(res.sessionAccount.firstName == "Moon Ho");
    assert(res.sessionAccount.lastName == "Hwang");
  });
  it("Change Account Info", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "moon.hwang@gmail.com",
      password1: "ironbag123",
      password2: "ironbag123",
      firstName: "문호",
      lastName: "황"
    };
    let res = await bsf.changeAccountInfo(accountData)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
  it("Logout Account", async() => {
    let res = await bsf.logoutAccount()
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
  it("Forgot Password", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "moon.hwang@gmail.com",
      __testRequest__: true
    };
    let res = await bsf.forgotPassword(accountData)
    _code = res.resetCode
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
  it("Check Reset Code", async() => {
    let resetCode = { code: _code };
    console.log(resetCode);
    let res = await bsf.checkResetCode(resetCode)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
  it("Change Password", async() => {
    let accountData = {
      __dbName__: dbName,
      password1: "ironbag987",
      password2: "ironbag987",
    };
    let res = await bsf.changePassword(accountData)
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
  });
});