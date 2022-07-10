import * as bookAPI from '/src/api/books.js';
import store from '/shared/book.store.js';

export const Written = Vue.createApp({
    template: `
        <div id='written'>
          <h3>Reading List</h3>
          <a v-for='book in books' :href='"/book/" + book.id'>
            <div>
              {{ book.title }}
            </div>
          </a>
        </div>
    `,
    data() {
        return {
            books: []
        }
    },

    mounted() {
        console.log
        return bookAPI.fetchWrittenBooks()
        .then(res => {
            this.books = res;
        });
    }
});

export const ReadingList = Vue.createApp({
    template: `
        <div id='reading-list'>
          <h3>Reading List</h3>
          <a v-for='book in books' :href='"/book/" + book.id'>
            <div>
              {{ book.title }}
            </div>
          </a>
        </div>
    `,
    data() {
        return {
            books: []
        }
    },
    mounted() {
        return bookAPI.fetchReadingList()
        .then(res => {
            this.books = res;
        });
    }
});

// readingList.mount('#reading-list');
