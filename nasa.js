const API_KEY = "bjlBogwWksDenq5vC2Aj3Ft4afGccbxN0hNa7f40";

export class Nasa{
    constructor(date,explanation,title,img){
        this.date = date;
        this.explanation = explanation;
        this.title = title;
        this.img = img;
        this.fav = false;
    }

    createHtml(iDdiv){
        const dataNasa = document.getElementById(iDdiv);

        dataNasa.innerHTML = "";

        const date = document.createElement("p");
        date.textContent = this.date;

        const explanation = document.createElement("p");
        explanation.textContent = this.explanation;

        const title = document.createElement("h3");
        title.textContent = this.title;

        const btnAddFav = document.createElement("button");
        btnAddFav.classList.add("btnAddFav");
        
        if (Nasa.isInFav(this.date)) {
            btnAddFav.textContent = "Added";
            btnAddFav.disabled = true;
            btnAddFav.classList.add("disabled");
        } else {
            btnAddFav.textContent = "Add fav";
        }

        btnAddFav.addEventListener("click", () => {
            const added = this.addFav();

            if (added) {
                btnAddFav.disabled = true;
                btnAddFav.classList.add("disabled");
                btnAddFav.textContent = "Added";
            }
        });

        const btnDownload = document.createElement("button");
        btnDownload.classList.add("btnDownload");
        btnDownload.textContent = "Download";

        btnDownload.addEventListener("click", () => {
            this.downloadImg();
        });

        const img = document.createElement("img");

        img.src = this.img; 
        img.alt = this.title;
        img.classList.add("imgNasa"); 

        dataNasa.append(img,title,date,explanation,btnAddFav,btnDownload);
    }

    static isInFav(date) {
        const favs = Nasa.getLocalStorage("fav");
        return favs.some(item => item.date === date);
    }

    createCard(parentDiv) { // "favDiv"
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = this.img;
        img.alt = this.title;

        const title = document.createElement("h3");
        title.textContent = this.title;

        const date = document.createElement("p");
        date.textContent = this.date;

        const explanation = document.createElement("p");
        explanation.textContent = this.explanation;

        const footer = document.createElement("div");
        footer.classList.add("cardFooter");

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btnDelete");
        btnDelete.textContent = "Delete";

        footer.appendChild(btnDelete);

        btnDelete.addEventListener("click", () => {
            this.deleteFav();
            card.remove();
        });
        
        card.append(img, title, date, explanation, footer);
        parentDiv.appendChild(card);
    }

    static async getDataImg(inputDate){
        const response = await fetch(
            "https://api.nasa.gov/planetary/apod?api_key="+API_KEY+"&date="+inputDate
        );
        const data = await response.json();

        return new Nasa(data.date, data.explanation, data.title, data.url);
    }

    static getLocalStorage(key){
        const ls = localStorage.getItem(key);

        if (!ls) {
            return [];
        } else {
            return JSON.parse(ls);
        } 
    }

    static setLocalStorage(key,data){
        localStorage.setItem(key, JSON.stringify(data));   
    }

    addFav(){
        const favs = Nasa.getLocalStorage("fav");

        // verificar duplicado
        if (Nasa.isInFav(this.date)) {
            console.log("Ya esta agregado a fav");
            return false;
        }

        const obj = {
            date: this.date,
            explanation: this.explanation,
            title: this.title,
            img: this.img
        };

        favs.push(obj);
        Nasa.setLocalStorage("fav", favs);

        this.fav = true;
        return true;
    }

    deleteFav(){
        const list = Nasa.getLocalStorage("fav");
        console.log(list);

        // filtra todos los que NO coincidan 
        const newList = list.filter(i => i.title !== this.title);
        console.log(newList);
        
        this.fav = false;

        localStorage.setItem("fav", JSON.stringify(newList));
    }

    downloadImg() {
        try {
            const link = document.createElement("a");
            link.href = this.img;
            link.download = `${this.date}.jpg`;
            link.target = "_blank";
            link.click();
        } catch (err) {
            console.error("No se pudo descargar directamente:", err);
        }
    }

}