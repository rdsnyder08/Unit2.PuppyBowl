const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Check Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2306-FTB-ET-WEB-FT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try { 
        const response=await fetch(`${APIURL}/players`)
        const players = await response.json();
        console.log(players)
        return players
        

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};







const fetchSinglePlayer = async (playerId) => {
    try {
        console.log(`${APIURL}/players`);
        const response = await fetch(`${APIURL}/players/${playerId}`);
        console.log(`${APIURL}/players/${playerId}`);
        const playerInfo = await response.json();
        console.log(playerInfo)
        const playerPic = playerInfo.data.player.imageUrl;

        return playerPic;


    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(playerObj)
        })
        const newPlayer = await response.json()
        return newPlayer

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};




const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {method: 'DELETE'})
        const data = await response.json();
        console.log('Deleted',data)

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (players) => {
    try { 
        const response = await fetchAllPlayers()
        console.log(response.data.players)
        const playerContainer = document.getElementById('all-players-container')
        response.data.players.forEach((player)=>{
            const playerCard = document.createElement('section')
            const playerName = JSON.stringify(player.name)
            playerCard.innerHTML = `<h1> Name: ${player.name}</h1> <p> Breed: ${player.breed}</p> `
            playerContainer.appendChild(playerCard)
        
            const detsBtn = document.createElement('button')
            detsBtn.innerText = 'Puppy Pic'
            detsBtn.addEventListener('click', async ()=> {
                const playerPic = await fetchSinglePlayer(player.id);
                const playerImg = document.createElement('img');
                playerImg.src = playerPic;
                playerCard.appendChild(playerImg);

                playerCard.removeChild(detsBtn);
                
            });
            const deleteButton = document.createElement('button')
            deleteButton.innerText='Remove Puppy'
            deleteButton.addEventListener('click', async () => {
                await removePlayer(player.id)
                playerContainer.removeChild(playerCard)
            })


        playerCard.appendChild(detsBtn);
        playerCard.appendChild(deleteButton);

        playerContainer.appendChild(playerCard);
    });
            


  

    return players

        
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const newPlayerFormContainer = document.getElementById('new-player-form');
        const form = document.createElement('form');

        form.innerHTML = `<label for="name">Name</label>
        <input type="text" name="name" id="name" />
        <label for='breed'>Breed:</label>
        <input name='breed' id='breed' type='text'/>
        <label for="imageUrl">Image URL</label>
        <input type="url" name="imageUrl" id="imageUrl" />
        <button type="submit">Add Puppy</button>`;


        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            const name = document.getElementById('name').value
            const breed=document.getElementById('breed').value
            const imageUrl = document.getElementById('imageUrl').value

            const newPlayer = {
                name,
                breed,
                imageUrl,


            }
            await addNewPlayer(newPlayer)
            playerContainer.innerHTML='';
            const updatedPlayers = await fetchAllPlayers();
            return renderAllPlayers(updatedPlayers);
        });

        newPlayerFormContainer.appendChild(form);

        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}



const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    console.log(players);

    renderNewPlayerForm();
}

init();