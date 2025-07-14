const key = "AIzaSyDhckEbK6NojqgGq6i4FKJUQ53DDI9zuZI";
// const key = "AIzaSyCivpuCvL77GaajRPsC7cjxVHKmedl6EFE"
window.onload = () =>{
const categoriasgenero = ["horror", "science fiction","fantasy","romance",
    "thrillers","adventure","drama","humor","computers","history"];
let ids = [];
let diccionario={};
let diccionario2={};
let keys = [];
let librosbuscados=[];
let librosiniciales=[];
const secciontarjetas = document.getElementById("secciontarjetas");
const seccionbusqueda = document.getElementById("tarjetasbusqueda");
const masresultados = document.getElementById("masresultados");
const btnmasresultados = document.getElementById("mostrarmasresultados");
const regresar = document.getElementById("regresar");

for(let i = 0; i < 9; i++){
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
                if (!ids.includes(libro.id)) {
                    let existeimg=libro.volumeInfo.imageLinks? libro.volumeInfo.imageLinks.thumbnail : false;
                    if (existeimg && libro.volumeInfo.description) {
                        encontrado = true;
                        ids.push(libro.id);
                    }
                }
                intentos++;
        }
        //se agrega al diccionario2

        if(libro.volumeInfo.title && libro.selfLink){
                    let clave = libro.selfLink;
                    diccionario2[clave]=libro.volumeInfo.title.toLowerCase();
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
        // console.log(libro.volumeInfo.categories);
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
                                <h5>${libro.volumeInfo.title}</h5>
                                <p class="card-text mt-2 letraoscura">${descripcion}</p>
                                <a href="/Pagina/Paginareseñas/reseñas.html" class="btn mt-2 botonoscuro botontarjeta">ver reseñas</a>
                            </div>`
        secciontarjetas.appendChild(tarjeta);

        const boton = tarjeta.querySelector(".circulo");
        const corazon = tarjeta.querySelector(".corazon");
        // se le agrega evento al boton donde esta el corazon
        agregarfavorito(boton, corazon, libro);
        // evento para guardar en localstorage informacion del libro
        const botontarjeta = tarjeta.querySelector(".botontarjeta");
        botontarjeta.addEventListener("click",()=>{
            localStorage.setItem("libro", libro.selfLink);
            localStorage.setItem("ids", libro.id);
        });
        // se agrega a la lista de libros iniciales
         librosiniciales.push({
                 link: libro.selfLink,
                 idioma: libro.volumeInfo.language,
                 categorias: libro.volumeInfo.categories || [],
                 titulo: libro.volumeInfo.title,
                 descripcion: descripcion,
                 imagen: libro.volumeInfo.imageLinks.thumbnail
             });
        
    })
     .catch(error => {
        console.error('Ocurrió un error:', error.message);
    });
    };
    
    let startIndex = 0;
    let ultimaConsulta = "";
    btnmasresultados.addEventListener("click", ()=>{
        librosbuscados.length = 0;
        diccionario = {};
        startIndex += 40;
        seccionbusqueda.innerHTML="";
        const consulta = `${ultimaConsulta}${startIndex}&maxResults=40&key=${key}`;
        añadirtarjetabusqueda(consulta);
    })
    const busqueda = document.getElementById("busqueda");
    busqueda.addEventListener("submit",(event) => {
        event.preventDefault();
        // limpio libros buscados
        librosbuscados.length = 0;
        diccionario = {};
        
        //limpio lo de la consulta anterior
        seccionbusqueda.innerHTML="";
        masresultados.classList.remove("d-none");

        let startIndex = 0;

        const elemento=event.target.elementobusqueda.value.trim();
        const filtro = event.target.selectorbusqueda.value;
        console.log(filtro);
        console.log(elemento);
        
        if(filtro == "general"){
            ultimaConsulta = `https://www.googleapis.com/books/v1/volumes?q=${elemento}&startIndex=`;
        }
        else{
            ultimaConsulta = `https://www.googleapis.com/books/v1/volumes?q=${filtro}:${elemento}&startIndex=`;
        }
        let consulta = `${ultimaConsulta}${startIndex}&maxResults=40&key=${key}`;
             
        console.log(consulta);
        añadirtarjetabusqueda(consulta);
    
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
        if(!secciontarjetas.classList.contains("d-none")){
            secciontarjetas.classList.add("d-none");
        }
        // let libro = data.items[n];
        //si el total de item es cero no hay coincidencias
        if (data.totalItems == 0){
            console.log("no hay datos");
            agregartexto();

        }
        else{
            //recorro items mostrando cada libro
            for(let i = 0; i < data.items.length; i++){
                let libro=data.items[i];
                let descripcion = libro.volumeInfo.description;
                let imagen = libro.volumeInfo.imageLinks? libro.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
                let titulo = libro.volumeInfo.title;
                // console.log(titulo);
                //se añade a diccionario
                if(titulo && libro.selfLink){
                    let clave = libro.selfLink;
                    diccionario[clave]=titulo.toLowerCase();
                }
                //console.log(libro.volumeInfo.categories);

                const text = document.getElementById("texto");
                //si existe el texto lo elimino
                if(text){
                    text.remove();
                }
    
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
                                                <a href="/Pagina/Paginareseñas/reseñas.html" class="btn mt-2 botonoscuro botontarjeta">ver reseñas</a>
                                            </div>`;
                
                seccionbusqueda.appendChild(tarjeta);
                
                const boton = tarjeta.querySelector(".circulo");
                const corazon = tarjeta.querySelector(".corazon");
                // se le agrega evento al boton donde esta el corazon
                agregarfavorito(boton, corazon, libro);
                // evento para guardar en localstorage informacion del libro
                const botontarjeta = tarjeta.querySelector(".botontarjeta");
                botontarjeta.addEventListener("click",()=>{
                    localStorage.setItem("libro", libro.selfLink);
                    localStorage.setItem("ids", libro.id);

                });
                // se agrega a la lista de libros buscados
                librosbuscados.push({
                    link: libro.selfLink,
                    idioma: libro.volumeInfo.language,
                    categorias: libro.volumeInfo.categories || [],
                    titulo: titulo,
                    descripcion: descripcion,
                    imagen: imagen
                });
               
                }
  
            }
        }
    
    )
     .catch(error => {
        console.error('Ocurrió un error:', error.message);
    });
}

    function tarjetas(link){
        return fetch(link)
            .then(response => {
            if (!response.ok) throw new Error('No se pudieron obtener los datos');
            return response.json();
            })
            .then(data => {
                //si las tarjetas iniciales no estan ocultas las oculto
                if(!secciontarjetas.classList.contains("d-none")){
                    secciontarjetas.classList.add("d-none");
                }
                const text = document.getElementById("texto_filtro");
                //si existe el texto lo elimino
                if(text){
                    text.remove();
                }
                let descripcion = data.volumeInfo.description;
                let imagen = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
                let titulo = data.volumeInfo.title;
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
                                            <a href="/Pagina/Paginareseñas/reseñas.html" class="btn mt-2 botonoscuro botontarjeta"">ver reseñas</a>
                                        </div>`;
                seccionbusqueda.appendChild(tarjeta);
                const boton = tarjeta.querySelector(".circulo");
                const corazon = tarjeta.querySelector(".corazon");
                // se le agrega evento al boton donde esta el corazon
                console.log(data);
                agregarfavorito(boton, corazon, data);
                // evento para guardar en localstorage informacion del libro
                const botontarjeta = tarjeta.querySelector(".botontarjeta");
                botontarjeta.addEventListener("click",()=>{
                    localStorage.setItem("libro", data.selfLink);
                    localStorage.setItem("ids", data.id);
                });

                })
            .catch(error => {
                console.error('Ocurrió un error:', error.message);
            });
    }

