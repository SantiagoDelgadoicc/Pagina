const key = "AIzaSyDhckEbK6NojqgGq6i4FKJUQ53DDI9zuZI";
window.onload = () =>{
const categoriasgenero = ["horror", "science fiction","fantasy","romance",
    "thrillers","adventure","drama","humor","computers","history"];
let ids = [];
const secciontarjetas = document.getElementById("secciontarjetas");
for(let i = 0; i < 6; i++){
    let aleatorio = Math.random() * 10;
    aleatorio = Math.trunc(aleatorio);
    let eleccion = categoriasgenero[aleatorio];
    // console.log(eleccion);
    añadirtarjeta(eleccion);
}
function añadirtarjeta(eleccion){
     fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${eleccion}&maxResults=10&key=${key}`)
    .then(response => {
    if (!response.ok) throw new Error('No se pudieron obtener los datos');
      return response.json();
    })
     .then(data => {
        //ver la validacion por si descripcion e imagen no existe
        let libro;
        let encontrado = false;
        let intentos = 0;
        //si el libro no tiene ni imagen o desc que busque otro
        while (!encontrado && intentos < 100) {
                let n = Math.random() * data.items.length;
                n = Math.trunc(n);
                libro = data.items[n];
                if (!ids.includes(libro.id)) {//evita que el libro se repita
                    if (libro.volumeInfo.imageLinks.thumbnail && libro.volumeInfo.description) {
                        encontrado = true;
                        ids.push(libro.id);
                    }
                }
                intentos++;
        }
        //por si no encuentra libro despues de 100 intentos
        if (!encontrado) {
            console.log("no se encontro libro");
        }
        //si la descripcion es muy larga rellena al conal con puntos
        let descripcion = libro.volumeInfo.description;
        if (descripcion.length > 100) {
            descripcion = descripcion.substring(0, 100) + '...';
        }
        //creacion de la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card mx-3 p-0 mt-3 tarjeta';
        tarjeta.innerHTML = `<div class="posicioncirculo">
                                <button class="circulo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-heart-fill corazon" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                    </svg>
                                </button>
                            </div>

                            <img src=${libro.volumeInfo.imageLinks.thumbnail} class="card-img-top" height="280px" width="100%" alt="libro">
                            <div class="card-body tarjetacuerpo">
                                <p class="card-text mt-2 letraoscura">${descripcion}</p>
                                <a href="#" class="btn mt-2 botonoscuro id="botontarjeta">ver reseñas</a>
                            </div>`
        secciontarjetas.appendChild(tarjeta);
        

    })
     .catch(error => {
        console.error('Ocurrió un error:', error.message);
    });
    };

// console.log(ids);
}

