let allQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

async function loadQuestions() {
    try {
        // Fetching questions from the external URL
        const response = await fetch('https://raw.githubusercontent.com/brathoreittest/quizapp/main/questions.json');
        allQuestions = await response.json();
        console.log(allQuestions);

        // Randomly select 10 questions
        questions = getRandomQuestions(allQuestions, 20);

        showQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function getRandomQuestions(questionArray, numQuestions) {
    let shuffled = questionArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
}

function showQuestion() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-btn");

    // Reset feedback and choices
    feedbackElement.innerText = "";
    choicesElement.innerHTML = "";
    nextButton.style.display = "none";

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.choices.forEach((choice, index) => {
        const li = document.createElement("li");
        li.innerText = choice;
        li.addEventListener("click", () => checkAnswer(index));
        choicesElement.appendChild(li);
    });
}

function checkAnswer(selectedIndex) {
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-btn");

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correctAnswer) {
        feedbackElement.innerText = "Correct!";
        correctAnswers++;
    } else {
        feedbackElement.innerText = "Incorrect!";
        wrongAnswers++;
    }

    // Show the next question button
    nextButton.style.display = "block";

    // Move to the next question or show results
    nextButton.addEventListener("click", nextQuestion);
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const questionContainer = document.querySelector(".question-container");
    const resultElement = document.getElementById("result");

    // Hide the question container
    questionContainer.style.display = "none";

    // Display the result
    resultElement.innerHTML = `
        <p>Quiz completed!</p>
        <p style="color: green;font-size: 3em;">Correct Answers: ${correctAnswers}</p>
        <p style="color: red;font-size: 3em;">Wrong Answers: ${wrongAnswers}</p>
    `;
}

// Initialize and load questions
loadQuestions();
