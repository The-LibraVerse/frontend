import * as bookAPI from '/src/api/books.js';
import server from '/src/api/server.js';
import chapterStore from '/shared/chapter.store.js';
import * as libraverseToken from '/src/api/token.js';
import { loginWithWallet } from '/src/api/user.js';

export default {
    template: `
        <div>
            <h3 class='chapter__title reader__content reader__title'>{{ title }}</h3>

            <div class='dashboard'>
                <div class='chapter__actions'>
                    <button v-if='links.publish' @click='publish' class='button'>Publish Chapter</button>
                </div>

                <div v-if='links.list_for_sale' class='sell-literature'>
                    <p class='sell-literature__title'>Sell your this chapter on the Ethereum Blockchain</p>
                    <p class='sell-literature__content'>Click the button below to create an ERC1155 token of your book.
                        You will be able to sell your book tokens on any of the web3 marketplaces.</p>
                        
                        <label class='input-group'><span class='input-group__label'>How many tokens would you like to mint? </span>
                            <input class='input-group__controle' type='number' min='1' v-model='tokenMints' />
                        </label>
                        <button class='button sell-literature__submit' @click='createToken'>Create token</button>
                </div>
            </div>
            
            <div class='notice reader__content' v-if='notice'>
                <p class='notice__title'>{{ notice.title || "Notice!" }}</p>
                <p class='notice__message'>{{ notice.message }}</p>
                <p>Buy this on the ethereum blockchain</p>
                <div v-if='notice.code == "TOKEN_REQUIRED"' class='token'>
                    <p class='token__contract-address'>{{ tokenContract }}</p>
                    <p class='token__id'>{{ tokenID }}</p>

                    <button class='button' @click='loginWithWallet'>Sign in with your wallet address</button>
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
                return api(link.href, data, link.method)
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
