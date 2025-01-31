let allQuestions = [];
let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// List of JSON file URLs
const jsonFileUrls = [
    "https://raw.githubusercontent.com/brathoreittest/quizapp/main/airwaterweather.json",
    "https://raw.githubusercontent.com/brathoreittest/quizapp/main/TheSolarSystem.json",
];

// Function to extract the filename from a URL
function getFileNameFromUrl(url) {
    return url.split("/").pop().split(".json")[0]; // Extract filename and remove ".json"
}

// Function to create buttons dynamically
function createChapterButtons() {
    const chapterButtonsContainer = document.querySelector(".chapter-buttons");

    jsonFileUrls.forEach((url) => {
        const button = document.createElement("button");
        button.innerText = getFileNameFromUrl(url); // Use filename as chapter name
        button.addEventListener("click", () => loadQuestions(url));
        chapterButtonsContainer.appendChild(button);
    });
}

// Load questions from the selected JSON file URL
async function loadQuestions(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load: ${url}`);
        
        allQuestions = await response.json();
        console.log(allQuestions);
        
        // Randomly select up to 30 questions, but not more than available
        questions = getRandomQuestions(allQuestions, Math.min(30, allQuestions.length));
        
        // Reset quiz state
        currentQuestionIndex = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        document.querySelector(".question-container").style.display = "block";
        document.getElementById("result").innerHTML = "";
        
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
        li.style.cursor = "pointer";
        
        li.addEventListener("click", () => {
            if (index === currentQuestion.correctAnswer) {
                li.style.color = "green";
                feedbackElement.innerText = "Correct!";
                correctAnswers++;
            } else {
                li.style.color = "red";
                feedbackElement.innerText = "Incorrect!";
                wrongAnswers++;
            }
            nextButton.style.display = "block";
        });
        
        choicesElement.appendChild(li);
    });
    
    // Ensure only one event listener is attached
    nextButton.onclick = nextQuestion;
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

    questionContainer.style.display = "none";
    resultElement.innerHTML = `
        <p>Quiz completed!</p>
        <p style="color: green;font-size: 3em;">Correct Answers: ${correctAnswers}</p>
        <p style="color: red;font-size: 3em;">Wrong Answers: ${wrongAnswers}</p>
    `;
}

// Initialize the app by creating chapter buttons
createChapterButtons();
