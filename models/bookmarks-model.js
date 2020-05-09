const mongoose = require( 'mongoose' );
const { uuid } = require('uuidv4');

const bookmarksSchema = mongoose.Schema({
    id : {
        type : uuid.v4(),
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
});

const bookmarksCollection = mongoose.model( 'bookmarks', studentsSchema );

const Students = {
    createBookmark : function( newBookmark ){
        return bookmarksCollection
                .create( newBookmark )
                .then( createdBookmark => {
                    return createdBookmark;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllBookmarks : function(){
        return bookmarksCollection
                .find()
                .then( allBookmarks => {
                    return allBookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    getBookmarksByTitle: function( query){
        return bookmarksCollection
        .find({title : query})
        .then(allBookmarks =>{
            return allBookmarks
        })
        .catch(err =>{
            return err;
        });
    },
    deleteBookmarksByID: function( query ){
        return bookmarksCollection
        .deleteOne({id : query})
        .then(deleteStatus =>{
            return deleteStatus
        })
        .catch(err =>{
            return err;
        })
    },
    getBookmarksBy : function(idBookmark){
        return bookmarksCollection.find({id : idBookmark})
        .then(result =>{
            if( !bookmark ){
                throw new Error( "Bookmark not found" );
            }
            return result;
        })
        .catch(err =>{
            return err;
        })
    }
}

module.exports = { Bookmarks };