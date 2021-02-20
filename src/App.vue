<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
      </div>

      <v-spacer></v-spacer>

      <Login
        v-if="!authenticated"
      />
      <Logout v-else/>
      <Register
        v-if="!authenticated"
      />
      <Publish
        v-if="authenticated"
      />

    </v-app-bar>

    <v-main>

      <p><b>NimTok</b> is a social media platform that is Open Source, blockchain integrated, fully decentralized, free and fun to use.</p>
      <h2>Why does this matter?</h2>
      <h3>Open Source</h3>
      <p>If you spot a mispelled word, or would like to update the documentation, or perhaps you found a bug, you are free to do someting about it.</p>
      <p>Just visit <a href="https://github.com/btimby/nimtok/" target="_blank">the git repository</a>, fork the repository and make a pull request. Perhaps after some back and forth, your changes may be approved and immediately deployed to the website.</p>
      <h3>Blockchain Aware</h3>
      <p>NimTok integrates with <a href="https://nimiq.com" target="_blank">Nimiq</a>, the first browser-compatible blockchain. This means as you use this site, you are mining for NIM (the currency of the Nimiq blockchain).</p>
      <p>This NIM can be instantly sent to celebrities, accounts you follow, your followers, or anyone who you think shared something worthy of a tip.</p>
      <p>NIM can be spent within the platform or instantly exchanged for other cryptocurrency. You can also transfer in cryptocurrency as NIM to use within the platform.</p>
      <h3>Fully Decentralized</h3>
      <p>This platform is hosted on a <a href="https://ipfs.io/" target="_blank">peer to peer network</a> which means it is not controlled by any one organization. Further, the service cannot be shut down or inhibited by oligarchs.</p>
      <h3>Fun To Use</h3>
      <p>A lot of effort was put into making the UX sleek and usable. Also the features are meant to promote kindness through negative re-enforcement. For example, posted messages are dispatched to the followers of anyone mentioned in the message. This affords the opposition a chance to address any slander right away.</p>

    </v-main>
  </v-app>
</template>

<script>
import Login from '@/components/Login';
import Logout from '@/components/Logout';
import Register from '@/components/Register';
import Publish from '@/components/Publish';
import { mapGetters } from 'vuex';


export default {
  name: 'App',

  components: {
    Login,
    Logout,
    Register,
    Publish,
  },

  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      me: 'auth/me',
    }),
  },

  data: () => ({
  }),

  methods: {
  },
};
</script>
