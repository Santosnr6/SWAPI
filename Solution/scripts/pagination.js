'use strict';

let currentPage = 1;
const itemsPerPage = 8;
let nmbrOfPosts = 0;

function getCurrentPage() {
    return currentPage;
}

function setNmbrOfPosts(nmbr) {
    nmbrOfPosts = nmbr;
}

// Föregående sida?
// Är currentPage större än 1?
// Räknar ner currentPage
function previousPage() {
    if(currentPage > 1) {
        currentPage--;
    }
}

// Nästa sida?
// Är currentPage mindre än det totala antalet sidor
// Ränkar upp currentPage
function nextPage() {
    const totalPages = Math.ceil(nmbrOfPosts / itemsPerPage);
    if(currentPage < totalPages) {
        currentPage++;
    }
}

function updatePaginationDisplay() {
    const pageIndicatorRef = document.querySelector('#pageIndicator');
    pageIndicatorRef.textContent = `Sida ${ currentPage }`;
}

export default { getCurrentPage, setNmbrOfPosts, previousPage, nextPage, updatePaginationDisplay };