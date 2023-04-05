// Használt css-classok: correct-answer, incorrect-answer, question-container, question-index

// A kérdések importáláshoz szükséges a 'type="module"' attribútum a HTML fájlban a quiz.js script importálásakor!

import { questions } from './questions.js';

// Eltároljuk a jelenlegi kérdés számát, a helyes válaszok számát és a felhasználó válaszait

let currentQuestion = 0;
let numCorrectAnswers = 0;
let userAnswers = {};

// HTML elemek összerendelése változókhoz

const questionContainer = document.querySelector('.question-container')
const answerContainer = document.querySelector('#answer-container');
const feedbackContainer = document.querySelector('#feedback-container');
const continueBtn = document.querySelector('#continue-btn');
const resetBtn = document.querySelector('#reset-btn');

// Kérdés megjelenítése

function showQuestion(questionIndex) {

    // Jelenlegi kérdés eltárolása, majd a kérdés megjelenítése

    const currentQuestion = questions[questionIndex];
    questionContainer.innerHTML = `<span class="question-index">${questionIndex + 1}.</span> ${currentQuestion.question}`;

    // A választási lehetőségek törlése (ennek akkor van jelentősége, ha már volt korábban kérdés), az újrakezdés gomb elrejtése

    answerContainer.innerHTML = '';
    resetBtn.style.display = 'none';

    // A lehetséges válaszokon való átiterálás, majd azok egyenként a konténerbe való hozzáadása

    currentQuestion.answers.forEach((answer, index) => {

        // Egy div elem létrehozása a rádiógomb és a label elemmel

        const answerElem = document.createElement('div');

        answerElem.innerHTML =
            `
            <input type='radio' name='answer' value='${index}' id='answer-${index}'>
            <label for='answer-${index}'>${answer}</label>
            `;

        answerContainer.appendChild(answerElem);
    });

    // Ha egy válasz megadásra kerül, akkor a folytatás gomb engedélyezése

    answerContainer.addEventListener('click', (event) => {
        if (event.target.type === 'radio') continueBtn.disabled = false;
    });
}

// Válasz ellenőrzése

function checkAnswer() {
    const selectedAnswer = document.querySelector(
        "input[name='answer']:checked"
    );
    if (!selectedAnswer) return;

    // A felhasználó válaszának eltárolása, ha az helyes, a helyes válaszok számának növelése

    userAnswers[currentQuestion] = parseInt(selectedAnswer.value);
    if (selectedAnswer.value == questions[currentQuestion].correctAnswer) numCorrectAnswers++;
}

// Végeredmény megjelenítése

function showResults() {

    // Elért pontszám és százalék megjelenítése

    feedbackContainer.innerHTML = `<span>Pontszám: ${numCorrectAnswers}/${questions.length}, Százalék: ${Math.round((numCorrectAnswers / questions.length) * 100)}%</span>`;

    // A kérdéseken való végigiterálás

    questions.forEach((question, questionIndex) => {

        let questionDiv = document.createElement('div');

        // A kérdés megjelenítése

        let questionSpan = document.createElement('span');
        questionSpan.classList.add('question-container');

        questionSpan.innerHTML = `<span class="question-index">${questionIndex + 1}.</span> ${question.question}`;

        questionDiv.appendChild(questionSpan);

        // A válaszok megjelenítése

        let answerList = document.createElement('ul');

        // A válaszokon való végigiterálás

        question.answers.forEach((answer, answerIndex) => {

            let answerSpan = document.createElement('span');

            // A felhasználó válaszának eltárolása 

            let userAnswer = userAnswers[questionIndex];

            // A helyes válasz megjelenítése zölddel, a helytelen pirossal

            (question.correctAnswer === answerIndex) ? answerSpan.classList.add('correct-answer') : (userAnswer === answerIndex) ? answerSpan.classList.add('incorrect-answer') : null;

            // A felhasználó válaszának megjelölése

            (userAnswer === answerIndex) ? (answerSpan.innerText = '(Ön válasza) ' + answer)  : answerSpan.innerText = answer;

            let answerListItem = document.createElement('li');
            answerListItem.appendChild(answerSpan);
            answerList.appendChild(answerListItem);

        });

        questionDiv.appendChild(answerList);
        feedbackContainer.appendChild(questionDiv);

    });

    // A végeredmény megjelenítése, a kérdések, válaszok és egyéb elemek eltüntetése.

    feedbackContainer.style.display = 'block';

    questionContainer.innerHTML = answerContainer.innerHTML = '';
    [ questionContainer, answerContainer, continueBtn ].forEach(e => e.style.display = 'none');

    // Újrakezdés gomb megjelenítése

    resetBtn.style.display = 'block';

}

// Első kérdés megjelenítése

showQuestion(currentQuestion);

// Eseménykezelés

continueBtn.addEventListener('click', () => {
    checkAnswer();
    currentQuestion++;
    (currentQuestion < questions.length) ?
        (showQuestion(currentQuestion), continueBtn.disabled = true) :
        (continueBtn.style.display = 'none', showResults());
});

resetBtn.addEventListener('click', () => {
    currentQuestion = 0;
    numCorrectAnswers = 0;
    userAnswers = {};

    [ questionContainer, answerContainer, continueBtn ].forEach(e => e.style.display = 'block');
    feedbackContainer.style.display = 'none';

    feedbackContainer.innerHTML = '';
    showQuestion(currentQuestion);
});
