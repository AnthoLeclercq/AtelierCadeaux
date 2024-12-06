//Constructor
class Question {
    constructor(id, text, options) {
        this.id = id;
        this.text = text;
        this.options = options;
    }
}

//Maybe use meta for some questions ?
const questions = [
    new Question(1, "Quelles sont vos couleurs préférées ?", ["Rouge", "Bleu", "Vert", "Autre"]),
    new Question(2, "Quels sont vos genres de films préférés ?", ["Action", "Comédie", "Drame", "Autre"]),
    // ...
];

function generateQuestionnaire() {
    const questionnaire = {};

    questions.forEach(question => {
        questionnaire[question.id] = {
            id: question.id,
            text: question.text,
            options: question.options,
            answer: null, //User's answer
        };
    });

    return questionnaire;
}

const userQuestionnaire = generateQuestionnaire();
console.log(userQuestionnaire);
