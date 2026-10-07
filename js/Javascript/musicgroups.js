//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';

import musicService from './musicservice.js';

(async () => {

    //Initialize the service
    const _service = new musicService(`https://seido-webservice-307d89e1f16a.azurewebsites.net/api`);

    let data = await _service.readInfoAsync();
    let countgroups = data.db.nrSeededMusicGroups + data.db.nrUnseededMusicGroups;
    document.querySelector("#groups").innerHTML = `${countgroups}`;

    let nextbutton = document.querySelector('#nextbtn');
    let prevbutton = document.querySelector('#prevbtn');
    let pageNr = 0;
    let pageSize = 10;

    nextbutton.addEventListener('click', async () => {
        pageNr++;
        renderGroups(pageNr, pageSize);
    });

    prevbutton.addEventListener('click', async () => {
        if (pageNr > 0) {
            pageNr--;
            renderGroups(pageNr, pageSize);
        }
    });

    // Render groups
    function renderGroupList(groups) {
        const ul = document.querySelector("#music-groups-list");
        ul.innerHTML = "";
        groups.forEach((group) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.style.alignItems = "center";

            let genreColor = "";
            if (group.strGenre) {
                switch (group.strGenre.toLowerCase()) {
                    case "metal":
                        genreColor = "DarkSlateGray";
                        break;
                    case "rock":
                        genreColor = "Crimson";
                        break;
                    case "jazz":
                        genreColor = "MidnightBlue";
                        break;
                    case "blues":
                        genreColor = "SlateBlue";
                        break;
                    default:
                        genreColor = "black";
                }
            }

            li.innerHTML = `
                <div class="d-flex flex-row flex-grow-1 align-items-center justify-content-between" style="min-width:0; width:100%;">
                    <h6 class="mb-1 me-3 text-truncate" style="max-width: 180px; flex:1 1 0; margin: 0 auto;">${group.name}</h6>
                    <span style="color: ${genreColor}; margin-left: 270px; min-width: 60px; text-align: center; font-size: 1.25em;">
                        ${group.strGenre || ""}
                    </span>
                    <div style="flex:1 1 0; display: flex; justify-content: flex-end;">
                        <button class="btn btn-info btn-sm me-2 detail-btn m-2" data-id="${group.id}">Detail</button>
                        <button class="btn btn-danger btn-sm m-2">Delete</button>
                    </div>
                </div>
            `;
            ul.appendChild(li);


            const detailBtn = li.querySelector('.detail-btn');
            detailBtn.addEventListener("click", () => {
                window.location.href = `./detail.html?id=${group.musicGroupId}&musicGroupName=${group.name}&genre=${group.strGenre}&established=${group.establishedYear}`;
            });

            const deleteBtn = li.querySelector('.btn-danger');
            deleteBtn.addEventListener("click", async () => {
                if (confirm(`Are you sure you want to delete ${group.name}?`)) {
                    try {
                        await _service.deleteMusicGroupAsync(group.musicGroupId);
                        alert(`Music group ${group.name} deleted successfully.`);
                        renderGroups(pageNr, pageSize);
                    } catch (err) {
                        console.error(`Failed to delete music group with ID ${group.musicGroupId}:`, err);
                        alert(`Failed to delete music group: ${err.message}`);
                    }
                }
            });
        });
    }

    //search group
    const searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", async () => {
        let searchValue = searchInput.value.trim();
        let groupsResult = await _service.readMusicGroupsAsync(pageNr, false, searchValue, pageSize);
        //to show total number of search results in input fiel
        const searchResult = document.querySelector("#searchresult");
        searchResult.innerHTML = `Total number of search results: ${groupsResult.totalCount}`;
        renderGroupList(groupsResult.pageItems);

        
    });



    // Function to render the groups
    async function renderGroups(pageNr, pageSize) 
    {
        let groupsResult = await _service.readMusicGroupsAsync(pageNr, false, null, pageSize);
        renderGroupList(groupsResult.pageItems);
    }

    // Call the function to render the first page of groups
    renderGroups(pageNr, pageSize);

})();




