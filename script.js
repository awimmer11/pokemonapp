const generateBtn = document.getElementById('generate-btn');
const cardsContainer = document.getElementById('cards-container');

// Replace 'YOUR_API_KEY' with your actual Pokémon TCG API key
const apiKey = '26402320-e8aa-4153-b7bb-8d1609b919e2';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';

async function fetchPokemonCards() {
    try {
        const response = await fetch(`${apiUrl}?q=set.series:base`, {
            headers: {
                'X-Api-Key': apiKey
            }
        });
        const data = await response.json();
        // Filter only Pokémon cards
        const pokemonCards = data.data.filter(card => card.supertype === 'Pokémon');
        return pokemonCards;
    } catch (error) {
        console.error('Error fetching Pokémon cards:', error);
        return [];
    }
}

function getRandomCards(cards, number = 2) {
    const shuffled = cards.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
}

function displayCards(cards) {
    cardsContainer.innerHTML = ''; // Clear previous cards
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardImage = document.createElement('img');
        cardImage.src = card.images.large || card.images.small;
        cardImage.alt = card.name;

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = card.name;

        const cardType = document.createElement('p');
        cardType.classList.add('card-type');
        cardType.textContent = `Type: ${card.types ? card.types.join(', ') : 'N/A'}`;

        const cardAttack = document.createElement('p');
        cardAttack.classList.add('card-attack');
        if (card.attacks && card.attacks.length > 0) {
            const attacks = card.attacks.map(attack => attack.name).join(', ');
            cardAttack.textContent = `Attacks: ${attacks}`;
        } else {
            cardAttack.textContent = 'Attacks: N/A';
        }

        const cardDescription = document.createElement('p');
        cardDescription.classList.add('card-description');
        cardDescription.textContent = card.flavorText || 'No description available.';

        // Append all elements
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardType);
        cardContent.appendChild(cardAttack);
        cardContent.appendChild(cardDescription);

        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardContent);

        cardsContainer.appendChild(cardElement);
    });
}

generateBtn.addEventListener('click', async () => {
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    const allPokemonCards = await fetchPokemonCards();
    if (allPokemonCards.length === 0) {
        cardsContainer.innerHTML = '<p>Unable to fetch Pokémon cards. Please try again later.</p>';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Random Pokémon Cards';
        return;
    }

    const randomCards = getRandomCards(allPokemonCards, 2);
    displayCards(randomCards);

    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Random Pokémon Cards';
});

// Optionally, generate cards on page load
// window.addEventListener('DOMContentLoaded', async () => {
//     generateBtn.click();
// });
