import * as bookAPI from '/src/api/books.js';

const app = Vue.createApp({
    data() {
        return {
            books: []
        }
    },
    mounted() {
        return bookAPI.fetchAll()
        .then(res => {
            console.log('res:', res);
            this.books = res;
        });
    }
});

app.mount('#book-grid');
