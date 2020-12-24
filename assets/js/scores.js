// either get scores from localstorage or set to empty array
var highscores = JSON.parse(window.localStorage.getItem("highscores")) || [];
console.log(highscores)
// sort highscores by score property in descending order
highscores.sort(function (a, b) {
  return b.score - a.score;
});
console.log(highscores)

highscores.forEach(function (score) {
  // create li tag for each high score
  var liTag = document.createElement("li");
  liTag.textContent = score.initials + " - score: " + score.score + " - time: " + score.time;

  // display on page
  var olEl = document.getElementById("highscores");
  olEl.appendChild(liTag);
});

document.getElementById("clear").addEventListener("click", function () {
  window.localStorage.removeItem("highscores");
  window.location.reload();
});
