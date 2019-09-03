<template>
  <div class="vld-parent">
    <loading :active.sync="isLoading"
             :can-cancel="false"
             :is-full-page="fullPage"></loading>
  </div>
</template>

<script>
  // Import component
  import Loading from 'vue-loading-overlay';
  // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        isLoading: false,
        fullPage: true
      }
    },
    components: {
      Loading
    },
    mounted () {
      this.$root.$on('loaderOn', () => {
        this.showLoader();
      });

      this.$root.$on('loaderOff', () => {
        this.cancelLoader();
      });
    },
    methods: {
      showLoader() {
        this.isLoading = true;
      },
      cancelLoader() {
        this.isLoading = false;
      }
    }
  }
</script>