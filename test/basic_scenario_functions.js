const axios = require('axios');

function dropDB(dbName) {
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

if (typeof module != 'undefined') // node
  module.exports = { dropDB: dropDB, createAccount: createAccount, loginAccount: loginAccount };