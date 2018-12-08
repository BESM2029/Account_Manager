const axios = require("axios");

function dropDB(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/__drop_account_db__",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function createAccount(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/create_account",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function loginAccount(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/login_account",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function getAccountInfo(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/get_account_info",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function changeAccountInfo(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/change_account_info",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function logoutAccount(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/logout_account",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function forgotPassword(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/forgot_password",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function checkResetCode(resetCode) {
  return axios({
    method: "post",
    url: "http://localhost:8103/check_reset_code",
    data: resetCode,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}

function changePassword(accountData) {
  return axios({
    method: "post",
    url: "http://localhost:8103/change_password",
    data: accountData,
    headers: {}
  })
  .then(res => res.data)
  .catch(error => console.log(error));
}


if (typeof module != "undefined") // node
  module.exports = {
    dropDB: dropDB, createAccount: createAccount, loginAccount: loginAccount,
    getAccountInfo: getAccountInfo, changeAccountInfo: changeAccountInfo, logoutAccount: logoutAccount,
    forgotPassword: forgotPassword, checkResetCode: checkResetCode, changePassword: changePassword
  };