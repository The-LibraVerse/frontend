import * as bookAPI from '/src/api/books.js';
import * as userAPI from '/src/api/user.js';
import store from '/shared/book.store.js';
import NewBook from '/shared/newBook.vue.js';
// import { Written, ReadingList } from  '/shared/userBooks.vue.js';

const dashboard = Vue.createApp({
    components: {'new-book': NewBook},
    data() {
        return {
            actions: [],
            readingList: null,
            written: null,
            links: {},
        }
    },

    computed: {
        writer: () => store.getters.currentWriter
    },

    methods: {
    },

    mounted() {
        const regex = /(?<=writer\/)\d+/;
        let writerID;

        if(regex.test(window.location.pathname)) {
            writerID = window.location.pathname.match(regex)[0];
            console.log('currentWriter', writerID);
            store.commit('currentWriter', writerID);
        }

        return userAPI.fetchDashboard(writerID)
        .then(res => {
            store.commit('currentWriter', {
                id: res.id,
                username: res.username
            });

            this.links = res._links || {};
            this.written = res.creations;
            this.readingList = res.library;
        });
    }
});

dashboard.mount('#dashboard');
