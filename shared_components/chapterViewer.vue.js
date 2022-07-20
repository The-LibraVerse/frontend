import * as bookAPI from '/src/api/books.js';
import server from '/src/api/server.js';
import chapterStore from '/shared/chapter.store.js';
import * as libraverseToken from '/src/api/token.js';
import { loginWithWallet } from '/src/api/user.js';

export default {
    template: `
        <div>
            <div class='flex flex_bottom-center'>
                <p class='tag tag_flex' v-if='chapter.published != null'>
                    <template v-if='chapter.published'>
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
            </div>

            <h3 class='chapter__title reader__content reader__title'>{{ title }}</h3>

            <div class='dashboard'>
                <div class='chapter__actions flex flex_bottom-center'>
                    <button @click='publish' v-if='links.publish' class='tag tag_action'>
                        <span class='tag__text tag__title'>Publish Chapter</span>
                        <i class="fa-solid fa-paper-plane tag__icon tag_action__icon"></i>
                    </button>

                    <button class='tag tag_action' v-if='links.sell' @click="sellDialog=true" >
                        <i class='tag__icon'>$</i>
                        <span class='tag__title tag__text'>Sell your book</span>
                    </button>
                </div>

                <div v-if='links.sell && sellDialog' class='popup'>
                    <button @click='sellDialog = false' class='button button_secondary popup__close'>Close</button>
                    <div class='sell-literature'>
                        <p class='sell-literature__title'>Sell this chapter on the Ethereum Blockchain</p>
                        <p class='sell-literature__content'>Click the button below to create an ERC1155 token of your book.
                            You will be able to sell your book tokens on any of the web3 marketplaces.</p>
                            
                        <label class='input-group'><span class='input-group__label'>How many tokens would you like to mint? </span>
                            <input class='input-group__control' type='number' min='1' v-model='tokenMints' />
                        </label>
                        <div class='flex'>
                            <button class='button button_primary sell-literature__submit' @click='createToken'>Create token</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class='notice reader__content' v-if='notice'>
                <p class='notice__title'>{{ notice.title || "Notice!" }}</p>
                <p class='notice__message'>{{ notice.message }}</p>
                <p class='notice__message'>Buy this on the ethereum blockchain</p>
                <div v-if='notice.code == "TOKEN_REQUIRED"' class='token notice__message'>
                    <p class='token__contract-address'>{{ tokenContract }}</p>
                    <p class='token__id'>{{ tokenID }}</p>

                    <button class='button button_primary' @click='loginWithWallet'>Sign in with your wallet address</button>
                </div>
            </div>
                
            <div>
                <div class='reader__content' v-html='content'>
                </div>
            </div>
            <div class='chapter-actions'>
            </div>
        </div>
    `,
    data() {
        return {
            id: null,
            title: null,
            content: null,
            metadataURI: null,
            tokenID: null,
            tokenContract: null,
            tokenMints: 1,
            sellDialog: false,
            links: {},
            notice: null,
        }
    },
    props: ['bookID', 'chapter'],

    computed: {
        popup: () => chapterStore.getters.showEditor
    },

    methods: {
        loginWithWallet,
        close() {
            chapterStore.commit('closeEditor');
        },
        fetchChapter() {
            const url = this.chapter._links._self.href;

            return server(url)
            // return bookAPI.fetchChapter(this.bookID, this.chapterID)
                .then(res => {
                    this.id = res.id;
                    this.notice = res._notice;
                    this.title = res.title;
                    this.content = res.content;
                    this.metadataURI = res.metadataURI;
                    this.tokenID = res.tokenID;
                    this.tokenContract = res.tokenContract;
                    this.links = res._links || {};
                });
        },
        publish() {
            const data = null;
            const link = this.links.publish;
            if(link)
                return server(link.href, data, link.method)
        },
        callServer(link, data) {
            if(!data && link.method !='GET')
                data = {};

            if(!link)
                throw new Error('Link missing');
            else if(!link.method)
                throw new Eerror('Method missing');

            return server(link.href, data, link.method)
            .catch(e => {
                this.error = e;
            });
        },
        createToken() {
            const metadataURI = this.metadataURI;
            const amount = this.tokenMints;

            return libraverseToken.create(metadataURI, amount)
                .then(tokenID => {
                    const data = {
                        tokenContract: libraverseToken.address,
                        tokenID
                    }

                    return bookAPI.listChapterForSale(this.id, data);
                    /*
                return res.wait()
            }).then(res => {
                console.log('after waiting:', res);
                */
                });
        },
    },

    watch: {
        chapter() {
            return this.fetchChapter();
        }
    },

    mounted() {
        return this.fetchChapter()
    }
}
