<template>
  <div
    @input="onInput"
    v-html="innerValue"
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

</style>