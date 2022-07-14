import { isLoggedIn, logout } from '/src/api/user.js';
import {getAddress, getProvider, connect as connectWallet, disconnect as disconnectWallet} from '/src/api/wallet.js';

const template =  `
    <div class='user-wallet'>
        <span v-if='walletConnected && address' class='user-wallet__address'>{{ address }}</span>
        <button class='button user-wallet__connect-button' v-if='!walletConnected' @click='connectWallet'>
            <span class='user-wallet__connect-title' v-if='title'>{{ title }}</span>
            <div class='user-wallet__image' v-else-if='image'>
                <img :src='image' />
            </div>
            <template v-else>
                <span class='connect-wallet-button__image'>Connect Wallet</span>
            </template>
        </button>

        <div role='image' v-else>
            <button class='user-wallet__disconnect-button button button_danger' @click='disconnectWallet'>
                Disconnect Wallet
            </button>
        </div>
    </div>
`;

export default {
    template,
    props: {
        title: String,
        image: String
    },
    data() {
        return {
            loggedIn: null,
            userAddress: null,
        }
    },
    computed: {
        address() {
            const addr = getAddress();

            if(addr)
                return addr.substring(0, 5) + '...' + addr.slice(-3);
            else return null;
        },
        walletConnected() {
            const provider = getProvider();
            const address = getAddress();
            let isConnected = false;

            if(address)
                isConnected = true;
            return isConnected;
        }
    },
    methods: {
        connectWallet() {
            return connectWallet()
            .then(res => {
                this.userAddress = getAddress();
            });
        },
        disconnectWallet() {
            return disconnectWallet();
        },
    },
    mounted() {
        return isLoggedIn()
        .then(res => this.loggedIn = res);
    }
}
