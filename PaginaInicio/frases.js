
function cargarFrase() {
    fetch('frases.json')
    .then(response => {
      if (!response.ok) throw new Error("No se pudo obtener la frase");
      return response.json();
    })
    .then(frases => {
        const indice = Math.floor(Math.random() * frases.length); //busco un indice aleatorio
        const frase = frases[indice]; // selecciono el indice

        const mostrar_frase = document.getElementById('frase-literaria');
        const mostrar_autor = document.getElementById('autor');

        mostrar_frase.textContent = `"${frase.texto}"`;
        mostrar_autor.textContent = `— ${frase.autor}`;
    })
    .catch(error => {
        console.error('Error al cargar la frase:', error);
    });
}

cargarFrase(); // llamar a la funcion al cargar la pagina
