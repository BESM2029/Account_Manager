const assert = require('chai').assert;
const nock = require('nock');

const bsf = require('./basic_scenario_functions.js');
const createAccount = require('./basic_scenario_functions.js').createAccount;

var dbName = "account_server_db_test";

describe('Create Account Test', () => {
  it('Drop test db', async() => {
    let res = await bsf.dropDB(dbName);
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 1);
  });
  it("Create an account", async() => {
    let AccountData 
        = { __dbName__: dbName,
            identity: "moon.hwang@gmail.com", 
            password1: "ironbag123",
            password2: "ironbag123",
            firstName: "Moon Ho", 
            lastName: "Hwang"};
    let res = await createAccount(AccountData)
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 1); 
  });
  it("Create same account again", async() => {
    let AccountData 
        = { __dbName__: dbName,
            identity: "moon.hwang@gmail.com", 
            password1: "ironbag123",
            password2: "ironbag123",
            firstName: "Moon Ho", 
            lastName: "Hwang"};
    let res = await createAccount(AccountData)
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 0);
  });
  it("Login account", async() => {
    let AccountData 
        = { __dbName__: dbName,
            identity: "moon.hwang@gmail.com", 
            password: "ironbag123"};
    let res = await bsf.loginAccount(AccountData)
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 1); 
  });
});