<template>
  <div>
    <v-container>
      <button @click="apply('bold')" class="button">
        <v-icon>mdi-format-bold</v-icon>
      </button>
      <button @click="apply('italic')" class="button">
        <v-icon>mdi-format-italic</v-icon>
      </button>
      <button @click="apply('formatBlock', false, '<h1>')" class="button">
        <v-icon>mdi-format-header-1</v-icon>
      </button>
      <button @click="apply('insertUnorderedList')" class="button">
        <v-icon>mdi-format-list-bulleted</v-icon>
      </button>
      <button @click="apply('insertOrderedList')" class="button">
        <v-icon>mdi-format-list-numbered</v-icon>
      </button>
      <button @click="apply('undo')" class="button">
        <v-icon>mdi-undo-variant</v-icon>
      </button>
      <button @click="apply('redo')" class="button">
        <v-icon>mdi-redo-variant</v-icon>
      </button>
    </v-container>

    <Viewer
      :value="value"
      class="viewer"
      ref="viewer"
      @input="onInput"
    />
  </div>
</template>

<script>
import Viewer from '@/components/message/Viewer';

export default {
  name: 'Editor',

  components: {
    Viewer,
  },

  props: {
    value: String,
  },

  mounted() {
    setImmediate(() => {
      this.$refs.viewer.$el.setAttribute('contenteditable', 'true');
      this.apply('defaultParagraphSeparator', false, '<p>');
    });
  },

  methods: {
    apply(cmd, ...args) {
      document.execCommand(cmd, ...args);
    },

    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style scoped>
.viewer {
  border: 1px solid gray;
}
</style>
