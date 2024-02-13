'use strict';

import apiHandler from './apiHandler.js';
import pagination from './pagination.js';

const allCharacters = [];

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded');

    getAllCharacters();
    paginationSetup();

    document.querySelector('#searchInput').addEventListener('input', updateAutoCompleteList);
});

async function getAllCharacters() {
    let nextUrl = 'https://swapi.dev/api/people/';

    while(nextUrl) {
        const data = await apiHandler.fetchData(nextUrl);

        data.results.forEach(character => {
            allCharacters.push(character);
        });

        nextUrl = data.next;
    }
    
    console.log(allCharacters);

    pagination.setNmbrOfPosts(allCharacters.length);
    renderCharacters();
}

function paginationSetup() {
    const prevRef = document.querySelector('#prevPageBtn');
    const nextRef = document.querySelector('#nextPageBtn');

    prevRef.addEventListener('click', () => {
        console.log('previous');
        pagination.previousPage();
        renderCharacters();
    });
    nextRef.addEventListener('click', () => {
        console.log('next');
        pagination.nextPage();
        renderCharacters();
    });
}

function renderCharacters() {
    const currentPage = pagination.getCurrentPage();
    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedCharacters = allCharacters.slice(startIndex, endIndex);

    const listRef = document.querySelector('#charactersList');
    listRef.innerHTML = '';

    let counter = itemsPerPage;
    if(currentPage === 11) {
        counter = 2;
    }

    for(let i = 0; i < counter; i++) {
        const listItemRef = document.createElement('li');
        listItemRef.textContent = displayedCharacters[i].name;
        listItemRef.classList.add('characters__list-item');
        listRef.appendChild(listItemRef);

        listItemRef.addEventListener('click', (event) => {
            const listItemRefs = document.querySelectorAll('.characters__list-item');
            listItemRefs.forEach(ref => {
                ref.classList.remove('active');
            })
            event.target.classList.add('active');

            renderPerson(displayedCharacters[i].url);
            renderHomeworld(displayedCharacters[i].homeworld);
        });
    }

    pagination.updatePaginationDisplay();
}

async function renderPerson(url) {
    const data = await apiHandler.fetchData(url);

    console.log(data);
    const headRef = document.querySelector('#personName');
    headRef.textContent = data.name;
    const listRef = document.querySelector('#personInfoList');

    const personListContent = `
        <li class="person-info__list-item">Height: ${data.height} cm</li>
        <li class="person-info__list-item">Mass: ${data.mass} kg</li>
        <li class="person-info__list-item">Hair Color: ${data.hair_color}</li>
        <li class="person-info__list-item">Skin Color: ${data.skin_color}</li>
        <li class="person-info__list-item">Eye Color: ${data.eye_color}</li>
        <li class="person-info__list-item">Birth Year ${data.birth_year}</li>
        <li class="person-info__list-item">Gender: ${data.gender}</li>
    `;

    listRef.innerHTML = personListContent;
}

async function renderHomeworld(url) {
    const data = await apiHandler.fetchData(url);
    console.log(data);

    const headingRef = document.querySelector('#homeName');
    headingRef.textContent = data.name;
    const listRef = document.querySelector('#homeInfoList');

    const homeListContent = `
        <li class="home-info__list-item">Rotation Period: ${data.rotation_period}h</li>
        <li class="home-info__list-item">Orbital Period: ${data.orbital_period} days</li>
        <li class="home-info__list-item">Diameter: ${data.diameter} km</li>
        <li class="home-info__list-item">Climate: ${data.climate}</li>
        <li class="home-info__list-item">Gravity: ${data.gravity}</li>
        <li class="home-info__list-item">Terrain: ${data.terrain}</li>
    `;

    listRef.innerHTML = homeListContent;
}

function updateAutoCompleteList(event) {
    console.log(event.target.value);

    const autocompleteList = document.querySelector('#autocompleteList');
    const userInput = event.target.value.toLowerCase();

    const matchedCharacters = allCharacters.filter(character => character.name.toLowerCase().includes(userInput));
    console.log(matchedCharacters);

    autocompleteList.innerHTML = '';

    let maxCounter = 10;
    if(matchedCharacters.length < 10) {
        maxCounter = matchedCharacters.length;
    }

    for(let i = 0; i < maxCounter; i++) {
        const listItemRef = document.createElement('li');
        listItemRef.textContent = matchedCharacters[i].name;
        autocompleteList.appendChild(listItemRef);

        listItemRef.addEventListener('click', () => {
            renderPerson(matchedCharacters[i].url);
            renderHomeworld(matchedCharacters[i].homeworld);
            autocompleteList.innerHTML = '';
        });
    }

}
