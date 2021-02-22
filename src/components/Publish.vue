<template>
  <v-dialog
    v-model="dialog"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        text
      >
        <v-icon>mdi-note-plus</v-icon>
        <span class="mr-2">Publish</span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="primary"
      >
        <v-toolbar-title>Publish</v-toolbar-title>
      </v-toolbar>
      <v-form>
        <v-container>
          <v-row>
            <v-col>
              <v-textarea
                v-model="post.body"
                label="body"
                required
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-btn
          @click="onPublish"
        >
          Publish
        </v-btn>
        <v-btn
          @click="dialog = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,

      post: {
        body: null,
      },
    };
  },

  methods: {
    onPublish() {
      this.$store.dispatch('posts/create', this.post);
      this.dialog = false;
    },
  }
}
</script>

<style scoped>

</style>