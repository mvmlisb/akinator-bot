const aki = require("aki-api");
const {
    ANSWERED_QUESTIONS_TO_SHOW_GUESS,
    PROGRESS_TO_SHOW_GUESS,
    LAST_STEP
} = require("../constants");

module.exports = class GameSession {

    constructor(region, chatId) {
        this.region = region;
        this.chatId = chatId;
        this.step = 0;
        this.questionNumber = 1;
        this.answeredQuestions = 0;
        this.messageId = null;
        this.sessionId = null;
        this.signatureId = null;
        this.question = null;
        this.progress = null;
        this.guess = null;
    }

    async start() {
        await aki.start(this.region)
            .then(response => this._updateAfterStart(response));
    }

    async answerOnQuestion(answerId) {
        await aki.step(this.region, this.sessionId, this.signatureId, answerId, this.step)
            .then(response => this._updateAfterAnswerOnQuestion(response));
    }

    async tryToWin() {
        await aki.win(this.region, this.sessionId, this.signatureId, this.step)
            .then(response => this._updateAfterTryingToWin(response));
    }

    resetAnsweredQuestions() {
        this.answeredQuestions = 0;
    }

    isLastStep() {
        return this.step === LAST_STEP;
    }

    isReadyToShowGuess() {
        return this._isProgressEnough && this._areAnsweredQuestionsEnough();
    }

    _updateAfterStart(response) {
        this.sessionId = response.session;
        this.signatureId = response.signature;
        this.question = response.question;
    }

    _updateAfterAnswerOnQuestion(response) {
        this.progress = response.progress;
        this.question = response.nextQuestion;
        this.step++;
        this.questionNumber++;
        if(this._isProgressEnough()) {
            this.answeredQuestions++;
        }
    }

    _updateAfterTryingToWin(response) {
        this.guess = response.answers[0];
    }

    _isProgressEnough() {
        return this.progress >= PROGRESS_TO_SHOW_GUESS;
    }

    _areAnsweredQuestionsEnough() {
        return this.answeredQuestions >= ANSWERED_QUESTIONS_TO_SHOW_GUESS;
    }

};