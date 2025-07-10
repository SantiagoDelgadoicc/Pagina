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
    const formulario = document.getElementById("Comentarios")
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
        contenido.innerHTML = `<div class="row" style="margin-top: 100px;">
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
        contenido2.innerHTML = `<div class="row mt-3" style="background-color:#a18e6c; border-radius: 5px; ">
                                        <div class="col-6" >
                                            <div class="row mt-3 p-2">
                                                <h5>Descripcion</h5>
                                                <div class="overflow-auto p-3" style="max-height: 200px; background-color:#a18e6c">
                                                    <p>${descripcion}</p>
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

    //let dato = {}
    //localStorage.setItem("librosdata",JSON.stringify(dato));
    // console.log(localStorage.getItem("librosdata"));

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
    // libros= JSON.parse(localStorage.getItem("librosdata"));

    //muestro los diferentes comentarios guardados en localstorage
      for(let i = 0; i < libros[id].comentarios.length; i++){
            let nombre = libros[id].comentarios[i].usuario;
            console.log(nombre);
            let texts = libros[id].comentarios[i].texto;
            console.log(texts)
            
            const contenido3 = document.createElement('div');
            contenido3.innerHTML = `<div class="row mt-3">
                                                    <h6>${nombre}</h6>
                                                    <p>${texts}</p>
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
         let comentario_ = event.target.coment.value;
         console.log(comentario_)
        //  let libros= JSON.parse(localStorage.getItem("librosdata"));

        //se agrega el nuevo comentario
         libros[id].comentarios.push({
            usuario : usuario,
            texto : comentario_,
            fecha : fecha.toLocaleDateString(),
            hora : fecha.toLocaleTimeString()
         })

         //se "actualiza"/modifica libros
         localStorage.setItem("librosdata", JSON.stringify(libros));
         // console.log(localStorage.getItem("libross"));

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
  window.location.href = "/Pagina/PaginaLogin/login.html";
}