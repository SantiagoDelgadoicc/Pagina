
window.onload = () => {
  const mapaContenedor = document.getElementById("mapaContenedor");
  const infoUbicacion = document.getElementById("infoUbicacion");


  const libros = [
    { pais: "Francia", coordenadas: [48.8566, 2.3522], titulo: "El Principito", autor: "Antoine de Saint-Exupéry" },
    { pais: "Chile", coordenadas: [-33.4489, -70.6693], titulo: "La casa de los espíritus", autor: "Isabel Allende" },
    { pais: "Japón", coordenadas: [35.6895, 139.6917], titulo: "Tokio Blues", autor: "Haruki Murakami" },
    { pais: "Colombia", coordenadas: [4.710989, -74.072092], titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
    { pais: "España", coordenadas: [40.416775, -3.70379], titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes" }
  ];

  fetch("https://api.geoapify.com/v1/ipinfo?apiKey=4de04ea914184d1380005995b6c9aac8")
    .then(response => {
      if (!response.ok) throw new Error("No se pudo obtener la ubicacion");
      return response.json();
    })
    .then(data => {

      const mapa = L.map(mapaContenedor).setView([0, 0], 2); // vista global
      

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapa);

      libros.forEach(libro => {
        L.marker(libro.coordenadas)
          .addTo(mapa)
          .bindPopup(`
            <strong>${libro.titulo}</strong><br>
            ${libro.autor}<br>
            <em>${libro.pais}</em>
          `);
      });
    })
    .catch(error => {
      console.error("Error al obtener la ubicacion:", error);
      infoUbicacion.innerHTML = `<li class="list-group-item text-danger">No se pudo obtener la ubicación</li>`;
    });
};