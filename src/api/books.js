import server from '/src/api/server.js';
import ipfsUpload from '/src/api/ipfsUpload.js';

export function fetchAll() {
    return server('/books')
}

export function fetchByID(id) {
    return server('/book/'+id)
}

export function fetchUserBooks(id) {
    if(id)
        return server('/user/' + id + '/books')
    else
        return server('/my-books');
}

export function fetchReadingList(userID) {
    if(userID)
        return server('/user/' + userID + '/books/creations')
    else
        return server('/my-books/creations');
}

export function fetchWrittenBooks(userID) {
    if(userID)
        return server('/user/' + userID + '/books/creations')
    else
        return server('/my-books/creations');
}

export function newBook(data) {
    return server('/books', data);
}

export function addChapter(bookID, data) {
    return ipfsUpload(data.content, data.title)
    .then(res => {
        const content = res.url;
        data.content = res.url;
        console.log('dat to upload:',data);
        return server('/book/' + bookID + '/chapter', data);
    });
}

export function fetchChapter(bookID, chapterID) {
    return server('/book/' + bookID + '/chapter/' + chapterID);
}

export function listForSale(bookID, data) {
    return server('/book/' + bookID + '/sell', data);
}
