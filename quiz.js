// Get the form and quiz results elements
const quizForm = document.getElementById('quizForm');
const quizResults = document.getElementById('quizResults');

// Define the correct answers
const correctAnswers = {
    q1: 'a',
    q2: 'b',
    q3: 'c'
};

// Add an event listener to the form submit button
quizForm.addEventListener('submit', function (event) {
    event.preventDefault(); // prevent the form from submitting

    let score = 0; // initialize the score to 0

    // loop through all the form elements and check the answers
    for (let i = 0; i < quizForm.elements.length; i++) {
        const element = quizForm.elements[i];
        if (element.type === 'radio' && element.checked) {
            const answer = element.value;
            const questionNumber = element.name;
            if (answer === correctAnswers[questionNumber]) {
                score++; // increment the score for correct answers
            }
        }
    }

    // display the quiz results
    quizResults.innerHTML = `Összesen ${score} pontot kaptál a ${Object.keys(correctAnswers).length}-ból.`;
});