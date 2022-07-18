import * as bookAPI from '/src/api/books.js';
import * as userAPI from '/src/api/user.js';
import store from '/shared/book.store.js';
import ImageInput from '/shared/imageInput.vue.js';
import ImageEditor from '/shared/coverImageCreator.vue.js';
import ipfsUpload from '/src/api/ipfsUpload.js';

const bookEditor = Vue.createApp({
    components: { 'image-input': ImageInput, 
        'image-editor': ImageEditor
    },
    data() {
        return {
            links: {},
            title: null,
            imgFile: null,
            description: null,

            openEditor: false,
            preview: null,
            usedImageEditor: false,
        }
    },

    methods: {
        submit() {
            const data = {
                title: this.title,
                description: this.description,
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

                    return bookAPI.newBook(data, false)
                })
                .then(res => {
                    window.location.href = '/book/' + res.id;
                });
        }
    },

    mounted() {
        return userAPI.fetchDashboard()
        .then(res => {
            this.links = res._links || {};
            if(!this.links.create_book)
                window.location.href = '/';
        });
    }
});

bookEditor.mount('#book-editor');
