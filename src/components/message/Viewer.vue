<template>
  <div
    id="viewer"
    v-html="innerValue"
    @input="onInput"
  />
</template>

<script>
import { Marked } from '@ts-stack/markdown';


export default {
  name: 'Viewer',

  data() {
    return {
      innerValue: Marked.parse(this.value || '<p><br></p>'),
    };
  },

  methods: {
    onInput(ev) {
      this.$emit('input', ev.target.innerHTML);
    },
  },
}
</script>

<style scoped>
#viewer {
  min-height: 120px;
  padding: 5px;
}
</style>