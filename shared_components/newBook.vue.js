import * as bookAPI from '/src/api/books.js';

const newBook = Vue.createApp({
    template: `
        <div>
            <form @submit.prevent>
                <label>Book Title
                    <input type='text' v-model='title' />
                </label>
                <button @click='submit'>Create Book</button>
            </form>
        </div>
    `,
    data() {
        return {
            title: null,
        }
    },

    methods: {
        submit() {
            const data = {
                title: this.title
            }

            return bookAPI.newBook(data)
                .then(res => {
                    window.location.href = '/book/' + res.id;
                });
        }
    }
});

newBook.mount('#new-book');
