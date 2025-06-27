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
      musica.currentTime = 0;
    }, 983724982364000);
  } else {
    musica.pause();
    musica.currentTime = 0; // Reinicia la musica al pausar
  }
});
