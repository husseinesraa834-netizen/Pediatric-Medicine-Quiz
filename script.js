let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

function startQuiz(mode) {
    if (typeof questionBank === "undefined") {
        alert("The question bank hasn't been loaded yet!");
        return;
    }

    if (mode === "mcq") {
        currentQuestions = questionBank.mcq || [];
    } else if (mode === "tf") {
        currentQuestions = questionBank.tf || [];
    } else {
        currentQuestions = [
            ...(questionBank.mcq || []),
            ...(questionBank.tf || [])
        ];
    }

    if (currentQuestions.length === 0) {
        alert("No questions are available in this mode yet.");
        return;
    }

    currentIndex = 0;
    score = 0;

    homeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    answered = false;

    const question = currentQuestions[currentIndex];

    document.getElementById("question-text").textContent =
        question.question;

    document.getElementById("question-counter").textContent =
        `Question ${currentIndex + 1} of ${currentQuestions.length}`;

    document.getElementById("score-display").textContent =
        `Score: ${score}`;

    document.getElementById("progress-bar").style.width =
        `${(currentIndex / currentQuestions.length) * 100}%`;

    const optionsContainer =
        document.getElementById("options-container");

    optionsContainer.innerHTML = "";

    document.getElementById("feedback").textContent = "";

    document.getElementById("next-btn").classList.add("hidden");

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "option-btn";
        button.textContent = option;

        button.onclick = () => selectAnswer(index);

        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const question = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll(".option-btn");

    const correctIndex = question.options.findIndex(
        option => String(option).trim().toLowerCase() ===
        String(question.answer).trim().toLowerCase()
    );

    const correct = selectedIndex === correctIndex;

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === correctIndex) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && !correct) {
            button.classList.add("wrong");
        }
    });

    const feedback = document.getElementById("feedback");

    if (correct) {
        score++;

        feedback.textContent = "✓ Correct Answer!";
        feedback.style.color = "var(--green)";
    } else {
        feedback.textContent =
            `✗ Incorrect! Correct answer: ${question.answer}`;

        feedback.style.color = "var(--red)";
    }

    document.getElementById("score-display").textContent =
        `Score: ${score}`;

    document.getElementById("progress-bar").style.width =
        `${((currentIndex + 1) / currentQuestions.length) * 100}%`;

    document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion() {
    currentIndex++;

    if (currentIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    document.getElementById("final-score").textContent =
        `Your Score: ${score} / ${currentQuestions.length}`;

    const percentage = (score / currentQuestions.length) * 100;

    let message = "";

    if (percentage === 100) {
        message = "Perfect Score! Excellent work! 🏆";
    } else if (percentage >= 80) {
        message = "Excellent work! Keep it up! 🌟";
    } else if (percentage >= 60) {
        message = "Good job! Keep practicing! 💪";
    } else {
        message = "Keep studying. You can do better! 📚";
    }

    document.getElementById("result-message").textContent = message;
}

function goHome() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
      }
