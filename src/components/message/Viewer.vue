<template>
  <div
    id="viewer"
    v-html="innerValue"
    @input="onInput"
  />
</template>

<script>
import TurndownService from 'turndown';
import { Marked } from '@ts-stack/markdown';

const TURNDOWN = new TurndownService({
  emDelimiter: '_',
  linkStyle: 'inlined',
  headingStle: 'atx',
});

export default {
  name: 'Viewer',

  data() {
    return {
      innerValue: Marked.parse(this.value || '<p><br></p>'),
    };
  },

  methods: {
    onInput(ev) {
      this.$emit('input', TURNDOWN.turndown(ev.target.innerHTML));
    },
  },
};
</script>

<style scoped>
#viewer {
  min-height: 120px;
  padding: 5px;
}
</style>
