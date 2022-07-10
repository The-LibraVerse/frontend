import * as bookAPI from '/src/api/books.js';
import chapterStore from '/shared/chapter.store.js';

// const chapterEditor = {
export default {
    template: `
        <form v-if='popup' @submit.prevent>
            <button @click='close' type='button'>Close</button>
            <label>Title
                <input type='text' v-model='title' placeholder='Chapter title' />
            </label>

            <textarea v-model='content' placeholder='Start typing...'>
            </textarea>
            <button @click='submit'>Create</button>
        </form>
    `,
    data() {
        return {
            title: null,
            content: null,
            // bookID: null,
            // popup: false,
        }
    },
    props: ['bookID'],

    computed: {
        popup: () => chapterStore.getters.showEditor
    },

    methods: {
        close() {
            chapterStore.commit('closeEditor');
        },
        submit() {
            const data = {
                title: this.title,
                content: this.content
            };

            return bookAPI.addChapter(this.bookID, data)
        }
    },

    mounted() {
        console.log('bok id:', this.bookID);
    }
}

// chapterEditor.mount('#chapter-editor');
