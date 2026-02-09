import { Nasa } from "./nasa.js";

const inputDate = document.getElementById("inputDate");
const btnSearch = document.getElementById("btnSearch");

const dataNasa = document.getElementById("dataNasa");
const dataNasaImg = document.getElementById("dataNasaImg");

const loaderWrapper = document.getElementById("loaderWrapper");

const textSelectDate = document.createElement("h3");

btnSearch.addEventListener("click", searchNasa);

function showLoader() {
    loaderWrapper.classList.remove("hidden");
}

function hideLoader() {
    loaderWrapper.classList.add("hidden");
}

function hideData() {
    dataNasa.classList.add("hiddenData");
    dataNasaImg.classList.add("hiddenData");
}

function showData() {
    dataNasa.classList.remove("hiddenData");
    dataNasaImg.classList.remove("hiddenData");
}


document.addEventListener("DOMContentLoaded", async () => {

    //limita la fecha a eleccion
    const today = new Date().toISOString().split("T")[0];
    inputDate.setAttribute("max", today);

    const last = Nasa.getLocalStorage("lastNasa");

    showLoader(); //loader ON
    hideData();

    const divInputs = document.getElementById("inputH3");

    if (last === null) {
        // primera vez sin datos
        textSelectDate.textContent = "Select a Date";
        divInputs.append(textSelectDate);

    } else {

        const nasa = new Nasa(last.date, last.explanation, last.title, last.img);

        inputDate.value = last.date;
        nasa.createHtml("dataNasa");
    }

    hideLoader();
    showData();
});

async function searchNasa() {
    showLoader(); //loader ON
    hideData();

    textSelectDate.remove();

    const nasa = await Nasa.getDataImg(inputDate.value);
    Nasa.setLocalStorage("lastNasa", nasa); //busca el ultimo guardado

    nasa.createHtml("dataNasa");

    hideLoader(); //loader OFF
    showData();
}
