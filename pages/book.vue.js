import store from '/shared/book.store.js';
import chapterStore from '/shared/chapter.store.js';
import * as bookAPI from '/src/api/books.js';
import api from '/src/api/server.js';
import pageTitle from '/shared/pageTitle.js';
import ChapterEditor from '/shared/chapterEditor.vue.js';
import Reader from '/shared/chapterViewer.vue.js';
import * as libraverseToken from '/src/api/token.js';
import { loginWithWallet } from '/src/api/user.js';

import { showLoader, hideLoader } from '/src/loaderFunctions.js';

const app = Vue.createApp({
    template: `
      <div v-if='book && book.title && book.author' class='book-page page'>
        <div class='flex flex_bottom-center book-page__metadata'>
            <p class='tag tag_flex'>
                <i class="fa-solid fa-bars tag__icon tag_flex__icon"></i>
                <span class='tag__value'>{{ book.totalChapters }}</span>
                <span class='tag__title'>Chapters</span>
            </p>

            <p class='tag tag_flex' v-if='book.published != null'>
                <template v-if='book.published'>
                    <span class='tag__title tag__text tag_flex__title tag_true__text tag_true__title'>Published</span>
                    <i class="fa-solid fa-book tag__icon tag_flex__icon tag_true__icon"></i>
                </template>

                <template v-else>
                    <span class='tag__title tag__text tag_flex__title tag_false__text tag_false__title'>
                        Not Published
                    </span>
                    <i class="fa-solid fa-book tag__icon tag_flex__icon tag_false__icon"></i>
                </template>
            </p>

            <div class='tag tag_flex' v-if='book.views'>
                <i class="fa-solid fa-eye tag__icon tag_flex__icon tag_flex__icon"></i>
                <p class='tag__title tag_flex__title tag__text'>Views</p>
                <p class='tag__value tag__text tag_flex__value'>{{ book.views }}</p>
            </div>
        </div>

        <div class='book-cover book-page__book-cover'>
            <img v-if='book.cover' :src='book.cover' class='book-cover__image' />
            <div class='book-cover__text' v-else>
                <p class='book-cover__title'>{{ book.title }}</p>
                <p class='book-cover__author'>{{ book.author.name || book.author.username }}</p>
            </div>
        </div>

        <h1 class='book-page__title'>{{ book.title }}</h1>
        <p class='book-page__author'>by <a class='link' target='_blank' :href='"/writer/" + book.author.id'>@{{ book.author.username }}</a></p>

        <div class='dashboard' v-if='links.publish || links.sell || links.create_chapter || links.add_to_library'>
            <button v-if='links.publish' @click='callServer(links.publish)' class='tag tag_action'>
                <span class='tag__text tag__title'>Publish Book</span>
                <i class="fa-solid fa-paper-plane tag__icon tag_action__icon"></i>
            </button>
            <button v-if='links.sell' class='tag tag_action'
                @click="$refs['sell-book'].scrollIntoView({ behavior: 'smooth' })"
            >
                <i class='tag__icon fa-brands fa-ethereum'></i>
                <span class='tag__title tag__text'>Sell your book</span>
            </button>

            <button class='tag tag_action' v-if='links.create_chapter' @click='newChapterPopup'>
                <span class='tag__text tag__title'>Add Chapter</span>
                <i class="fa-regular fa-plus tag__icon tag_action__icon tag__icon_outline"></i>
                <i class="fa-solid fa-circle-plus tag__icon tag_action__icon tag__icon_solid"></i>
            </button>

            <button class='tag tag_action' v-if='links.add_to_library' @click='callServer(links.add_to_library)'>
                <i class="fa-regular fa-bookmark tag__icon tag_action__icon"></i>
                <p class='tag__title tag__text'>Add to Library</p>
            </button>
        </div>

        <div v-if='book._notice' class='notice page__item'>
            <p class='notice__title'>{{ book._notice.title || "Notice!" }}</p>
            <p class='notice__message'>{{ book._notice.message }}</p>
            <div v-if='book._notice.code == "TOKEN_REQUIRED"' class='token'>
                <button class='button button_primary notice__action' @click='signInWallet'>Sign in with your wallet address</button>
            </div>

            <a v-if='book._notice.link' :href='book._notice.link.href' target='_blank' class='notice__link'>{{ book._notice.link.title }}</a>
        </div>

        <div class='book-chapter-list list page__item'>
            <div v-for='(c, i) in book.chapters' class='book-chapter-list__item'>
                <button
                    class='book-chapter-list__chapter text'
                    :disabled='!c._links || !c._links._self'
                @click='openChapter(i)'>

                    <span class=' book-chapter-list__title'>{{ c.title }}</span>
                    <div class='flex flex_left flex_small'>
                        <template v-if='c.forSale === true'>
                            <p class='tag tag_tiny'>
                                <i class="tag__icon fa-brands fa-ethereum"></i>
                            </p>
                        </template>

                        <p class='tag tag_flex tag_tiny' v-if='c.published != null'>
                            <template v-if='c.published'>
                                <i class="fa-solid fa-book tag__icon tag_flex__icon tag_true__icon"></i>
                            </template>

                            <template v-else>
                                <i class="fa-solid fa-book tag__icon tag_flex__icon tag_false__icon"></i>
                            </template>
                        </p>
                    </div>
                </button>
                <a class='link book-chapter-list__link' v-if='c.contentURL' :href='c.contentURL' target='_blank'>Open on IPFS 
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </a>
            </div>
        </div>

        <div id='actions' class='page__item'>
            <div v-if='links.sell' ref='sell-book' class='sell-literature sell-literature--dialog'>
                <p class='sell-literature__title'>Sell "{{ book.title }}" on the Ethereum Blockchain</p>
                <div class='book-cover book-cover_thumbnail book-page__book-cover'>
                    <img v-if='book.cover' :src='book.cover' :alt='book.title' class='book-cover__image' />
                    <div v-else role='img' :alt='book.title' class='book-cover__text'>
                      <p class='book-cover__title book-cover_thumbnail__title'>{{ book.title }}</p>
                      <p class='book-cover__author book-cover_thumbnail__author'>{{ book.author.name || book.author.username }}</p>
                    </div>
                    <icon class='book-cover__for-sale-sign fa-brands fa-ethereum'></icon>
                </div>
                <p class='sell-literature__content'>Click the button below to create an ERC1155 token of your book.
                    You will be able to sell your book tokens on any of the web3 marketplaces.</p>
                    
                    <label class='sell-literature__input-group input-group'>
                        <span class='sell-literature__input-label input-group__label'>
                            How many tokens would you like to mint? 
                        </span>
                        <input class='input sell-literature__input input-group__control' type='number' min='1' v-model='tokenMints' />
                    </label>
                    <div class='flex'>
                    <button class='sell-literature__submit button button_submit' @click='createBookToken'>Create your book's token</button>
                </div>
            </div>
        </div>

        <div v-if='showChapterEditor' class='popup popup_fullscreen'>
            <div class='page__item'>
                <button class='button' @click='showChapterEditor = false' type='button'>Close</button>

                <ChapterEditor v-if='book && book.id' :bookID='book.id'>
                </ChapterEditor>
            </div>
        </div>

        <div v-show='showChapterViewer' v-if='currentChapter && currentChapter._links && currentChapter._links._self'
            class='reader popup popup_fullscreen'>
            <div class='actions'>
                <button @click='showChapterViewer=false' type='button' class='button'>Close</button>
            </div>
            <Reader
                :chapter='currentChapter'
            :bookID='book.id'>
            </Reader>
            <!--
            <button v-if='prevChapterID' @click='prevChapter' class='button'>Previous Chapter</button>
            <button v-if='nextChapterID' @click='nextChapter' class='button'>Next Chapter</button>
            -->
            <div class='reader__actions flex'>
                <button :disabled='prevChapterIndex == null' @click='prevChapter' class='button button_secondary'>Previous Chapter</button>
                <button :disabled='nextChapterIndex == null' @click='nextChapter' class='button button_primary'>Next Chapter</button>
            </div>
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
        signInWallet() {
            return loginWithWallet()
        },
        callServer(link, data) {
            if(!data && link.method !='GET')
                data = {};

            if(!link)
                throw new Error('Link missing');
            else if(!link.method)
                throw new Eerror('Method missing');

            return api(link.href, data, link.method)
            .catch(e => {
                this.error = e;
            });
        },
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
            showLoader();
            const metadataURI = this.book.metadataURI;
            const amount = this.tokenMints;

            return libraverseToken.create(metadataURI, amount)
                .then(res => {
                    hideLoader();
                    console.log('token id:', res);
                    const data = {
                        tokenContract: libraverseToken.address,
                        tokenID: res
                    }

                    return bookAPI.listForSale(this.book.id, data);
                });
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
