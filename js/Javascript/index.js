//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';

import musicService from './musicservice.js';

(async () => {

    //Initialize the service
    const _service = new musicService(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api`);

    //   //Read Database info async
    let data = await _service.readInfoAsync();
    let count_albums = data.db.nrSeededAlbums + data.db.nrUnseededAlbums;
    let count_artists = data.db.nrSeededArtists + data.db.nrUnseededArtists;
    let count_groups = data.db.nrSeededMusicGroups + data.db.nrUnseededMusicGroups;

    //   //Fill in the WebApi info with correct values from the WebApi
    document.querySelector("#total-albums").innerText = `${count_albums} albums`;
    document.querySelector("#count-artists").innerText = `${count_artists} artists`;
    //   document.querySelector("#count-groups").innerText = `${count_groups} music groups`;


    //next and previous buttons
    let nextButton = document.querySelector('#NextButton');
    let prevButton = document.querySelector('#PreviousButton');
    let pageNr = 0;
    let pageSize = 12;

    nextButton.addEventListener('click', async () => 
    {
        pageNr++;
        renderAlbums(pageNr, pageSize);
    });

    prevButton.addEventListener('click', async () =>
    {
        if (pageNr > 0) {
            pageNr--;
            renderAlbums(pageNr, pageSize);
        }
    });


    //random img for all the albums from api
    function renderAlbumList(albumItems) {
        let albumList = document.querySelector(".row.oneMusic-albums");
        albumList.innerHTML = "";
        albumItems.forEach((c) => {
            let albumItem = document.createElement("div");
            albumItem.classList.add("col-12", "col-sm-4", "col-md-3", "col-lg-2", "single-album-item", "t", "c", "p");

            let singleAlbum = document.createElement("div");
            singleAlbum.classList.add("single-album");

            let img = document.createElement("img");
            let randomIndex = Math.floor(Math.random() * 20) + 1;
            img.src = `../../img/album/${randomIndex}.jpg`;

            let albumInfo = document.createElement("div");
            albumInfo.classList.add("album-info");

            let name = document.createElement("p");
            name.innerText = c.name;

            albumInfo.appendChild(name);
            singleAlbum.appendChild(img);
            singleAlbum.appendChild(albumInfo);
            albumItem.appendChild(singleAlbum);
            albumList.appendChild(albumItem);
        });
    }

    async function renderAlbums(pageNr, pageSize) {
        let album = await _service.readAlbumsAsync(pageNr, true, null, pageSize);
        renderAlbumList(album.pageItems);
    }

    await renderAlbums(0, 12);

    //search for albums
    let searchInput = document.querySelector("#search");

    searchInput.addEventListener("input", async () => {
        let searchValue = searchInput.value;
        let album = await _service.readAlbumsAsync(0, true, searchValue, 12);
        renderAlbumList(album.pageItems);
    });

    //

})();




