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
            this.books = res.data;
        });
    }
});

app.mount('#book-grid');
