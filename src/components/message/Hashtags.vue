<template>
  <div class="text-center">
    <v-chip
      v-for="(tag, i) in value"
      :key="i"
      close
      small
      class="spaced"
      @click:close="onRemove(tag)"
    >{{ tag }}</v-chip>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onRemove(tag) {
      this.$emit('remove', tag);
    },
  },
};
</script>

<style scoped>
.spaced {
  margin-left: 5px;
}
</style>
