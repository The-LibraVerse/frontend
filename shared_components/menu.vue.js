import { hideToast, showToast } from '/src/toastFunctions.js';
import { isLoggedIn, logout } from '/src/api/user.js';
import ConnectWallet from '/shared/connectWallet.js';

const app = Vue.createApp({
    components: {ConnectWallet},
    template: `<div>
        <div ref='siteToast' @click='hideToast' id='site-toast' class='notice notice_toast'></div>
        <div class='site-header'>
            <a class='site-logo site-header__logo' href='/'>
                <img class='site-header__logo-image' src='/assets/logo.png' />
                <span class='site-header__logo-text'>Libraverse</span>
            </a>

            <button @click='expandMenu=!expandMenu' class='button site-header__nav-expander mobile-only'>
                <span v-if='expandMenu'>Close</span>
                <span v-else>Menu</span>
            </button>

            <img v-if='loggedIn' class='site-header__user-avatar' @click='hideLogoutOnDesktop=!hideLogoutOnDesktop' />

            <div class='site-header__nav nav' :class='{"hide-on-mobile": !expandMenu}'>
                <a class='link nav__link' href='/books'>Browse All Books</a>
                <a v-if='loggedIn' class='link nav__link' href='/dashboard'>Your Dashboard</a>
                <a v-if='loggedIn' class='link nav__link' href='/new-book'>Create a book</a>
                <a v-if='!loggedIn' class='link nav__link' href='/login'>Login</a>
            </div>

            <ConnectWallet class='site-header__dropdown-item' :class='{"hide-on-mobile": !expandMenu}'>
            </ConnectWallet>
            <hr class='mobile-only' :class='{"hide-on-mobile": !expandMenu}' style='width:100%' />
            <button v-if='loggedIn' :class='{"hide-on-mobile": !expandMenu, "hide-on-desktop": hideLogoutOnDesktop}'
                class='site-header__dropdown-item link site-header__logout' @click='logout'>Logout</button>
        </div>
        <div id='menu-loader-bar' class='loader'>
            <div class='loaderBar'></div>
        </div>
    </div>`,

    data() {
        return {
            loggedIn: null,
            expandMenu: false,
            hideLogoutOnDesktop: true,
        }
    },
    methods: {
        hideToast,
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
