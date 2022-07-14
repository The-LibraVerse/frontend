import { isLoggedIn, logout } from '/src/api/user.js';
import {getAddress, getProvider, connect as connectWallet, disconnect as disconnectWallet} from '/src/api/wallet.js';

const template =  `
    <div>
        <button v-if='!walletConnected' @click='connectWallet'>
            <span v-if='title'>{{ title }}</span>
            <div v-else-if='image'>
                <img :src='image' />
            </div>
            <template v-else>
                <span>Connect Wallet</span>
            </template>

        </button>

        <div role='image' v-else>
            <span>{{ address }}</span>
            <button @click='disconnectWallet'>
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
        },
    },
    mounted() {
        return isLoggedIn()
        .then(res => this.loggedIn = res);
    }
}
