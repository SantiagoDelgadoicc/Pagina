// console.log(localStorage.getItem("verlibro"));
//link del libro
let selflink=localStorage.getItem("libro");
console.log(selflink);
//id del libro
let id=localStorage.getItem("ids");
console.log(id);
//obtengo el usuario que esta activo
let usuario = localStorage.getItem("usuarioActivo") || "anonimo";
console.log(usuario);

// const key = "AIzaSyDhckEbK6NojqgGq6i4FKJUQ53DDI9zuZI";
const key = "AIzaSyCivpuCvL77GaajRPsC7cjxVHKmedl6EFE"
window.onload = () =>{
    const imgtitulo = document.getElementById("imagentitulo");
    const desccomen = document.getElementById("descripcioncomentario");
    const masinformacion = document.getElementById("masinfo");
    const formulario = document.getElementById("Comentarios");
    const star = document.getElementsByClassName("estrella");
    const botonstar = document.getElementsByClassName("star");
    //realizo la consulta
    fetch(selflink)
    .then(response => {
    if (!response.ok) throw new Error('No se pudieron obtener los datos');
      return response.json();
    })
     .then(data => {
        let subtitulo = data.volumeInfo.subtitle? data.volumeInfo.subtitle : "" ;
        let titulo = data.volumeInfo.title;
        let descripcion = data.volumeInfo.description;
        let imagen = data.volumeInfo.imageLinks? data.volumeInfo.imageLinks.thumbnail : "img/libro no encontrado.png";
        let numeropag = data.volumeInfo.pageCount;
        let editorial = data.volumeInfo.publisher;
        let fechapubli = data.volumeInfo.publishedDate;
        let compraren = data.volumeInfo.canonicalVolumeLink; //link donde comprar para leer el libro(todavia no lo incorporo)

        //creacion de los diferentes contenidos
        //imagen + titulo + subtitulo
        const contenido = document.createElement('div');
        // tarjeta.className = 'card mx-3 p-0 mt-3 tarjeta';
        contenido.innerHTML = `<div class="row imagen_reseñas" style="margin-top: 100px;">
                                    <div class="col-6" style="display: flex; flex-direction: column; justify-content: center; align-items: center; ">
                                        <img src="${imagen}" alt="" width="300" height="400">
                                    </div>
                    
                                    <div class="col-6" style="display: flex; flex-direction: column; justify-content: end; ">
                                        <h1>${titulo}</h1>
                                        <h3>${subtitulo}</h3>
                                    </div>
                                </div>`
        imgtitulo.appendChild(contenido);

        //descripcion + numero de paginas + editorial + fecha publicacion
        const contenido2 = document.createElement('div');
        contenido2.innerHTML = `<div class="row mt-3 contenido2_reseñas" >
                                        <div class="col-6" >
                                            <div class="row mt-3 p-2">
                                                <h5>Descripcion</h5>
                                                <div class="overflow-auto p-2 descripcion_comentario" >
                                                    <p class="">${descripcion}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="col-6">
                                            <div class="row mt-3" >
                                                <h5>N° paginas</h5>
                                                <p>${numeropag}</p>
                                            </div>
                                            <div class="row">
                                                <h5>Editorial</h5>
                                                <p>${editorial}</p>
                                            </div>
                                            <div class="row">
                                                <h5>Fecha de publicacion</h5>
                                                <p>${fechapubli}</p>
                                            </div>
                                        </div>
                                </div>`
                                
        desccomen.appendChild(contenido2);

        
    })
     .catch(error => {
        console.error('Ocurrió un error:', error.message);
    });

    // let dato = {}
    // localStorage.setItem("librosdata",JSON.stringify(dato));
     console.log(localStorage.getItem("librosdata"));
     let contador=0;
     for(let i = 0; i < botonstar.length; i++){
         botonstar[i].addEventListener("click", (event)=>{
             event.preventDefault();
             let estado = star[i].classList.contains("activo");
             console.log(estado);
             if(!estado){
                 contador+=1;
                // console.log(contador);
                 star[i].classList.add("activo");
                 star[i].classList.remove("noactivo");
                 star[i].innerHTML = `<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>`
             }
             else{
                 contador-=1;
                 console.log(contador);
                 star[i].classList.remove("activo");
                 star[i].classList.add("noactivo");
                 star[i].innerHTML = `<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>`
             }
         })
     }
     console.log(contador);

    //obtengo los datos
     let libros= JSON.parse(localStorage.getItem("librosdata"));
     console.log(libros);

    //si el libro no existe en los datos se agrega y se comenta algo inicial
     if(!libros[id]){
            console.log(id,"no se encuentra en la lista")
            libros[id] = {
                comentarios:[
                {
                    "usuario" : "el rincon",
                    "texto": "¡Comparte tu opinión con respeto! Este espacio promueve el diálogo constructivo sobre literatura."
                }
                ]
            };
            localStorage.setItem("librosdata", JSON.stringify(libros));
     }
     console.log(localStorage.getItem("librosdata"));
     libros= JSON.parse(localStorage.getItem("librosdata"));

    //muestro los diferentes comentarios guardados en localstorage
       for(let i = 0; i < libros[id].comentarios.length; i++){
             let nombre = libros[id].comentarios[i].usuario;
             console.log(nombre);
             let texts = libros[id].comentarios[i].texto;
             console.log(texts)
             let nestrellas = libros[id].comentarios[i].estrella;
             let hora = libros[id].comentarios[i].hora;
             let fecha = libros[id].comentarios[i].fecha;
             let maxstar = 5;
             let estrellasHTML = '';
             for (let j = 0; j < nestrellas; j++) {
                 estrellasHTML += `
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star ms-2 estrellae" viewBox="0 0 16 16">
                         <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                     </svg>`;
            }
            if(nestrellas < maxstar){
                let diferencia = maxstar-nestrellas
                for (let j = 0; j < diferencia; j++) {
                 estrellasHTML += `
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star ms-2 estrellae" viewBox="0 0 16 16">
                         <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                     </svg>`;
                }
            }
            let botonbasura=``;
            if(nombre != "el rincon"){
                botonbasura += `<div class="col-1" style = "display:flex; justify-content: end ;">
                                            <button class = "botonbasura">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                </svg>
                                            </button>
                                            <div class = "d-none"> <p id="fecha">${fecha}</p> <p id="hora">${hora}</p></div>
                                        </div>`;
            }
            else{
                botonbasura += ``;
            }
             const contenido3 = document.createElement('div');
             contenido3.innerHTML = `<div class="row mt-3">
                                        <div class="col-11">
                                            <div style = "display:flex">
                                                <h6>${nombre}</h6>
                                                ${estrellasHTML}
                                            </div>
                                            <p>${texts}</p>
                                        </div>
                                        ${botonbasura}
                                    </div>`
             masinformacion.appendChild(contenido3);
            
      }

     const fecha = new Date(); 
    // console.log(fecha.toLocaleDateString()); 
    // console.log(fecha.toLocaleTimeString()); 
    // console.log(localStorage.getItem("librosdata"));

     //realizar comentario
     formulario.addEventListener("submit", (event) =>{
          event.preventDefault();
         //contenido del comentario
          let comentario_ = event.target.elements.coment.value;
          console.log(comentario_)
          let libros= JSON.parse(localStorage.getItem("librosdata"));

        //se agrega el nuevo comentario
          libros[id].comentarios.push({
             usuario : usuario,
             texto : comentario_,
             fecha : fecha.toLocaleDateString(),
             hora : fecha.toLocaleTimeString(),
             estrella: contador
          })

         //se "actualiza"/modifica libros
          localStorage.setItem("librosdata", JSON.stringify(libros));
          console.log(localStorage.getItem("libross"));

         //se resetea el formulario
          formulario.reset();

         //recarga la pagina para mostrar los cambios
          location.reload();
     })
     console.log(localStorage.getItem("librosdata"));
    // localStorage.removeItem("librosdata");

}
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  alert("Sesión cerrada correctamente");
  window.location.href = "/PaginaLogin/login.html";
}