const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('page');
let url;


const getPageData = async () => {
    
    if (page === 'home') {
        document.getElementById('search-input').style.display = 'none';
        const genre = urlParams.get('genre');
        url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${API_KEY}&limit=10&format=json`;
        
        await getData(url, fillGenreData);
    } else if (page === 'nav') {

    }

    
}

const fillGenreData = (json) => {
    let tracks = json.tracks.track;

    const pageInput = document.getElementById('page-input');
    let placeholderValue = pageInput ? parseInt(pageInput.getAttribute('placeholder')) || 0 : 0;

    let currRank = placeholderValue != 1 ? (placeholderValue * 10) : 0;

    
    if (tracks.length > 10) {
        // Prevent currRank from exceeding array bounds
        currRank = Math.min(currRank, tracks.length - 10);  
        tracks = tracks.slice(currRank, currRank + 10); 
    }

    for (let i = 0; i <tracks.length; i++) {
        let elTemp = document.getElementsByClassName('search-tr')[0].cloneNode(true);
        elTemp.getElementsByClassName('search-rank')[0].innerHTML = `#${i + 1 + currRank }`;
        elTemp.getElementsByClassName('search-title')[0].innerHTML = tracks[i].name;
        elTemp.getElementsByClassName('search-artist')[0].innerHTML = tracks[i].artist.name;
        elTemp.getElementsByClassName('search-link')[0].innerHTML = `<a href=${tracks[i].url}>See FM Link</a>`;
        document.getElementById('search-tbody').insertAdjacentElement('beforeend', elTemp);
    }
    document.getElementById('page-input').setAttribute('placeholder', json.tracks['@attr']['page']);
    document.getElementById('page-input').setAttribute('max', json.tracks['@attr']['totalPages']);
    document.getElementById('last-page').innerText = json.tracks['@attr']['totalPages'];

    
}

const addBehavior = ()=> {
    
    

    document.getElementById('prev-btn').addEventListener('click', async(el)=>{
        let currPage = parseInt(document.getElementById('page-input').getAttribute('placeholder'));
        if (el.target.classList.contains('disabled')){
            el.preventDefault();
            return;
        } 
        const urlParams = `${url}&page=${currPage-1}`;
        document.getElementById('page-input').setAttribute('placeholder', --currPage);
        console.log(document.getElementById('page-input').getAttribute('placeholder'));
        clear();
        await getData(urlParams, fillGenreData);
    });

    document.getElementById('next-btn').addEventListener('click', async()=>{
        let currPage = parseInt(document.getElementById('page-input').getAttribute('placeholder'));
        const urlParams = `${url}&page=${currPage+1}`;
        document.getElementById('page-input').setAttribute('placeholder', ++currPage);
        clear();
        await getData(urlParams, fillGenreData);
    });

    document.getElementById('page-form').addEventListener('submit', async(el)=>{
        el.preventDefault()
        
        let page = document.getElementById('page-input').value;
        const urlParams = `${url}&page=${page}`;
        document.getElementById('page-input').setAttribute('placeholder', page);
        clear();
        await getData(urlParams, fillGenreData);
    });
}

const clear = () => {
    let elTr = document.querySelectorAll('tr.search-tr');
    elTr.forEach((el, index) => {
    if (index !== 0) {
        el.remove(); // Remove all but the first row
    }
    });
    let currPage = parseInt(document.getElementById('page-input').getAttribute('placeholder'));
    currPage == 1  ? document.getElementById('prev-btn').classList.add('disabled') : document.getElementById('prev-btn').classList.remove('disabled');
    document.getElementById('search-input').value = '';
    document.getElementById('page-input').value = '';

}

getPageData();
addBehavior();