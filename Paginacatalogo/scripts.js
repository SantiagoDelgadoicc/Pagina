const key = "AIzaSyDhckEbK6NojqgGq6i4FKJUQ53DDI9zuZI";
// const key = "AIzaSyCivpuCvL77GaajRPsC7cjxVHKmedl6EFE"
window.onload = () =>{
const categoriasgenero = ["horror", "science fiction","fantasy","romance",
    "thrillers","adventure","drama","humor","computers","history"];
let ids = [];
let diccionariobuscados={};
let diccionarioinicial={};
let keys = [];
let librosbuscados=[];
let librosiniciales=[];
const secciontarjetas = document.getElementById("secciontarjetas");
const seccionbusqueda = document.getElementById("tarjetasbusqueda");
const masresultados = document.getElementById("masresultados");
const btnmasresultados = document.getElementById("mostrarmasresultados");
const regresar = document.getElementById("regresar");
//realiza las 9 tarjetas iniciales
for(let i = 0; i < 9; i++){
    let aleatorio = Math.random() * 10;
    aleatorio = Math.trunc(aleatorio);
    let eleccion = categoriasgenero[aleatorio];
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
                let numero = Math.random() * data.items.length;
                numero = Math.trunc(numero);
                libro = data.items[numero];
                if (!ids.includes(libro.id)) {
                    let existeimg=libro.volumeInfo.imageLinks? libro.volumeInfo.imageLinks.thumbnail : false;
                    let existedescripcion=libro.volumeInfo.description? libro.volumeInfo.description : false;
                    if (existeimg && existedescripcion) {
                        encontrado = true;
                        ids.push(libro.id);
                    }
                }
                intentos++;
        }
        //se agrega al diccionario2
        let descripcion = libro.volumeInfo.description;
        let imagen = libro.volumeInfo.imageLinks.thumbnail;
        let titulo = libro.volumeInfo.title? libro.volumeInfo.title : "sin titulo" ;

        if(titulo && libro.selfLink){
            let clave = libro.selfLink;
            diccionarioinicial[clave]=titulo.toLowerCase();
        }
        
        //por si no encuentra libro despues de 100 intentos
        if (!encontrado) {
            console.log("no se encontro libro");
        }

        estructuratarjeta(libro , secciontarjetas, descripcion,imagen,titulo);

        // se agrega a la lista de libros iniciales
         librosiniciales.push({
                 link: libro.selfLink,
                 idioma: libro.volumeInfo.language,
                 categorias: libro.volumeInfo.categories || [],
                 titulo: titulo,
                 descripcion: descripcion,
                 imagen: imagen
             });
        
    })
     .catch(error => {
        console.error('Ocurrió un error:', error.message);
    });
    };
    //indice por donde quiero que la api empiece
    let startindex = 0;
    //ultima consulta realizada por busqueda
    let ultimaconsulta = "";
    btnmasresultados.addEventListener("click", ()=>{
        librosbuscados.length = 0;
        diccionariobuscados = {};
        startindex += 40;
        seccionbusqueda.innerHTML="";
        const consulta = `${ultimaconsulta}${startindex}&maxResults=40&key=${key}`;
        añadirtarjetabusqueda(consulta);
    })
    const busqueda = document.getElementById("busqueda");
    busqueda.addEventListener("submit",(event) => {
        event.preventDefault();
        // limpio libros buscados
        librosbuscados.length = 0;
        diccionariobuscados = {};
        
        //limpio lo de la consulta anterior
        seccionbusqueda.innerHTML="";
        masresultados.classList.remove("d-none");

        startindex = 0;
        //trim me quita los espacios iniciales y finales
        const elemento=event.target.elementobusqueda.value.trim();
        const seleccion = event.target.selectorbusqueda.value;
        
        if(seleccion == "general"){
            ultimaconsulta = `https://www.googleapis.com/books/v1/volumes?q=${elemento}&startIndex=`;
        }
        else{
            ultimaconsulta = `https://www.googleapis.com/books/v1/volumes?q=${seleccion}:${elemento}&startIndex=`;
        }
        let consulta = `${ultimaconsulta}${startindex}&maxResults=40&key=${key}`;
             
        // console.log(consulta);
        añadirtarjetabusqueda(consulta);
    
})

function añadirtarjetabusqueda(consulta){
     fetch(consulta)
    .then(response => {
    if (!response.ok) throw new Error('No se pudieron obtener los datos');
      return response.json();
    })
     .then(data => {

        //oculto las tarjetas iniciales
        if(!secciontarjetas.classList.contains("d-none")){
            secciontarjetas.classList.add("d-none");
        }
    
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
                 let titulo = libro.volumeInfo.title? libro.volumeInfo.title : "sin titulo";
                
                //se añade a diccionario
                if(titulo && libro.selfLink){
                    let clave = libro.selfLink;
                    diccionariobuscados[clave]=titulo.toLowerCase();
                }

                const text = document.getElementById("texto");
                //si existe el texto lo elimino
                if(text){
                    text.remove();
                }
                estructuratarjeta(libro , seccionbusqueda, descripcion,imagen,titulo);
                
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
                let titulo = data.volumeInfo.title? data.volumeInfo.title : "sin titulo";
                estructuratarjeta(data , seccionbusqueda, descripcion,imagen,titulo);

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

function estructuratarjeta(libro,contenedor,descripcion,imagen,titulo){
    
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
                
                contenedor.appendChild(tarjeta);
                
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
                    diccionarioactual=diccionarioinicial;
                }
                else{
                    librosactuales=librosbuscados;
                    diccionarioactual=diccionariobuscados;
                }
                
                seccionbusqueda.innerHTML="";
                
                let idioma = event.target.idioma.value;
                let genero = event.target.genero.value;
                let ordenar = event.target.orden.value;
                //si el usuario decide solo ordenar
                if (ordenar != "ordenar por" && idioma == "" && genero == "seleccion") {
                    ORDENAR(diccionarioactual, ordenar);
                    return; 
                }

                const librosfiltrados = {};
                for (const libro of librosactuales) {
                    const IDIOMA = idioma == "" || libro.idioma === idioma;//true si idioma es vacio o idioma es igual a idioma del libro
                    const GENERO = genero == "seleccion" || libro.categorias.includes(genero);//true si no se selecciono genero y true si coincide genero
                    if (IDIOMA && GENERO){
                        librosfiltrados[libro.link] = libro.titulo;
                    }
                }

                // console.log("libros filtrados",librosfiltrados);

                if (Object.keys(librosfiltrados).length == 0) {
                    agregartexto(); 
                } 
                else if (ordenar != "ordenar por") {
                    ORDENAR(librosfiltrados, ordenar);
                } 
                else {
                    
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

        mostrarTarjetasOrdenadas(keys);

}
//para regresar al inicio con las tarjetas iniciales
regresar.addEventListener("click",()=>{
    seccionbusqueda.innerHTML="";
    librosbuscados.length = 0;
    diccionariobuscados = {};
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
