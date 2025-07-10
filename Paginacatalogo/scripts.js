// const key = "AIzaSyDhckEbK6NojqgGq6i4FKJUQ53DDI9zuZI";
const key = "AIzaSyCivpuCvL77GaajRPsC7cjxVHKmedl6EFE"
window.onload = () =>{
const categoriasgenero = ["horror", "science fiction","fantasy","romance",
    "thrillers","adventure","drama","humor","computers","history"];
let ids = [];
let titulos=[];
let diccionario={};
let diccionario2={};
let keys;
let librosbuscados=[];
let librosiniciales=[];
const secciontarjetas = document.getElementById("secciontarjetas");
const seccionbusqueda = document.getElementById("tarjetasbusqueda");
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
        let clave = libro.selfLink;
        diccionario2[clave]=libro.volumeInfo.title.toLowerCase();
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
        // console.log(libro.id,libro.volumeInfo.imageLinks.thumbnail);
        console.log(libro.volumeInfo.categories);
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
                                <a href="/Pagina/Paginareseñas/reseñas.html" target="_blank" class="btn mt-2 botonoscuro botontarjeta">ver reseñas</a>
                            </div>`
        secciontarjetas.appendChild(tarjeta);

        const boton = tarjeta.querySelector(".circulo");
        const corazon = tarjeta.querySelector(".corazon");
        // se le agrega evento al boton donde esta el corazon
        boton.addEventListener("click", () => {
        if (corazon.style.color !== "red") {
            corazon.style.color = "red";
        } else {
            corazon.style.color = "rgb(125, 101, 82, 0.7)";
        }
        });
        // evento para guardar en localstorage informacion del libro
        const botontarjeta = tarjeta.querySelector(".botontarjeta");
        botontarjeta.addEventListener("click",()=>{
            localStorage.setItem("libro", libro.selfLink);
            localStorage.setItem("ids", libro.id);
            // console.log("Guardado en localStorage:", libro.selfLink);
            // let selflink=localStorage.getItem("libro");
            // console.log(selflink);
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

const busqueda = document.getElementById("busqueda");
busqueda.addEventListener("submit",(event) => {
    event.preventDefault();
    // limpio libros buscados
    librosbuscados.length = 0;

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
                titulos.push(titulo.toLowerCase());
                //se añade a diccionario
                let clave = libro.selfLink;
                diccionario[clave]=titulo.toLowerCase();
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
                                                <a href="/Pagina/Paginareseñas/reseñas.html" target="_blank" class="btn mt-2 botonoscuro botontarjeta">ver reseñas</a>
                                            </div>`;
                
                seccionbusqueda.appendChild(tarjeta);
                
                const boton = tarjeta.querySelector(".circulo");
                const corazon = tarjeta.querySelector(".corazon");
                // se le agrega evento al boton donde esta el corazon
                boton.addEventListener("click", () => {
                if (corazon.style.color !== "red") {
                    corazon.style.color = "red";
                } else {
                    corazon.style.color = "rgb(125, 101, 82, 0.7)";
                }
                });
                // evento para guardar en localstorage informacion del libro
                const botontarjeta = tarjeta.querySelector(".botontarjeta");
                botontarjeta.addEventListener("click",()=>{
                    localStorage.setItem("libro", libro.selfLink);
                    localStorage.setItem("ids", libro.id);
                    // console.log("Guardado en localStorage:", libro.selfLink);
                    // let selflink=localStorage.getItem("libro");
                    // console.log(selflink);
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
                
                // console.log(titulos);
                // console.log(diccionario);
    
                
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
                // console.log("llego a tarjetas");
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
                                            <a href="/Pagina/Paginareseñas/reseñas.html" target="_blank" class="btn mt-2 botonoscuro botontarjeta"">ver reseñas</a>
                                        </div>`;
                seccionbusqueda.appendChild(tarjeta);
                const boton = tarjeta.querySelector(".circulo");
                const corazon = tarjeta.querySelector(".corazon");
                // se le agrega evento al boton donde esta el corazon
                boton.addEventListener("click", () => {
                if (corazon.style.color !== "red") {
                    corazon.style.color = "red";
                } else {
                    corazon.style.color = "rgb(125, 101, 82, 0.7)";
                }
                });
                // evento para guardar en localstorage informacion del libro
                const botontarjeta = tarjeta.querySelector(".botontarjeta");
                botontarjeta.addEventListener("click",()=>{
                    localStorage.setItem("libro", data.selfLink);
                    localStorage.setItem("ids", libro.id);
                    // console.log("Guardado en localStorage:", libro.selfLink);
                    // let selflink=localStorage.getItem("libro");
                    // console.log(selflink);
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
                //   console.log(event.target.idioma.value);
                //   console.log(event.target.genero.value);
                //   console.log(event.target.orden.value); 
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
                // console.log("librosactuales:",librosactuales);
                seccionbusqueda.innerHTML="";
                //   console.log(link);
                let idioma = event.target.idioma.value;
                let genero = event.target.genero.value;
                let ordenar = event.target.orden.value;
                //  console.log(elemento);
                //  console.log(genero);
                // console.log(ordenar);

                //el usuario selecciono idioma/genero/orden combinados
                if(idioma!="" && genero != "seleccion" || idioma!="" && genero != "seleccion" && ordenar != "ordenar por" || genero != "seleccion" && ordenar != "ordenar por" || idioma!="" && ordenar != "ordenar por"){
                    //genero + orden
                    if(idioma!="" && genero != "seleccion" && ordenar != "ordenar por"){
                        console.log("idioma, seleccion y orden es dintinto de vacio");
                        let libroscoincidentes = {};
                        // keys.length = 0;
                        for(let libro of librosactuales){
                            if(idioma == libro.idioma && libro.categorias.includes(genero)){
                                let llave = libro.link;
                                libroscoincidentes[llave]=libro.titulo;
                            }
                        }
                        if (Object.keys(libroscoincidentes).length === 0) {
                            console.log("El objeto está vacío");
                            agregartexto();
                        }
                        else{
                            console.log(libroscoincidentes);
                            if(ordenar == "A-Z"){
                                ORDENAR(libroscoincidentes,"A-Z")
                            }
                            else if(ordenar == "Z-A"){
                                ORDENAR(libroscoincidentes,"Z-A")
                            }
                        }
                        

                    }
                    // idioma + genero
                    else if(idioma!="" && genero != "seleccion"){
                        console.log("idioma, seleccion es dintinto de vacio");
                        let libroscoincidentes = {};
                        for(let libro of librosactuales){
                            if(idioma == libro.idioma && libro.categorias.includes(genero)){
                                let llave = libro.link;
                                libroscoincidentes[llave]=libro.titulo;
                            }
                        }

                        if (Object.keys(libroscoincidentes).length === 0) {
                            console.log("El objeto está vacío");
                            agregartexto();
                        }
                        else{
                            for(let clave in libroscoincidentes){
                                tarjetas(clave);
                                console.log(clave);
                            }  
                        }
                    }
                    //genero + orden
                    else if(genero != "seleccion" && ordenar != "ordenar por"){
                        let libroscoincidentes = {};
                        // keys.length = 0;
                        for(let libro of librosactuales){
                            if(libro.categorias.includes(genero)){
                                let llave = libro.link;
                                libroscoincidentes[llave]=libro.titulo;
                            }
                        }
                        if (Object.keys(libroscoincidentes).length === 0) {
                            console.log("El objeto está vacío");
                            agregartexto();
                        }
                        else{
                            if(ordenar == "A-Z"){
                                ORDENAR(libroscoincidentes,"A-Z")
                            }
                            else if(ordenar == "Z-A"){
                                ORDENAR(libroscoincidentes,"Z-A")
                            }
                        }
                    }
                    //idioma + orden
                    else if(idioma!="" && ordenar != "ordenar por"){
                        let libroscoincidentes = {};
                        // keys.length = 0;
                        for(let libro of librosactuales){
                            if(idioma == libro.idioma){
                                let llave = libro.link;
                                libroscoincidentes[llave]=libro.titulo;
                            }
                        }
                        console.log(libroscoincidentes);
                        if (Object.keys(libroscoincidentes).length === 0) {
                            console.log("El objeto está vacío");
                            agregartexto();
                        }
                        else{
                            if(ordenar == "A-Z"){
                                ORDENAR(libroscoincidentes,"A-Z")
                            }
                            else if(ordenar == "Z-A"){
                                ORDENAR(libroscoincidentes,"Z-A")
                            }
                        }
                    }
                }
                //si solo eligio idioma
                else if (idioma!=""){
                    console.log("idioma");
                    let libroscoincidentes = {};
                    for(let libro of librosactuales){
                        if(idioma == libro.idioma){
                            let llave = libro.link;
                            libroscoincidentes[llave]=libro.titulo;
                        }  
                    }
                    if (Object.keys(libroscoincidentes).length === 0) {
                            console.log("El objeto está vacío");
                            agregartexto();
                    }
                    else{
                            for(let clave in libroscoincidentes){
                                tarjetas(clave);
                                console.log(clave);
                            }  
                    }

                }
                //si solo eligio genero
                else if(genero != "seleccion"){
                    console.log("seleccion es dintinto de vacio");
                    let libroscoincidentes = {};
                    for(let libro of librosactuales){
                        if(libro.categorias.includes(genero)){
                            let llave = libro.link;
                            libroscoincidentes[llave]=libro.titulo;
                        } 
                    }
                    if (Object.keys(libroscoincidentes).length === 0) {
                            console.log("El objeto está vacío");
                            agregartexto();
                    }
                    else{
                            for(let clave in libroscoincidentes){
                                tarjetas(clave);
                                console.log(clave);
                            }  
                    }
                }
                //si solo eligio ordenar
                else if (ordenar != "ordenar por"){
                    // console.log(keys);
                    if(ordenar == "A-Z"){
                        ORDENAR(diccionarioactual,"A-Z")
                    }
                    else if(ordenar == "Z-A"){
                        ORDENAR(diccionarioactual,"Z-A")
                    }
                }
                
             })
function ORDENAR(diccionario,ORDEN){
        //me entrega una lista con las claves del diccionario
        let items = Object.keys(diccionario).map(
        (key) => { return [key, diccionario[key]] });
        // list = [(llave,elemento)]
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
    secciontarjetas.classList.remove("d-none");
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
  window.location.href = "/Pagina/PaginaLogin/login.html";
}