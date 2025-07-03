const noticiasContainer = document.getElementById('favoritos');
const ApiKey = 'AIzaSyCcbdlLcf8QQuJ7ssfh2ksmr1XRk1gHAo8';

fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${eleccion}&maxResults=10&key=${Apikey}`)
  .then(res => res.json())
  .then(data => {
    const favoritos = data.response.results;
    favoritos.forEach(favoritos => {
      const div = document.createElement('div');
      div.classList.add('col-md-4', 'mb-4');

      div.innerHTML = `<div class="posicioncirculo">
                                            <button class="circulo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <img src="${imagen}" class="card-img-top" height="280px" width="100%" alt="libro">
                                        <div class="card-body tarjetacuerpo">
                                            <h5>${titulo}</h5>
                                            <p class="card-text mt-2 letraoscura">${descripcion}</p>
                                            <a href="#" class="btn mt-2 botonoscuro id="botontarjeta">ver reseñas</a>
                                        </div>`;
      favoritosContainer.appendChild(div);
    });
  })
  .catch(err => {
    favoritosContainer.innerHTML = '<p class="text-danger">Error al cargar tus favoritos.</p>';
    console.error(err);
  });
    const boton = tarjeta.querySelector(".circulo");
    const corazon = tarjeta.querySelector(".basura");

    boton.addEventListener("click", () => {
    if (corazon.style.color !== "red") {
        corazon.style.color = "red";
    } else {
        corazon.style.color = "rgb(125, 101, 82, 0.7)";
    }
    });        