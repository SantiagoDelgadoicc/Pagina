const contenedor= document.getElementById("contenedor_libros");

fetch("")
    .then(response => {
      if (!response.ok) throw new Error("No se pudo obtener la ubicación");
      return response.json();
    })
    .then(data => {
        const libros = data.libros; 
        libros.forEach(libro => {
            const informacion =
            const titulo=
            const imagen =

            const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${imagen}" ">
                    <h3>${titulo}</h3>
                `;
                contenedor.appendChild(card);
                });
            })
    .catch(error => {
    contenedor.innerHTML = `<p>Error al cargar los libros: ${error.message}</p>`;
  });