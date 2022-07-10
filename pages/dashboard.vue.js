import * as bookAPI from '/src/api/books.js';
import * as userAPI from '/src/api/user.js';
import store from '/shared/book.store.js';
// import { Written, ReadingList } from  '/shared/userBooks.vue.js';

const dashboard = Vue.createApp({
    data() {
        return {
            actions: [],
            readingList: null,
            written: null,
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

        return userAPI.fetch(writerID)
        .then(res => {
            store.commit('currentWriter', res);
            return bookAPI.fetchUserBooks(writerID)
        })
        .then(res => {
            this.written = res.creations;
        });
    }
});

dashboard.mount('#dashboard');

const dashboardActions = Vue.createApp({
    data() {
        return {
            actions: []
        }
    },

    methods: {
        handleAction(methodName, parameters=[]) {
            console.log('method name:', methodName);
        },
    },

    mounted() {
        console.log('actions:', this.actions);
        this.actions.push({ title: 'New Book', name: 'createBook' })
        console.log('actions:', this.actions);
    }
});

dashboardActions.mount('#dashboard-actions');

