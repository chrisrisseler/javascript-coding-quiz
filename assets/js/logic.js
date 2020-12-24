// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var startScreen = document.getElementById("start-screen")
var questionTitle = document.getElementById("question-title")
var endScreen = document.getElementById("end-screen")
var finalScore = document.getElementById("final-score")
var userScore = document.getElementById("userScore")

score = 0
userScore.textContent = score

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
  startScreen.style.display = "none";
  // un-hide questions section
  questionsEl.style.display = "block";
  // start timer
  clockTick();
  // show starting time

  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  questionTitle.textContent = currentQuestion.title;
  // clear out any old question choices
  choicesEl.innerHTML = ""
  // loop over choices
  currentQuestion.choices.forEach(function (choice, i) {
    // create new button for each choice
    var questionButton = document.createElement("button")
    questionButton.textContent = currentQuestion.choices[i]
    questionButton.setAttribute("onclick", "questionClick(event)")

    choicesEl.appendChild(questionButton)

  });
}




function questionClick(event) {
  // check if user guessed wrong
  console.log(event)
  if (event.currentTarget.innerHTML !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 20;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time + " seconds";
    // play "wrong" sound effect
    sfxWrong.play()
    feedbackEl.textContent = "Wrong!";
  } else {
    // play "right" sound effect
    sfxRight.play();
    feedbackEl.textContent = "Correct!";
    score++;
    userScore.textContent = score;
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function () {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++;
  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen
  endScreen.style.display = "block";
  // show final score

  // hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {

  timerId = setInterval(function () {
    if (time > 1) {
      timerEl.textContent = time + " seconds";
      time--;
    }
    else if (time === 1) {
      timerEl.textContent = time + "second";
      time--;
    }
    else if (time <= 0) {
      time = 0;
      timerEl.textContent = time;
      quizEnd();
    }
    else {
      timerEl.textContent = ""
      clearInterval(timerId)
    }
  }, 1000);

}


function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value;
  console.log(initials)
  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];


    // format new score object for current user
    var newScore = {
      score,
      time,
      initials,
    };

    highscores.push(newScore)

    // save to localstorage
    window.localStorage.setItem("highscores", JSON.stringify(highscores))
    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.addEventListener("click", saveHighscore);

// user clicks button to start quiz
startBtn.addEventListener("click", startQuiz);

initialsEl.addEventListener("onkeyup", checkForEnter);
