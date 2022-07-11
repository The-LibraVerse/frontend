import store from '/shared/book.store.js';
import chapterStore from '/shared/chapter.store.js';
import * as bookAPI from '/src/api/books.js';
import pageTitle from '/shared/pageTitle.js';
import ChapterEditor from '/shared/chapterEditor.vue.js';
import ChapterViewer from '/shared/chapterViewer.vue.js';
import * as libraverseToken from '/src/api/token.js';

const app = Vue.createApp({
    template: `
      <div v-if='book && book.title && book.author'>
        <h1>{{ book.title }}</h1>
        <p>by <a target='_blank' :href='"/writer/" + book.author.id'>{{ book.author.username }}</a></p>
        <p>{{ book.totalChapters }} chapter<span v-if='book.totalChapters != 1'>s</span>
        </p>

        <div v-for='(c, i) in book.chapters'>
            <p>
                <button @click='openChapter(c.id, i)'>{{ c.title }}</button>
            </p>
            <p>
                <a v-if='c.contentURL' :href='c.contentURL' target='_blank'>Open on IPFS</a>
            </p>
        </div>

        <div id='actions'>
            <div>
                <p class='title'>Sell your book on the Ethereum Blockchain</p>
                <p>Click the button below to create an ERC1155 token of your book.
                    You will be able to sell your book tokens on any of the web3 marketplaces.</p>
                    
                    <label>How many tokens would you like to mint? 
                        <input type='number' min='1' v-model='tokenMints' />
                    </label>
                    <button @click='createBookToken'>Create your book's token</button>
            </div>
            <button @click='newChapterPopup' v-if='actions.includes("addChapter")'>Add Chapter</button>
        </div>

        <ChapterEditor  v-if='showChapterEditor && book && book.id' :bookID='book.id'>
        </ChapterEditor>

        <div id='viewer'>
            <ChapterViewer v-if='showChapterViewer && chapterID' :chapterID='chapterID' :bookID='book.id'>
            </ChapterViewer>
            <!--
            <button v-if='prevChapterID' @click='prevChapter'>Previous Chapter</button>
            <button v-if='nextChapterID' @click='nextChapter'>Next Chapter</button>
            -->
            <button :disabled='prevChapterIndex == null' @click='prevChapter'>Previous Chapter</button>
            <button :disabled='nextChapterIndex == null' @click='nextChapter'>Next Chapter</button>
        </div>
      </div>
    `,
    components: {ChapterEditor, ChapterViewer},
    data() {
        return {
            book: null,
            actions: [],
            tokenMints: 1,
            chapterID: null,
            chapterIndex: null,
            showChapterEditor: false,
            showChapterViewer: false,
        }
    },

    computed: {
        nextChapterIndex() {
            let index = this.chapterIndex;
            if(index == null)
                return null;
            index++;
            const chapter = this.book.chapters[index];

            if(chapter)
                return index
            else return null
        },
        prevChapterIndex() {
            let index = this.chapterIndex;

            if(index == null)
                return null;

            index--;
            const chapter = this.book.chapters[index];

            if(chapter)
                return index;
            else return null
        }
    },
    methods: {
        openChapter(id, index) {
            this.chapterID = id;
            this.chapterIndex = index;
            this.showChapterViewer = true;
        },
        openBook() {
            // calls readChapter with first chapter
        },
        nextChapter() {
            const index = this.nextChapterIndex;

            if(this.nextChapterIndex != null) {
                const chapter = this.book.chapters[index];
                this.chapterIndex = index;
                this.chapterID = chapter.id;
            }
        },
        prevChapter() {
            const index = this.prevChapterIndex;

            if(this.prevChapterIndex != null) {
                const chapter = this.book.chapters[index];
                this.chapterIndex = index;
                this.chapterID = chapter.id;
            }
        },
        newChapterPopup() {
            chapterStore.commit('newChapter');
            this.showChapterEditor = true;
        },
        createBookToken() {
            const metadataURI = this.book.metadataURI;
            const amount = this.tokenMints;

            return libraverseToken.create(metadataURI, amount)
                .then(res => {
                    console.log('token id:', res);
                    const data = {
                        tokenContract: libraverseToken.address,
                        tokenID: res
                    }

                    return bookAPI.listForSale(this.book.id, data);
                });
        },
        createChapterToken() {
            const metadataURI = 'chapter';
            const amount = this.tokenMints;

            return libraverseToken.create(metadataURI, amount)
            .then(res => {
                console.log(' sent token:', res);
                /*
                return res.wait()
            }).then(res => {
                console.log('after waiting:', res);
                */
            });
        },
    },
    mounted() {
        const regex = /(?<=book\/)\d+/;
        let id;
        if (store.getters.book)
            id =store.getters.book.id
        else if(regex.test(window.location.pathname))
            id = window.location.pathname.match(regex)[0];

        if(id) {
            return bookAPI.fetchByID(id)
                .then(res => {
                    // console.log('res:', res);
                    document.title = pageTitle(res.title + ' - ' + res.author);
                    this.book = res;

                    // if(res._links && res._links.add_chapter)
                        this.actions.push('addChapter');
                });
        }
    }
});

app.mount('#book-app');
