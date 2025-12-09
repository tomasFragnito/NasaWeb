import { Nasa } from "./nasa.js";

const favsDiv = document.getElementById("favsDiv");

let targetScroll = 0;
let isAnimating = false;

document.addEventListener("DOMContentLoaded", () => {

    favsDiv.innerHTML = "";

    const favs = Nasa.getLocalStorage("fav"); 

    if (favs.length === 0) {
        favsDiv.innerHTML = "<p>No hay favoritos guardados.</p>";
        return;
    }

    // Recorrer y dibujar cada tarjeta
    favs.forEach(fav => {
        const nasa = new Nasa(fav.date, fav.explanation, fav.title, fav.img);
        nasa.createCard(favsDiv);
    });

});

favsDiv.addEventListener("wheel", (e) => {
    e.preventDefault();

    // Ajustá el multiplicador para más o menos velocidad
    targetScroll += e.deltaY * 1;

    if (!isAnimating) smoothScroll();
});

function smoothScroll() {
    isAnimating = true;

    favsDiv.scrollLeft += (targetScroll - favsDiv.scrollLeft) * 0.1;

    // Cuando se acerca al objetivo, terminamos la animación
    if (Math.abs(targetScroll - favsDiv.scrollLeft) < 0.5) {
        favsDiv.scrollLeft = targetScroll;
        isAnimating = false;
        return;
    }

    requestAnimationFrame(smoothScroll);
}