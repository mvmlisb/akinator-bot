const InlineKeyboard = require("./inline-keyboard");

module.exports = class GameManager {

    #bot;
    #inlineKeyboard;

    constructor(bot) {
        this.#bot = bot;
        this.#inlineKeyboard = new InlineKeyboard();
    }

    sendToShowInabilityToStartNewSession(session) {
        const text = "You can't start a new session! Complete the already started session.";
        return this._sendMessage(session, text);
    }

    sendToShowQuestion(session) {
        const data = this._createTextAndKeyboardForQuestion(session);
        return this._sendMessage(session, data.text, data.keyboard);
    }

    editToShowQuestion(session) {
        const data = this._createTextAndKeyboardForQuestion(session);
        return this._editMessage(session, data.text, data.keyboard);
    }

    editToShowProposalToContinueGame(session) {
        const text = "Continue?";
        const keyboard = this.#inlineKeyboard.buildWithProposalToContinueGame();
        return this._editMessage(session, text, keyboard);
    }

    editToShowGuess(session) {
        const name = session.guess.name;
        const text = `I think of ${name}. Am I right?`;
        const keyboard = this.#inlineKeyboard.buildWithAnswersOnGuesses();
        return this._editMessage(session, text, keyboard);
    }

    editToCompleteSuccessfulGame(session) {
        const name = session.guess.name;
        return this._editMessage(session, name);
    }

    editToCompleteUnsuccessfulGame(session) {
        const text = "Unfortunately, I can't guess the character. Try again.";
        return this._editMessage(session, text);
    }

    sendPhotoOfRightGuess(session) {
        return this.#bot.sendPhoto(session.chatId, session.guess.absolute_picture_path);
    }

    delete(chatId, messageId) {
        return this.#bot.deleteMessage(chatId, messageId);
    }

    _sendMessage(session, text, replyMarkup = null) {
        const form = this._createFormWithReplyMarkupIfItIsNotNull(replyMarkup);
        return this.#bot.sendMessage(session.chatId, text, form);
    }

    _editMessage(session, text, replyMarkup = null) {
        const form = this._createFormWithReplyMarkupIfItIsNotNull(replyMarkup);
        form.chat_id = session.chatId;
        form.message_id = session.messageId;
        return this.#bot.editMessageText(text, form);
    }

    _createTextAndKeyboardForQuestion(session) {
        const text = `${session.questionNumber}. ${session.question}`;
        const keyboard = this.#inlineKeyboard.buildWithAnswersOnQuestions();
        return {"text": text, "keyboard": keyboard};
    }

    _createFormWithReplyMarkupIfItIsNotNull(replyMarkup) {
        const form = {};
        if(replyMarkup) {
            form.reply_markup = replyMarkup;
        }
        return form;
    }

};