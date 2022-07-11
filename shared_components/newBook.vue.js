import * as bookAPI from '/src/api/books.js';
import ImageInput from '/shared/imageInput.vue.js';
import ipfsUpload from '/src/api/ipfsUpload.js';

const newBook = Vue.createApp({
    components: { ImageInput },
    template: `
        <div>
            <form @submit.prevent>
                <label>Book Title
                    <input type='text' v-model='title' />
                </label>
                <button @click='submit'>Create Book</button>
                <ImageInput @file='(data) => imgFile = data' title='Book cover'>
                </ImageInput>
            </form>
        </div>
    `,
    data() {
        return {
            title: null,
            imgFile: null,
        }
    },

    methods: {
        submit() {
            const data = {
                title: this.title
            }

            return ipfsUpload(this.imgFile, 'cover_for_book')
                .catch(e => {
                    console.log('e:', e);
                    if(e == 'No file')
                        return
                })
                .then(res => {
                    if(res)
                        data.cover = res.url;

                    return bookAPI.newBook(data)
                })
                .then(res => {
                    window.location.href = '/book/' + res.id;
                });
        }
    }
});

newBook.mount('#new-book');
