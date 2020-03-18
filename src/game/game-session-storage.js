module.exports = class GameSessionStorage {

    #sessions;

    constructor() {
        this.#sessions = {};
    }

    addSession(session) {
        this.#sessions[session.chatId] = session;
    }

    removeSession(key){
        delete this.#sessions[key];
    };

    getSession(key) {
        return this.#sessions[key];
    }

    containsSession(key){
       return this.#sessions.hasOwnProperty(key);
    }

};