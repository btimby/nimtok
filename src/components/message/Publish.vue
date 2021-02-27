<template>
  <v-form>
    <v-card>
      <v-card-title>What's on your mind?</v-card-title>
      <v-card-text>
        <Mentionable
          :keys="['@', '#']"
          :items="items"
          offset="6"
          insert-space
          @open="onOpen"
        >
          <Editor
            v-model="body"
          />

          <template #no-result>
            <div class="dim">
              No result
            </div>
          </template>

          <template #item-@="{ item }">
            <div class="user">
              {{ item.value }}
              <span class="dim">
                ({{ item.firstName }})
              </span>
            </div>
          </template>

          <template #item-#="{ item }">
            <div class="issue">
              <span class="number">
                #{{ item.value }}
              </span>
              <span class="dim">
                {{ item.label }}
              </span>
            </div>
          </template>
        </Mentionable>
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
import { Mentionable } from 'vue-mention';
import Hashtags from '@/components/message/Hashtags';
import Editor from '@/components/message/Editor';

const PATTERN_HASHTAG = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
const PATTERN_MENTION = /@(\w+)\b/g;

const USERS = [
  {
    value: 'akryum',
    firstName: 'Guillaume',
  },
  {
    value: 'posva',
    firstName: 'Eduardo',
  },
  {
    value: 'atinux',
    firstName: 'Sébastien',
  },
];

const ISSUES = [
  {
    value: 123,
    label: 'Error with foo bar',
    searchText: 'foo bar',
  },
  {
    value: 42,
    label: 'Cannot read line',
    searchText: 'foo bar line',
  },
  {
    value: 77,
    label: 'I have a feature suggestion',
    searchText: 'feature',
  },
];

export default {
  components: {
    Mentionable,
    Hashtags,
    Editor,
  },

  data() {
    return {
      body: null,
      items: [],
    };
  },

  computed: {
    hashtags() {
      const hashtags = {};

      if (this.body) {
        const m = [...this.body.matchAll(PATTERN_HASHTAG)];

        for (let i = 0; i < m.length; i++) {
          hashtags[m[i][2].toLowerCase()] = null;
        }
      }

      return Object.keys(hashtags);
    },

    mentions() {
      const mentions = {};

      if (this.body) {
        const m = [...this.body.matchAll(PATTERN_MENTION)];

        for (let i = 0; i < m.length; i++) {
          mentions[m[i][1]] = null;
        }
      }

      return Object.keys(mentions);
    },
  },

  methods: {
    onPublish() {
      this.$store.dispatch('posts/post', {
        body: this.body,
        hashtags: this.hashtags,
        mentions: this.mentions,
      });
    },

    onRemove(tag) {
      const pattern = new RegExp(`#${tag}\\b\\s*`, 'g');
      this.body = this.body.replace(pattern, '');
    },

    onOpen(key) {
      this.items = key === '@' ? USERS : ISSUES;
    },
  },
};
</script>

<style scoped>

</style>
