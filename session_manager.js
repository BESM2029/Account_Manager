class SessionManager {
    constructor() {
      this._sessions = {};
      this._resettingPasswordSessions = {};
    }
    clearSessions() {
      this._sessions = {};
      this._resettingPasswordSessions = {};
    }
    //var sessionAccount = { identity: null, firstName: null, lastName: null };
    loginSession(session) {
      if (session.identity) {
        this._sessions[session.identity] = session;
      }
      this.printSessions();
    }
    getSessionAccountInfo(sessionIdentity) {
      let answer = null;
      if (sessionIdentity) {
        answer = this._sessions[sessionIdentity];
      }
      return answer;
    }
    logoutSession(sessionIdentity) {
      if (sessionIdentity) {
        delete this._sessions[sessionIdentity];
      }
      this.printSessions();
    }
    checkSessionLogin(sessionIdentity) {
      let answer = false;
      if (sessionIdentity && this._sessions[sessionIdentity]) {
        answer = true;
      }
      return answer;
    }
    resettingPasswordSession(sessionIdentity, resetCode) {
      if (sessionIdentity && resetCode) {
        this._resettingPasswordSessions[sessionIdentity] = { resetCode: resetCode, verified: false };
      }
      this.printResettingPasswordSessions();
    }
    getResetCode(sessionIdentity) {
      let answer = null;
      if (sessionIdentity) {
        let info = this._resettingPasswordSessions[sessionIdentity];
        if (info && info.resetCode) {
          answer = info.resetCode;
        }
      }
      return answer;
    }
    setResetCodeVerified(sessionIdentity) {
      if (sessionIdentity) {
        let info = this._resettingPasswordSessions[sessionIdentity];
        if (info) {
          info["verified"] = true;
        }
      }
    }
    checkResetCodeVerified(sessionIdentity) {
      let answer = false;
      if (sessionIdentity) {
        let info = this._resettingPasswordSessions[sessionIdentity];
        if (info && info.verified) {
          answer = true;
        }
      }
      return answer;
    }
    completingResetPasswordSession(sessionIdentity) {
      if (sessionIdentity) {
        delete this._resettingPasswordSessions[sessionIdentity];
      }
      this.printResettingPasswordSessions();
    }
    timeoutSession(sessionIdentity) {
      this.logoutSession(sessionIdentity);
    }
    printSessions() {
      console.log(JSON.stringify(this._sessions));
    }
    printResettingPasswordSessions() {
      console.log(JSON.stringify(this._resettingPasswordSessions));
    }
    greet() {
      return "Hello World.";
      // return `${this.name} says hello.`;
    }
}

if (typeof module != "undefined") // node
  module.exports = {
    SessionManager: SessionManager
  };