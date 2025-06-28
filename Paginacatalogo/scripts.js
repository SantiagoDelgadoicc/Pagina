// const key = "AIzaSyDhckEbK6NojqgGq6i4FKJUQ53DDI9zuZI";
const key = "AIzaSyCivpuCvL77GaajRPsC7cjxVHKmedl6EFE"
window.onload = () =>{
const categoriasgenero = ["horror", "science fiction","fantasy","romance",
    "thrillers","adventure","drama","humor","computers","history"];
let ids = [];
let busquedalibro = [];
const secciontarjetas = document.getElementById("secciontarjetas");
const seccionbusqueda = document.getElementById("tarjetasbusqueda");

for(let i = 0; i < 9; i++){
    let aleatorio = Math.random() * 10;
    aleatorio = Math.trunc(aleatorio);
    let eleccion = categoriasgenero[aleatorio];
    // console.log(eleccion);
    //añadirtarjeta(eleccion);
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
                if (!ids.includes(libro.id)) {
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

const busqueda = document.getElementById("busqueda");
busqueda.addEventListener("submit",(event) => {
    event.preventDefault();
    //limpio lo de la consulta anterior
    seccionbusqueda.innerHTML="";
    // console.log(event.target.elementobusqueda.value);
    // console.log(event.target.buscarpor.value);
    //obtengo lo que se quiere buscar
    const elemento=event.target.elementobusqueda.value;
    console.log(elemento);
    
    let consulta_ = `https://www.googleapis.com/books/v1/volumes?q=${elemento}&maxResults=20&key=${key}`
    console.log(consulta_);
    añadirtarjetabusqueda(consulta_);
    
})

function añadirtarjetabusqueda(consulta){
     fetch(consulta)
    .then(response => {
    if (!response.ok) throw new Error('No se pudieron obtener los datos');
      return response.json();
    })
     .then(data => {
        // console.log(data.items.length);
        //oculto las tarjetas iniciales
        secciontarjetas.classList.add("d-none");
        // let libro = data.items[n];
        let max=9;
        let cont =0;
        for(let i = 0; i < data.items.length; i++){
            let libro=data.items[i];
            let descripcion = libro.volumeInfo.description;
            let imagen = libro.volumeInfo.imageLinks? libro.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
            if(descripcion){
                        //si tiene descripcion...
                if (descripcion.length > 100) {
                    descripcion = descripcion.substring(0, 100) + '...';
                }

            }else{
                        //en caso contrario
                        descripcion="N/A";
            }
            const tarjeta = document.createElement('div');
            tarjeta.className = 'card mx-3 p-0 mt-3 tarjeta';
            tarjeta.innerHTML = `<div class="posicioncirculo">
                                            <button class="circulo">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-heart-fill corazon" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <img src="${imagen}" class="card-img-top" height="280px" width="100%" alt="libro">
                                        <div class="card-body tarjetacuerpo">
                                            <h5>${libro.volumeInfo.title}</h5>
                                            <p class="card-text mt-2 letraoscura">${descripcion}</p>
                                            <a href="#" class="btn mt-2 botonoscuro id="botontarjeta">ver reseñas</a>
                                        </div>`;
            seccionbusqueda.appendChild(tarjeta);
            if (libro.volumeInfo.categories){
                aplicarfiltro(libro.volumeInfo.categories,libro.selfLink,libro.volumeInfo.language);
            }
           
            }
            
        }

    
    )
     .catch(error => {
        console.error('Ocurrió un error:', error.message);
    });
}

function aplicarfiltro(elemento,link,lenguaje){
    const formulariofiltro = document.getElementById("filtros");
    formulariofiltro.addEventListener("submit",(event) => {
             event.preventDefault();
            //   console.log(event.target.idioma.value);
            //   console.log(event.target.genero.value);
            //   console.log(event.target.orden.value); 
            seccionbusqueda.innerHTML="";
            //   console.log(link);
            let idioma = event.target.idioma.value;
            let genero = event.target.genero.value;
            //  console.log(elemento);
            //  console.log(genero);
            fetch(link)
            .then(response => {
            if (!response.ok) throw new Error('No se pudieron obtener los datos');
            return response.json();
            })
            .then(data => {
                //    console.log(data.volumeInfo.language);
                   //console.log(data.volumeInfo.categories.includes(genero));
                //    console.log(elemento.includes(genero));
                   if(idioma!="" && genero != "seleccion"){
                    console.log("idioma y seleccion es dintinto de vacio");
                    if(idioma === lenguaje && elemento.includes(genero) === true){
                        console.log(lenguaje);
                        console.log(link);
                        console.log(elemento);
                        let descripcion = data.volumeInfo.description;
                        let imagen = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
                        let titulo = data.volumeInfo.title
                        tarjetas(descripcion,imagen,titulo);
                     }
                    
                   }else if (idioma!=""){
                    console.log("idioma");
                    if(idioma === lenguaje){
                        console.log("idioma es dintinto de vacio");
                        console.log(lenguaje);
                        console.log(link);
                        let descripcion = data.volumeInfo.description;
                        let imagen = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
                        let titulo = data.volumeInfo.title
                        tarjetas(descripcion,imagen,titulo);
                        
                     }
                   }
                   else if(genero != "seleccion"){
                    if(elemento.includes(genero) === true){
                        console.log("seleccion es dintinto de vacio");
                        // console.log(lenguaje);
                        console.log(link);
                        console.log(elemento);
                        let descripcion = data.volumeInfo.description;
                        let imagen = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
                        let titulo = data.volumeInfo.title
                        tarjetas(descripcion,imagen,titulo);
                     }
                   }
                   
                })
            .catch(error => {
                console.error('Ocurrió un error:', error.message);
            });

         })
    
    
    }

    function tarjetas(descripcion,imagen,titulo){
        if(descripcion){
                 //si tiene descripcion...
                if (descripcion.length > 100) {
                descripcion = descripcion.substring(0, 100) + '...';
                }

        }else{
            //en caso contrario
            descripcion="N/A";
        }
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card mx-3 p-0 mt-3 tarjeta';
        tarjeta.innerHTML = `<div class="posicioncirculo">
                            <button class="circulo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-heart-fill corazon" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                </svg>
                            </button>
                            </div>
                                <img src="${imagen}" class="card-img-top" height="280px" width="100%" alt="libro">
                                <div class="card-body tarjetacuerpo">
                                    <h5>${titulo}</h5>
                                    <p class="card-text mt-2 letraoscura">${descripcion}</p>
                                    <a href="#" class="btn mt-2 botonoscuro id="botontarjeta">ver reseñas</a>
                                </div>`;
        seccionbusqueda.appendChild(tarjeta);
    }
}
//aun falta aplicar filtros
//verificar las consultas seguir validando
//quiero colocar titulo a las tarjetas
//limpiar codigo