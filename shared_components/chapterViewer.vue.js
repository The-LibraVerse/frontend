import * as bookAPI from '/src/api/books.js';
import chapterStore from '/shared/chapter.store.js';
import * as libraverseToken from '/src/api/token.js';

// const chapterEditor = {
export default {
    template: `
        <div>
            Viewing a book
            <button @click='close' type='button'>Close</button>
            <h3>{{ title }}</h3>
            <div>
                <p class='title'>Sell your this chapter on the Ethereum Blockchain</p>
                <p>Click the button below to create an ERC1155 token of your book.
                    You will be able to sell your book tokens on any of the web3 marketplaces.</p>
                    
                    <label>How many tokens would you like to mint? 
                        <input type='number' min='1' v-model='tokenMints' />
                    </label>
                    <button @click='createToken'>Create token</button>
            </div>
            <div class='content'>
                {{ content }}
            </div>
        </div>
    `,
    data() {
        return {
            id: null,
            title: null,
            content: null,
            metadataURI: null,
            tokenMints: 1,
            // bookID: null,
            // popup: false,
        }
    },
    props: ['bookID', 'chapterID'],

    computed: {
        popup: () => chapterStore.getters.showEditor
    },

    methods: {
        close() {
            chapterStore.commit('closeEditor');
        },
        fetchChapter() {
            return bookAPI.fetchChapter(this.bookID, this.chapterID)
                .then(res => {
                    this.id = res.id;
                    this.title = res.title;
                    this.content = res.content;
                    this.metadataURI = res.metadataURI;
                });
        },
        createToken() {
            const metadataURI = this.metadataURI;
            const amount = this.tokenMints;

            return libraverseToken.create(metadataURI, amount)
            .then(tokenID => {
                console.log('token id:', tokenID);
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
        chapterID(id) {
            return this.fetchChapter();
        }
    },

    mounted() {
        return this.fetchChapter();
    }
}

// chapterEditor.mount('#chapter-editor');
