const {
    ANSWER_DO_NOT_KNOW,
    ANSWER_NO,
    ANSWER_PROBABLY,
    ANSWER_PROBABLY_NOT,
    ANSWER_YES,
    COMPLETE_GAME,
    CONTINUE_GAME,
    RIGHT_GUESS,
    WRONG_GUESS
} = require("../commands");

module.exports = class InlineKeyboard {

    buildWithAnswersOnQuestions() {
        return {
            inline_keyboard: [
                [{text: "Yes", callback_data: ANSWER_YES},],
                [{text: "No", callback_data: ANSWER_NO}],
                [{text: "Don't know", callback_data: ANSWER_DO_NOT_KNOW}],
                [{text: "Probably", callback_data: ANSWER_PROBABLY}],
                [{text: "Probably not", callback_data: ANSWER_PROBABLY_NOT}],
                [{text: "Complete game", callback_data: COMPLETE_GAME}]
            ]
        };
    }

    buildWithAnswersOnGuesses() {
        return {
            inline_keyboard: [
                [{text: "Yes", callback_data: RIGHT_GUESS}],
                [{text: "No", callback_data: WRONG_GUESS}]
            ]
        };
    }

    buildWithProposalToContinueGame() {
        return {
            inline_keyboard: [
                [{text: "Yes", callback_data: CONTINUE_GAME}],
                [{text: "No", callback_data: COMPLETE_GAME}]
            ]
        };
    }

};