//necesito esperar la respuesta antes de colocar la tarjeta al momento de ordenarlas
async function mostrarTarjetasOrdenadas(keys) {
    for (let link of keys) {
        try {
            await tarjetas(link);
        } catch (error) {
            console.error("Error", error.message);
        }
    }
}

    const formulariofiltro = document.getElementById("filtros");
        formulariofiltro.addEventListener("submit",(event) => {
                 event.preventDefault();
                let librosactuales;
                let diccionarioactual;
                console.log("libros de busqueda:",librosbuscados);
                console.log("libros iniciales:",librosiniciales);
                //si el tamaño de libros buscados es 0 significa que estoy en libros iniciales
                if(librosbuscados.length ==0){
                    librosactuales=librosiniciales;
                    diccionarioactual=diccionario2;
                }
                else{
                    librosactuales=librosbuscados;
                    diccionarioactual=diccionario;
                }
                
                seccionbusqueda.innerHTML="";
                
                let idioma = event.target.idioma.value;
                let genero = event.target.genero.value;
                let ordenar = event.target.orden.value;
            
                if (ordenar !== "ordenar por" && !idioma && genero === "seleccion") {
                    ORDENAR(diccionarioactual, ordenar);
                    return; 
                }

                const librosfiltrados = {};
                for (const libro of librosactuales) {
                    const cumpleIdioma = !idioma || libro.idioma === idioma;
                    const cumpleGenero = genero === "seleccion" || libro.categorias.includes(genero);
                    if (cumpleIdioma && cumpleGenero){
                        librosfiltrados[libro.link] = libro.titulo;
                    }
                }

                if (Object.keys(librosfiltrados).length === 0) {
                    agregartexto(); 
                } 
                else if (ordenar !== "ordenar por") {
                    ORDENAR(librosfiltrados, ordenar);
                } 
                else {
                    // Mostrar sin ordenar (solo filtros)
                    for (const clave in librosfiltrados){
                        tarjetas(clave);
                    }
                }
                
                
             })
