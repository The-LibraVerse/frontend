import Vuex from '/dependencies/vuex4.js'

const store = Vuex.createStore({
    state() {
        return {
            showEditor: false,
            currentWriter: null,
            currentBook: null,
            readingList: [],
            writtenBooks: []
        }
    },
    getters: {
        showEditor: (state) => state.showEditor,
        currentWriter: (state) => state.currentWriter,
        currentBook: (state) => state.currentBook,
    },
    mutations: {
        newChapter(state, payload) {
            state.showEditor = true;
        },
        editChapter(state, payload) {
            state.showEditor = true;
        },
        closeEditor(state, payload) {
            state.showEditor = false;
        },
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
