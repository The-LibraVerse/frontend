import { isLoggedIn, logout } from '/src/api/user.js';
import ConnectWallet from '/shared/connectWallet.js';

const app = Vue.createApp({
    components: {ConnectWallet},
    template: `
        <div class='site-header'>
            <a class='site-logo site-logo_text' href='/'>Libraverse</a>
            <a v-if='!loggedIn' class='link right' href='/login'>Login</a>
            <a v-if='loggedIn' class='link right' href='/dashboard'>Dashboard</a>
            <a v-if='loggedIn' class='link right' href='/profile'>Profile</a>
            <button v-if='loggedIn' class='button right' @click='logout'>Logout</button>

            <ConnectWallet>
            </ConnectWallet>
        </div>
    `,
    data() {
        return {
            loggedIn: null
        }
    },
    methods: {
        logout() {
            return logout()
                .then(res => {
                    console.log('lgout response', res);
                    window.location.reload();
                });
        },
    },
    mounted() {
        return isLoggedIn()
        .then(res => this.loggedIn = res);
    }
});

app.mount('#menu');
