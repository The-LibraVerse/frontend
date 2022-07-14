import { isLoggedIn, logout } from '/src/api/user.js';
import ConnectWallet from '/shared/connectWallet.js';

const app = Vue.createApp({
    components: {ConnectWallet},
    template: `
        <div class='site-header'>
            <a class='site-logo site-header__logo' href='/'>
                <img class='site-header__logo-image' src='/assets/logo.png' />
                <span class='site-header__logo-text'>Libraverse</span>
            </a>

            <button @click='expandMenu=!expandMenu' class='button menu-expander mobile-only'>
                <span v-if='expandMenu'>Close</span>
                <span v-else>Menu</span>
            </button>

            <img v-if='loggedIn' class='site-header__user-avatar' @click='hideLogoutOnDesktop=!hideLogoutOnDesktop' />

            <div class='site-header__menu menu' :class='{"hide-on-mobile": !expandMenu}'>
                <a v-if='loggedIn' class='link menu__link' href='/dashboard'>Dashboard</a>
                <a v-if='loggedIn' class='link menu__link' href='/profile'>Profile</a>
                <a v-if='!loggedIn' class='link menu__link' href='/login'>Login</a>
            </div>

            <ConnectWallet class='site-header__dropdown-item' :class='{"hide-on-mobile": !expandMenu}'>
            </ConnectWallet>
            <hr class='mobile-only' :class='{"hide-on-mobile": !expandMenu}' style='width:100%' />
            <button v-if='loggedIn' :class='{"hide-on-mobile": !expandMenu, "hide-on-desktop": hideLogoutOnDesktop}'
                class='site-header__dropdown-item link site-header__logout' @click='logout'>Logout</button>
        </div>
    `,
    data() {
        return {
            loggedIn: null,
            expandMenu: false,
            hideLogoutOnDesktop: true,
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
