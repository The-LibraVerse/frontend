import * as bookAPI from '/src/api/books.js';
import chapterStore from '/shared/chapter.store.js';
import ImageInput from '/shared/imageInput.vue.js';
import ipfsUpload from '/src/api/ipfsUpload.js';
import WordProcessor from '/shared/word-processor.vue.js';

// const chapterEditor = {
export default {
    components: { ImageInput, WordProcessor },
    template: `
        <form @submit.prevent>
            <button @click='close' type='button'>Close</button>

            <ImageInput @file='(data) => imgFile = data' title='Book cover'>
            </ImageInput>

            <label class='input-group'>
                <span class='input-group__label'>Title</span>
                <input class='input-group__control' type='text' v-model='title' placeholder='Chapter title' />
            </label>

            <WordProcessor @content='(val) => content=val'>
            </WordProcessor>
            <button @click='submit'>Create</button>
        </form>
    `,
    data() {
        return {
            title: null,
            content: null,
            imgFile: null,
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

            return ipfsUpload(this.imgFile, 'cover_for_book')
                .catch(e => {
                    console.log('e:', e);
                    if(e == 'No file')
                        return
                })
                .then(res => {
                    console.log('res:', res);
                    if(res)
                        data.cover = res.url;

                    console.log('data:', data);
                    return bookAPI.addChapter(this.bookID, data)
                })
                .then(res => {
                    window.location.reload();
                })
        }
    },

    mounted() {
        console.log('bok id:', this.bookID);
    }
}

// chapterEditor.mount('#chapter-editor');
