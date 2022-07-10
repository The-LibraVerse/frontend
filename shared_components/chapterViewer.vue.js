import * as bookAPI from '/src/api/books.js';
import chapterStore from '/shared/chapter.store.js';

// const chapterEditor = {
export default {
    template: `
        <div>
            Viewing a book
            <button @click='close' type='button'>Close</button>
            <h3>{{ title }}</h3>
            <div class='content'>
                {{ content }}
            </div>
        </div>
    `,
    data() {
        return {
            title: null,
            content: null,
            // bookID: null,
            // popup: false,
        }
    },
    props: ['bookID', 'chapterID'],

    computed: {
        popup: () => chapterStore.getters.showEditor
    },

    methods: {
        close() {
            chapterStore.commit('closeEditor');
        },
        fetchChapter() {
            return bookAPI.fetchChapter(this.bookID, this.chapterID)
                .then(res => {
                    this.title = res.title;
                    this.content = res.content;
                });
        },
    },

    watch: {
        chapterID(id) {
            return this.fetchChapter();
        }
    },

    mounted() {
        return this.fetchChapter();
    }
}

// chapterEditor.mount('#chapter-editor');
