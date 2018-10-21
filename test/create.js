const axios = require('axios');
const expect = require('chai').expect;
const assert = require('chai').assert;
const nock = require('nock');

function createAccount(Account_data) {
  return axios({
      method: 'post',
      url: 'http://localhost:8103/create_account',
      data: Account_data,
      headers: { 
        /*"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cache-Control": "no-cache",
        "Postman-Token": "42e6c291-9a09-c29f-f28f-11872e2490a5"*/
      }
      })
    .then(res => res.data)  
    .catch(error => console.log(error));
}

describe('Create Account Test', () => {
  it('Should assert true to be true', () => {
    //expect(true).to.be.true;
    assert(true);
  });
  it("Create an account", () => {
      let AccountData 
          = { identity: "moon.hwang@gmail.com", 
              password1: "ironbag123",
              password2: "ironbag123",
              firstName: "Moon Ho", 
              lastName: "Hwang"};

      createAccount(AccountData)
      .then(res => {
        console.log(res);
        //expect an object back
        expect(typeof res).to.equal('object');

        //Test result of name, company and location for the response
        expect(res.success).to.equal(0); 
      })
      .catch(error=>console.log(error));
  });
});