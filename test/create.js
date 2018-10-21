const axios = require('axios');
const expect = require('chai').expect;
const assert = require('chai').assert;
const nock = require('nock');

describe('Create Account Test', () => {
  it('Should assert true to be true', () => {
    //expect(true).to.be.true;
    assert(true);
  });
  /*it("Time Delay Test", () => {
    let date1 = new Date();
    let date2 = new Date();
    assert(date1 <= date2);
  })
  it("Github Octocat Response Test", () => {
    return getUser('octocat')
    .then(response => {
      //expect an object back
      expect(typeof response).to.equal('object');

      //Test result of name, company and location for the response
      expect(response.name).to.equal('The Octocat')
      expect(response.company).to.equal('GitHub')
      expect(response.location).to.equal('San Francisco')
    });
  })*/
});