function ORDENAR(diccionario,ORDEN){
        //me entrega una lista con las claves del diccionario
        let items = Object.keys(diccionario).map(
        (key) => { return [key, diccionario[key]] });
        
        //compara los titulos de los diferentes posiciones
        items.sort(
            (first, second) => {
                    return first[1].localeCompare(second[1]);
            }
        );
        // si la opcion es al reves
        if(ORDEN == "Z-A"){
            items.reverse();
        }
        //me entrega una lista con las llaves en posicion ordenada
        keys = items.map(
        (e) => { return e[0] });

        // console.log(keys)
        mostrarTarjetasOrdenadas(keys);

}
//para regresar al inicio con las tarjetas iniciales
regresar.addEventListener("click",()=>{
    seccionbusqueda.innerHTML="";
    librosbuscados.length = 0;
    diccionario = {};
    secciontarjetas.classList.remove("d-none");
    masresultados.classList.add("d-none");
})
//agrega texto cuando no hay resultados
function agregartexto(){
    //si las tarjetas iniciales no estan ocultas las oculto
    if(!secciontarjetas.classList.contains("d-none")){
            secciontarjetas.classList.add("d-none");
    }
    const texto = document.createElement('p');
    texto.className = 'p-0 mt-3 texto_';
    texto.id = "texto_filtro";
    texto.innerHTML = `No hay resultados de busqueda`;
    seccionbusqueda.appendChild(texto);
}
}

//cerrar sesion
  function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  alert("Sesión cerrada correctamente");
  window.location.href = "/PaginaLogin/login.html";
}
//guardar libro en favorito
function agregarfavorito(boton, corazon, libro) {
  boton.addEventListener("click", () => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    if (!usuarioActivo) {
      alert("Debes iniciar sesión para guardar libros.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const user = users[usuarioActivo];
    if (!user) return;

    const libroFavorito = {
      link: libro.selfLink,
      titulo: libro.volumeInfo?.title || "Título no disponible",
      imagen: libro.volumeInfo?.imageLinks?.thumbnail || "img/libro no encontrado.png",
      descripcion: libro.volumeInfo?.description || "Descripción no disponible"
    };

    const yaGuardado = user.favoritos.some(fav => fav.link === libroFavorito.link);

    if (!yaGuardado) {
      user.favoritos.push(libroFavorito);
      corazon.style.color = "red";
    } else {
      user.favoritos = user.favoritos.filter(fav => fav.link !== libroFavorito.link);
      corazon.style.color = "rgb(125, 101, 82, 0.7)";
    }

    users[usuarioActivo] = user;
    localStorage.setItem("users", JSON.stringify(users));
  });
}
