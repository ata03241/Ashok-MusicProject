//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';

import musicService from './musicservice.js';

(async () => {

    //Initialize the service
    const _service = new musicService(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api`);

    //Read Database info async
    let data = await _service.readInfoAsync();
    let count_artists = data.db.nrSeededArtists + data.db.nrUnseededArtists;

    //Fill in the WebApi info with correct values from the WebApi
    document.querySelector("#artists").innerHTML = count_artists;

    let nextbtn = document.querySelector('#nextBtn');
    let prevbtn = document.querySelector('#prevBtn');
    let pageNr = 0;
    let pageSize = 10;

    nextbtn.addEventListener('click', async () => {
        pageNr++;
        renderArtists(pageNr, pageSize);
    });

    prevbtn.addEventListener('click', async () => {
        if (pageNr > 0) {
            pageNr--;
            renderArtists(pageNr, pageSize);
        }
    });

    //render artists
function renderArtistList(artists) {
    let artistList = document.querySelector("#Artistdiv");
    artistList.innerHTML = ""; 

    artists.forEach((c) => {
        let artistCard = document.createElement("div");
        artistCard.classList.add("artist-info", "text-center", "mx-3");

        let img = document.createElement("img");
        let randomIndex = Math.floor(Math.random() * 30) + 1;
        img.src = `../../img/Artist/${randomIndex}.jpg`;
        img.alt = c.name;
        img.classList.add("rounded-circle");
        img.style.width = "150px";
        img.style.height = "150px";
        img.style.objectFit = "cover";

        let artistNameDiv = document.createElement("div");
        artistNameDiv.classList.add("artist-name");

        let name = document.createElement("p");
        name.innerText = `${c.firstName} ${c.lastName}`;
        name.classList.add("text-black");

        artistNameDiv.appendChild(name);
        artistCard.appendChild(img);
        artistCard.appendChild(artistNameDiv);
        artistList.appendChild(artistCard);
    });
}

async function renderArtists(pageNr, pageSize) {
    let artist = await _service.readArtistsAsync(pageNr, true, null, pageSize);
    renderArtistList(artist.pageItems);
}

//search artist
let searchInput = document.querySelector("#search");
searchInput.addEventListener("input", async () => {
    let searchValue = searchInput.value.trim();
    let artist = await _service.readArtistsAsync(pageNr, true, searchValue, pageSize);
    renderArtistList(artist.pageItems);
});

//Initial render
renderArtists(pageNr, pageSize);



})();





