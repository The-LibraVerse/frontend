import * as bookAPI from '/src/api/books.js';
import chapterStore from '/shared/chapter.store.js';
import ImageInput from '/shared/imageInput.vue.js';
import ipfsUpload from '/src/api/ipfsUpload.js';

// const chapterEditor = {
export default {
    components: { ImageInput },
    template: `
        <form v-if='popup' @submit.prevent>
            <button @click='close' type='button'>Close</button>
            <label>Title
                <input type='text' v-model='title' placeholder='Chapter title' />
            </label>

            <textarea v-model='content' placeholder='Start typing...'>
            </textarea>
            <ImageInput @file='(data) => imgFile = data' title='Book cover'>
            </ImageInput>
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
