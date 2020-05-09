const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const { Bookmarks } = require( './models/bookmarks-model' );
const {DATABASE_URL, PORT} = require( './config' );
const cors = require( './middleware/cors' );
const validateToken = require('./middleware/validateToken');
const uuid = require('uuid');
const app = express();
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );
app.use(validateToken);

app.get( '/bookmarks', ( req, res ) => {
    Bookmarks
        .getAllBookmarks()
        .then( bookmarks => {
            return res.status( 200 ).json( bookmarks );
        })
        .catch( err => {
            res.statusMessage = "Something went wrong when retrieving the Bookmarks.";
            return res.status( 400 ).end();
        })

});

app.get( '/bookmark?title=value', ( req, res ) => {
    const { idUser } = req.params;

    Bookmarks
        .getBookmarkById( idUser )
        .then( bookmark => {
            return res.status( 200 ).json( bookmarks );
        })
        .catch( err => {
            res.statusMessage = `Something went wrong: ${err.message}.`;
            return res.status( 400 ).end(); 
        });
});

app.post( '/bookmarks', jsonParser, ( req, res ) =>{
    console.log( "Body ", req.body );

    let id = uuid.v4();
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!!title || !description || !url || !rating){
        res.statusMessage = "A parameter is missing";
        return res.status( 406 ).end();
    }

    const newBookmark = {
        id,
        title,
        description,
        url,
        rating
    };
    
    Bookmarks
        .createBookmark( newBookmark )
        .then( createdBookmark => {
            return res.status( 201 ).json( createdBookmark );
        })
        .catch( err => {
            res.statusMessage = "Something went wrong when creating the Bookmark.";
            return res.status( 400 ).end();
        });
});

app.delete( '/bookmark/:id', jsonParser, (req, res) =>{
    let id = req.query.id;

    Bookmarks.deleteIdBookmarks(id)
    .then(result => {
        if(result.n === 0){
            res.statusMessage = "That 'id' was not found in the list of bookmarks.";
            return res.status( 400 ).end();
        }
        else{
            console.log(result);
            res.statusMessage = "The bookmark was deleted succesfully";
            return res.status( 204 ).end();
        }
    })
    .catch(err =>{
        res.statusMessage = "Something is wrong with the Database. Try again Later.";
        return res.status( 500 ).end();
    })
});

app.listen(PORT, () =>
{
    new Promise( (resolve,reject) =>{

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };

        mongoose.connect(DATABASE_URL,settings,(err) =>{
            if (err){
                reject(err);
            }
            else{
                console.log("Database connected succesfully");
                return resolve();
            }
        });
    })
    .catch(err =>{
        mongoose.disconnect();
        console.log(err);
    })
    console.log("This server is using port "+PORT);
});