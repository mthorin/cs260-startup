function logout() {
  localStorage.setItem("userName", null);
  //Game data will be pulled from database before being stored in the local storage
  localStorage.setItem("games", null);
  //window.location.href = "select.html";
}
