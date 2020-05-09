const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function addBookmarkFetch( title, description, url, rating){
    let url = '/bookmarks';

    let data = {
        title : title,
        description : description,
        url : url,
        rating : rating
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchBookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            for ( let i = 0; i < responseJSON.length; i ++ ){
                results.innerHTML += `
                <div>
                    <div>
                        <div class="bookmark-title">
                            ${responseJSON[i].title}
                        </div>
                    </div> 
                    <div>
                        <div>
                                <div>
                                    ${responseJSON[i].description}
                                </div>
                                <div>
                                    ${responseJSON[i].url}
                                </div>
                                <div>
                                    ${responseJSON[i].rating}
                                </div>
                            </div>
                                <div>
                                    <button class="btn btn-default" onclick = "editBookmark(${i},'${responseJSON[i].id}')">
                                        Edit
                                    </button>
                                </div>
                                <div>
                                    <button class="btn btn-danger" onclick="deleteBookmark('${responseJSON[i].id}')">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        })
        .catch( err => {
            alert(err.message);
        }); 
}

function watchAddBookmarkForm(){
    let bookmarkForm = document.querySelector( '.add-bookmark-form' );

    bookmarkForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bookmarkTitle' ).value;
        let description = document.getElementById( 'bookmarkDes' ).value;
        let url = document.getElementById( 'bookmarkUrl' ).value;
        let rating = document.getElementById( 'bookmarkRating' ).value;
        addBookmarkFech( title, description, url, rating);
    })
    bookmarkForm.reset();
}

function watchBookmarkForm(){
    let searchForm = document.querySelector('.search-bookmark-form');

    searchForm.addEventListener('submit',(event) =>{
        event.preventDefault();

        let title = document.getElementById('searchBookmark').value;

        searchBookmark(title);
    })
}


function init(){
    watchBookmarksForm();
    watchAddBookmarkForm();
    watchBookmarkForm();
    fetchBookmarks();
}

init();