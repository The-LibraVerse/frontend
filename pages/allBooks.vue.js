import * as bookAPI from '/src/api/books.js';

const app = Vue.createApp({
    data() {
        return {
            books: {
                featured: [],
                popular: [],
                topPaid: [],
                topFree: [],
                continueReading: [],
            }
        }
    },
    mounted() {
        return bookAPI.fetchAll()
        .then(res => {
            const {featured=[], popular=[], topPaid=[], topFree=[], continueReading=[]} = res;

            this.books.popular = popular;
            this.books.topPaid = topPaid;
            this.books.topFree = topFree;
            this.books.featured = featured;
            this.books.continueReading = continueReading;
        });
    }
});

app.mount('#all_books');

