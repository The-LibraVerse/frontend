import Vuex from '/dependencies/vuex4.js'

const store = Vuex.createStore({
    state() {
        return {
            currentWriter: null,
            currentBook: null,
            readingList: [],
            writtenBooks: []
        }
    },
    getters: {
        currentWriter: (state) => state.currentWriter,
        currentBook: (state) => state.currentBook,
    },
    mutations: {
        currentBook(state, payload) {
            state.currentBook = payload;
        },
        currentWriter(state, payload) {
            if(typeof payload == 'number' || (typeof payload == 'string' && !isNaN(payload)))
                state.currentWriter = {id: payload}
            else if (typeof payload == 'object')
                state.currentWriter = payload;
        }
    }
});

export default store;
