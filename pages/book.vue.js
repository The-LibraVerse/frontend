import store from '/shared/book.store.js';
import chapterStore from '/shared/chapter.store.js';
import * as bookAPI from '/src/api/books.js';
import api from '/src/api/server.js';
import pageTitle from '/shared/pageTitle.js';
import ChapterEditor from '/shared/chapterEditor.vue.js';
import Reader from '/shared/chapterViewer.vue.js';
import * as libraverseToken from '/src/api/token.js';

const app = Vue.createApp({
    template: `
      <div v-if='book && book.title && book.author'>
        <div class='book-cover'>
            <img v-if='book.cover' :src='book.cover' class='book-cover__img' />
        </div>
        <h1 class='book-title'>{{ book.title }}</h1>
        <p class='book-author'>by <a target='_blank' :href='"/writer/" + book.author.id'>@{{ book.author.username }}</a></p>

        <p class='book-status__tag' :class='book.published ? "book-status__tag--true" : "book-status__tag--false"' v-if='book.published != null'>
            <span class='book-status__tag--true' v-if='book.published'>
                Published
            </span>
            <span class='book-status__tag--false' v-else>Not Published</span>
        </p>

        <button v-if='links.publish' @click='publish'>Publish Book</button>

        <div class='book-metadata-list'>
            <!-- <p class='book-metadata' v-for='i in 3'> -->
            <p class='book-metadata'>
                <span class='book-metadata__value'>{{ book.totalChapters }}</span>
                <span class='book-metadata__title'>Chapters</span>
            </p>
        </div>

        <div class='book-chapter-list'>
            <div v-for='(c, i) in book.chapters' class='book-chapter-list__item'>
                <p>
                    <button v-if='c._links._self' @click='openChapter(i)' class='book-chapter-list__item'>
                        {{ c.title }}</button>
                </p>
                <p>
                    <a v-if='c.contentURL' :href='c.contentURL' target='_blank'>Open on IPFS 
                        <i class="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                </p>
            </div>
        </div>

        <div id='actions'>
            <div v-if='links.sell'>
                <p class='title'>Sell your book on the Ethereum Blockchain</p>
                <p>Click the button below to create an ERC1155 token of your book.
                    You will be able to sell your book tokens on any of the web3 marketplaces.</p>
                    
                    <label>How many tokens would you like to mint? 
                        <input type='number' min='1' v-model='tokenMints' />
                    </label>
                    <button @click='createBookToken'>Create your book's token</button>
            </div>
            <button v-if='links.create_chapter' @click='newChapterPopup'>Add Chapter</button>
        </div>

        <ChapterEditor  v-if='showChapterEditor && book && book.id' :bookID='book.id'>
        </ChapterEditor>

        <div id='viewer'>
            <Reader v-if='showChapterViewer && currentChapter && currentChapter._links && currentChapter._links._self'
                :chapter='currentChapter'
            :bookID='book.id'>
            </Reader>
            <!--
            <button v-if='prevChapterID' @click='prevChapter'>Previous Chapter</button>
            <button v-if='nextChapterID' @click='nextChapter'>Next Chapter</button>
            -->
            <button :disabled='prevChapterIndex == null' @click='prevChapter'>Previous Chapter</button>
            <button :disabled='nextChapterIndex == null' @click='nextChapter'>Next Chapter</button>
        </div>
      </div>
    `,
    components: {ChapterEditor, Reader},
    data() {
        return {
            links: {},
            book: null,
            tokenMints: 1,
            currentChapter: {},
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
        openChapter(index) {
            if(index != null) {
                const chapter = this.book.chapters[index];
                if(chapter) {
                    this.currentChapter = this.book.chapters[index];
                    this.chapterIndex = index;
                    this.showChapterViewer = true;
                }
            }
        },
        openBook() {
            // calls readChapter with first chapter
        },
        nextChapter() {
            const index = this.nextChapterIndex;
            this.openChapter(index);
        },
        prevChapter() {
            const index = this.prevChapterIndex;
            this.openChapter(index);
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
        publish() {
            const data = null;
            const link = this.links.publish;

            if(link)
                return api(link.href, data, link.method)
        }
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
                    this.links = res._links || {};
                });
        }
    }
});

app.mount('#book-app');
