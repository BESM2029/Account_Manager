const axios = require('axios');
const assert = require('chai').assert;
const nock = require('nock');

var dbName = "account_server_db_test";

function dropDB() {
  return axios({
    method: 'post',
    url: 'http://localhost:8103/__drop_account_db__',
    data: { __dbName__: dbName },
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function createAccount(Account_data) {
  return axios({
    method: 'post',
    url: 'http://localhost:8103/create_account',
    data: Account_data,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function loginAccount(Account_data) {
  return axios({
    method: 'post',
    url: 'http://localhost:8103/login_account',
    data: Account_data,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

describe('Create Account Test', () => {
  it('Drop test db', async() => {
    let res = await dropDB();
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
    let res = await loginAccount(AccountData)
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 1); 
  });
});