'use strict';

import musicService from './musicservice.js';

(async () => {
    const _service = new musicService(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api`);

    let url = new URL(window.location);
    let params = url.searchParams;
    let id = params.get("id");
    let name = params.get("musicGroupName");
    let genre = params.get("genre");
    let established = params.get("established");

    // Populate basic info
    const groupName = document.querySelector("#groupName");
    if (groupName) groupName.innerText = name;
    else console.error("Element with ID 'groupName' not found.");

    const groupGenre = document.querySelector("#groupGenre");
    if (groupGenre) groupGenre.innerText = genre;

    const groupEstablished = document.querySelector("#groupEstablished");
    if (groupEstablished) groupEstablished.innerText = established;

    const groupIdElem = document.querySelector("#musicgroupID");
    if (groupIdElem) groupIdElem.innerText = id;

    // Fetch full group data including artists and albums
    const group = await _service.readMusicGroupDtoAsync(id);
    console.log(group);

    // --- Render Albums ---
    const artistsTbody = document.querySelector("#artistsName tbody");
    const albumsTbody = document.querySelector("#albumsName tbody");

    artistsTbody.innerHTML = "";
    albumsTbody.innerHTML = "";

    if (group.artistsId && Array.isArray(group.artistsId)) {
        for (let artistId of group.artistsId) {
            try {
                const artist = await _service.readArtistDtoAsync(artistId, true);
                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.textContent = `${artist.firstName} ${artist.lastName}`;
                cell.style.fontSize = "1.2em";
                cell.style.fontWeight = "bold";
                cell.style.color = "white"; 

                row.appendChild(cell);
                artistsTbody.appendChild(row);
            } catch (err) {
                console.error(`Failed to load artist with ID ${artistId}:`, err);
            }
        }
    } else {
        console.warn("No artist IDs found.");
    }


    if (group.albumsId && Array.isArray(group.albumsId)) {
        for (let albumId of group.albumsId) { //albumsId is an array
            try {
                const album = await _service.readAlbumDtoAsync(albumId);
                const row = document.createElement("tr");


                const nameCell = document.createElement("td");
                nameCell.textContent = album.name;
                nameCell.style.fontSize = "1.2em";
                nameCell.style.fontWeight = "bold";
                nameCell.style.color = "white"; 

                const yearCell = document.createElement("td");
                yearCell.textContent = album.releaseYear;
                yearCell.style.fontSize = "1.2em";
                yearCell.style.fontWeight = "bold";
                yearCell.style.color = "white";

                const copyCell = document.createElement("td");
                copyCell.textContent = album.copiesSold;
                copyCell.style.fontSize = "1.2em";
                copyCell.style.fontWeight = "bold";
                copyCell.style.color = "white";

                row.appendChild(nameCell);
                row.appendChild(yearCell);
                row.appendChild(copyCell);

                albumsTbody.appendChild(row);
            } catch (err) {
                console.error(`Failed to load album with ID ${albumId}:`, err);
            }
        }
    } else {
        console.warn("No album IDs found.");        
    }

    //delete button
    const deleteButton = document.querySelector("#deleteButton");
    deleteButton.addEventListener("click", async () => {
        const musicGroupId = groupIdElem.innerText;
        try {
            await _service.deleteMusicGroupAsync(musicGroupId);
            alert(`Music group with ID ${musicGroupId} deleted successfully.`);
            window.location.href = "musicgroup.html";
        } catch (err) {
            console.error(`Failed to delete music group with ID ${musicGroupId}:`, err);
            alert(`Failed to delete music group: ${err.message}`);
        }
    });

})();