<template>
  <v-form>
    <v-card>
      <v-card-title>What's on your mind?</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="body"
        />
        <Hashtags
          v-model="hashtags"
          @remove="onRemove"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="onPublish"
        >Post</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import Hashtags from '@/components/message/Hashtags';

const PATTERN_HASHTAG = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
const PATTERN_MENTION = /@(\w+)\b/g;

export default {
  components: {
    Hashtags,
  },

  data() {
    return {
      body: null,
    };
  },

  computed: {
    hashtags() {
      const hashtags = {};

      if (this.body) {
        const m = [...this.body.matchAll(PATTERN_HASHTAG)];

        for (let i in m) {
          hashtags[m[i][2]] = null;
        }
      }

      return Object.keys(hashtags);
    },

    mentions() {
      const mentions = {};

      if (this.body) {
        const m = [...this.body.matchAll(PATTERN_MENTION)];

        for (let i in m) {
          mentions[m[i][1]] = null;
        }
      }

      return Object.keys(mentions);
    },
  },

  methods: {
    onPublish() {
      this.$store.dispatch('posts/create', {
        body: this.body,
        hashtags: this.hashtags,
        mentions: this.mentions,
      });
    },

    onRemove(tag) {
      const pattern = new RegExp(`#${tag}\\b\\s*`, 'g');
      this.body = this.body.replace(pattern, '');
    },
  }
}
</script>

<style scoped>

</style>