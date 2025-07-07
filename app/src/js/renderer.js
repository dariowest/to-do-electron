document.getElementById("aniadir").addEventListener("click", aniadirAsignatura);
muestraAsignaturas()

function aniadirAsignatura(){
    let valor = document.getElementById("texto").value
    console.log(valor)
    let id = window.api.añadirAsignatura(valor)
    console.log(id)
    muestraAsignaturas()
}
function muestraAsignaturas() {
  let info = document.getElementById("info");
  info.innerHTML = ""; // Limpia contenido previo si quieres

  let asignaturas = window.api.obtenerAsignaturas();

  asignaturas.forEach(asignatura => {
    // Crear el artículo
    let article = document.createElement("article");

    // Crear el título
    let h3 = document.createElement("h3");
    h3.textContent = asignatura.nombre;
    console.log(asignatura.nombre)
    // Crear la imagen
    let img = document.createElement("img");
    img.src = "../../assets/folder/icons8-folder-144.png";
    img.alt = asignatura.nombre;

    // Añadir h3 e img al article
    article.appendChild(h3);
    article.appendChild(img);

    // Añadir article al contenedor info
    info.appendChild(article);
  });
}
