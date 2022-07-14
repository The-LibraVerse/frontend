import { isLoggedIn, logout } from '/src/api/user.js';
import ConnectWallet from '/shared/connectWallet.js';

const app = Vue.createApp({
    components: {ConnectWallet},
    template: `
        <div>
            <a href='/'>Libraverse</a>
            <a v-if='!loggedIn' class='right' href='/login'>Login</a>
            <a v-if='loggedIn' class='right' href='/dashboard'>Dashboard</a>
            <a v-if='loggedIn' class='right' href='/profile'>Profile</a>
            <button @click='logout' v-if='loggedIn' class='right'>Logout</button>

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
