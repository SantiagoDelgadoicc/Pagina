
function cargarFrase() {
    fetch('frases.json')
    .then(response => {
      if (!response.ok) throw new Error("No se pudo obtener la ubicacion");
      return response.json();
    })
    .then(frases => {
        const indice = Math.floor(Math.random() * frases.length);
        const frase = frases[indice];

        const fraseElement = document.getElementById('frase-literaria');
        const autorElement = document.getElementById('autor');

        fraseElement.textContent = `"${frase.texto}"`;
        autorElement.textContent = `— ${frase.autor}`;
    })
    .catch(error => {
        console.error('Error al cargar la frase:', error);
    });
}

window.onload = cargarFrase;