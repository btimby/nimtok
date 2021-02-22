<template>
  <div>
    <v-tabs
      centered
    >
      <v-tab>Feed</v-tab>
      <v-tab
        href="#publish"
      >Publish</v-tab>
      <v-tab>Private</v-tab>

      <v-tab-item></v-tab-item>
      <v-tab-item
        value="publish"
      >
        <Publish/>
      </v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Publish from '@/components/message/Publish';


export default {
  components: {
    Publish,
  },
}
</script>

<style scoped>

</style>