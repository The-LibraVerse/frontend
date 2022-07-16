import * as bookAPI from '/src/api/books.js';
import * as userAPI from '/src/api/user.js';
import store from '/shared/book.store.js';
// import { Written, ReadingList } from  '/shared/userBooks.vue.js';

const dashboard = Vue.createApp({
    data() {
        return {
            name: null,
            username: null,
            avatar: '/assets/empty-avatar.png',
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
            this.name = res.name;
            this.username = res.username;

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
