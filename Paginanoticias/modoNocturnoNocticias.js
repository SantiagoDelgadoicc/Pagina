const btnModo = document.getElementById("modoNocheBtn");
const musica = document.getElementById("musica");

let musicaTimeout; // variable para guardar el temporizador

btnModo.addEventListener("click", () => {
  document.body.classList.toggle("modo-noche");

  // Musica 
  if (document.body.classList.contains("modo-noche")) {
    musica.play();
    musicaTimeout = setTimeout(() => {
      musica.pause();
    }, 983724982364000);
  } 
  else {
    musica.pause();
  }
});