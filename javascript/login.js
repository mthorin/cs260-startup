const Games = [
  { opp: "Tim", yourTurn: true },
  { opp: "Hannah", yourTurn: false },
  { opp: "Billy", yourTurn: true}
];

function login() {
  const nameEl = document.querySelector("#name");
  localStorage.setItem("userName", nameEl.value);
  //Game data will be pulled from database before being stored in the local storage
  localStorage.setItem("games", JSON.stringify(Games));
  //window.location.href = "select.html";
}
