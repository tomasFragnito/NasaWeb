import { Nasa } from "./nasa.js";

const favsDiv = document.getElementById("favsDiv");

if (favsDiv) {
    let targetScroll = 0;
    let isAnimating = false;

    document.addEventListener("DOMContentLoaded", () => {

        favsDiv.innerHTML = "";

        const favs = Nasa.getLocalStorage("fav") || []; 

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
    // desplazamiento al hacer click en las flechas
    const scrollAmount = 300; // cantidad de px que se desplaza

    nextBtn.addEventListener("click", () => {
        favsDiv.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
        favsDiv.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
}

export function truncateText(text, maxLength = 490) {
    if (!text) return "";
    if(text.length > maxLength){
        return text.slice(0, maxLength) + "..."
    }
    else{
        return text;
    }
}