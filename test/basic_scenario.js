const assert = require("chai").assert;
const nock = require("nock");

const bsf = require("./basic_scenario_functions.js");

const dbName = "multi_account_server_db_test";

let resetCodeStorage = {};

console.log("Multi Account DB Server Test");

describe("Phase 0 : Drop Test DB", () => {
  it("Drop test db", async() => {
    let accountData = { __dbName__: dbName };
    let res = await bsf.dropDB(accountData);
    console.log(res);
    assert(typeof res == 'object');
    assert(res.success == 1);
    assert(res.msg == "multi_account_server_db_test is successfully droped.");
  });
});

describe("Phase 1 : Create Account Test", () => {
  it("Create an account normally", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      password1: "1111",
      password2: "1111",
      firstName: "정준",
      lastName: "황"
    };
    let res = await bsf.createAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "beatless08@naver.com is created successfully.");
  });
  it("Create an account that already exists", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      password1: "1111",
      password2: "1111",
      firstName: "정준",
      lastName: "황"
    };
    let res = await bsf.createAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "beatless08@naver.com already exists.");
  });
  it("Create an account that last name has missing", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password1: "9999",
      password2: "9999",
      firstName: "정준",
      lastName: null
    };
    let res = await bsf.createAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Fill up the blanks.");
  });
  it("Create an account that two password are different", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password1: "9999",
      password2: "0000",
      firstName: "정준",
      lastName: "황"
    };
    let res = await bsf.createAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "The two passwords are different.");
  });
  it("Create another account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password1: "9999",
      password2: "9999",
      firstName: "정준",
      lastName: "황"
    };
    let res = await bsf.createAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "beatless08@gmail.com is created successfully.");
  });
  it("Create another account again", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@daum.net",
      password1: "2222",
      password2: "2222",
      firstName: "정준",
      lastName: "황"
    };
    let res = await bsf.createAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "beatless08@daum.net is created successfully.");
  });
});

describe("Phase 2 : Login Account Test", () => {
  it("Login account normally", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      password: "1111",
    };
    let res = await bsf.loginAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "beatless08@naver.com login successfully.");
  });
  it("Login account that doesn't exist", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless02@gmail.com",
      password: "9999",
    };
    let res = await bsf.loginAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    //assert(res.msg == "beatless02@naver.com doesn't exist.");
  });
  it("Login account that password has missing", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password: null,
    };
    let res = await bsf.loginAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Fill up the blanks.");
  });
  it("Login account that password has wrong", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password: "0000",
    };
    let res = await bsf.loginAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    //assert(res.msg == "beatless08@naver.com's password is different.");
  });
  it("Login another account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password: "9999",
    };
    let res = await bsf.loginAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "beatless08@gmail.com login successfully.");
  });
  it("Login another account again", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@daum.net",
      password: "2222",
    };
    let res = await bsf.loginAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "beatless08@daum.net login successfully.");
  });
});

describe("Phase 3 : Logout Account Test", () => {
  it("Logout account normally", async() => {
    let accountData = { identity: "beatless08@naver.com" };
    let res = await bsf.logoutAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "logout successfully.");
  })
  it("Logout account that doesn't exist ID in sessionStorage", async() => {
    let accountData = { identity: null };
    let res = await bsf.logoutAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Session ID has not been passed.");
  })
  it("Logout account that doesn't be login ID", async() => {
    let accountData = { identity: "beatless08@naver.com" };
    let res = await bsf.logoutAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Login has not been made. Login first!");
  })
  it("Logout another account normally", async() => {
    let accountData = { identity: "beatless08@daum.net" };
    let res = await bsf.logoutAccount(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "logout successfully.");
  })
});

describe("Phase 4 : Change Account Info Test", () => {
  it("Change account info with doesn't exist ID in sessionStorage", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: null,
      password1: "4444",
      password2: "4444",
      firstName: "문호",
      lastName: "황"
    };
    let res = await bsf.changeAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Session ID was no set.");
  });
  it("Change account info with doesn't made login", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      password1: "4444",
      password2: "4444",
      firstName: "문호",
      lastName: "황"
    };
    let res = await bsf.changeAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Login was not made.");
  });
  it("Change account info with empty space", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password1: "4444",
      password2: "4444",
      firstName: null,
      lastName: "황"
    };
    let res = await bsf.changeAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Fill up the blanks.");
  });
  it("Change account info with wrong password", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password1: "4444",
      password2: "0000",
      firstName: "문호",
      lastName: "황"
    };
    let res = await bsf.changeAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "The two passwords are different.");
  });
  it("Change account normally", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@gmail.com",
      password1: "4444",
      password2: "4444",
      firstName: "문호",
      lastName: "황"
    };
    let res = await bsf.changeAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Informaion is changed successfully.");
  });
});

describe("Phase 5 : Get Account Info Test", () => {
  it("Get account info normally", async() => {
    let accountData = { identity: "beatless08@gmail.com" }
    let res = await bsf.getAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Displayed.");
    assert(res.accountInfo.identity == "beatless08@gmail.com");
    assert(res.accountInfo.firstName == "정준");
    assert(res.accountInfo.lastName == "황");
  })
  it("Get info of account that doesn't exist ID in sessionStorage", async() => {
    let accountData = { identity: null }
    let res = await bsf.getAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Session ID has not been passed.");
  })
  it("Get info of account that doesn't be login ID", async() => {
    let accountData = { identity: "beatless08@naver.com" };
    let res = await bsf.getAccountInfo(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Login has not been made. Login first!");
  })
});

describe("Phase 6 : Forgot Password Test", () => {
  it("Request reset code normally", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      __testRequest__: true
    };
    let res = await bsf.forgotPassword(accountData);
    resetCodeStorage["beatless08@naver.com"] = res.resetCode;
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Reset code has been sent to beatless08@naver.com. Please check it out.");
  })
  it("Request reset code again normally", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      __testRequest__: true
    };
    let res = await bsf.forgotPassword(accountData);
    resetCodeStorage["beatless08@naver.com"] = res.resetCode;
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Reset code has been sent to beatless08@naver.com. Please check it out.");
  })
  it("Request reset code normally with another account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@daum.net",
      __testRequest__: true
    };
    let res = await bsf.forgotPassword(accountData);
    resetCodeStorage["beatless08@daum.net"] = res.resetCode;
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Reset code has been sent to beatless08@daum.net. Please check it out.");
  })
});

describe("Phase 7 : Check Reset Code Test", () => {
  it("Enter reset code that another account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      code: resetCodeStorage["beatless08@daum.net"]
    };
    let res = await bsf.checkResetCode(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "Reset code is incorrect.");
  })
  it("Enter correct reset code", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      code: resetCodeStorage["beatless08@naver.com"]
    };
    let res = await bsf.checkResetCode(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Reset code is correct.");
  })
});

describe("Phase 8 : Change Password Test", () => {
  it("Change password with unverified account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@daum.net",
      password1: "5555",
      password2: "5555",
    };
    let res = await bsf.changePassword(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "ResetCode has not been verified.");
  });
  it("Change password with verified account with two different password", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      password1: "5555",
      password2: "0000",
    };
    let res = await bsf.changePassword(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 0);
    assert(res.msg == "The two passwords are different.");
  });
  it("Change password with verified account", async() => {
    let accountData = {
      __dbName__: dbName,
      identity: "beatless08@naver.com",
      password1: "5555",
      password2: "5555",
    };
    let res = await bsf.changePassword(accountData);
    console.log(res);
    assert(typeof res == "object");
    assert(res.success == 1);
    assert(res.msg == "Password is changed Successfully.");
  });
});