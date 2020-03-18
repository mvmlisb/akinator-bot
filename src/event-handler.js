const Message = require("./telegram/message");
const GameSessionStorage = require("./game/game-session-storage");
const GameSession = require("./game/game-session");
const {COMPLETE_GAME, CONTINUE_GAME, RIGHT_GUESS, WRONG_GUESS} = require("./commands");

module.exports = class EventHandler {

    #message;
    #storage;

    constructor(bot) {
        this.#message = new Message(bot);
        this.#storage = new GameSessionStorage();
    }

    handleMessageToStartGame(message, region) {
        const chatId = message.chat.id;
        if(this.#storage.containsSession(chatId)) {
           this._handleStartedSession(chatId);
        }
        else {
            const messageId = message.message_id;
            this._handleStartOfNewSession(region, chatId, messageId);
        }
    }

    handleCommand(query) {
        const chatId = query.message.chat.id;
        const command = Number.parseInt(query.data);
        const session = this.#storage.getSession(chatId);
        switch (command) {
            case RIGHT_GUESS:
                this._handleCommandWithRightGuess(session);
                break;
            case WRONG_GUESS:
                this._handleCommandWithWrongGuess(session);
                break;
            case CONTINUE_GAME:
                this._handleCommandToContinueGame(session);
                break;
            case COMPLETE_GAME:
                this._handleCommandToCompleteGame(session);
                break;
            default:
                this._handleCommandToAnswerOnQuestion(session, command);
                break;
        }
    }

    _handleStartedSession(chatId) {
        const session = this.#storage.getSession(chatId);
        this.#message.sendToShowInabilityToStartNewSession(session);
    }

    _handleStartOfNewSession(region, chatId, messageId) {
        const session = new GameSession(region, chatId);
        this.#storage.addSession(session);
        session.start().then(() => {
            this.#message.delete(chatId, messageId);
            this.#message.sendToShowQuestion(session).then(result => {
                session.messageId = result.message_id;
            })
        });
    };

    _handleCommandWithRightGuess(session) {
        this.#message.editToCompleteSuccessfulGame(session);
        this.#message.sendPhotoOfRightGuess(session);
        this.#storage.removeSession(session.chatId);
    }

    _handleCommandWithWrongGuess(session) {
        if(!session.isLastStep()) {
            this.#message.editToShowProposalToContinueGame(session);
        }
        else {
            this.#message.editToCompleteUnsuccessfulGame(session);
            this.#storage.removeSession(session.chatId);
        }
    }

    _handleCommandToContinueGame(session) {
        session.resetAnsweredQuestions();
        this.#message.editToShowQuestion(session);
    }

    _handleCommandToCompleteGame(session) {
        this.#message.delete(session.chatId, session.messageId);
        this.#storage.removeSession(session.chatId);
    }

    _handleCommandToAnswerOnQuestion(session, command) {
        session.answerOnQuestion(command).then(() => {
            if (!session.isReadyToShowGuess() && !session.isLastStep()) {
                this.#message.editToShowQuestion(session);
            }
            else {
                session.tryToWin().then(() => {
                    this.#message.editToShowGuess(session);
                })
            }
        })
    }

};