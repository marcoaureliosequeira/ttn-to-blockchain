<template>
  <div>
    <label for="flavor">Favorite ice cream flavor?</label>
    <input @input="changed" id="flavor" name="flavor">
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    methods: {
      ...mapActions(['getBlockchainData']),

      changed: function(event) {
        this.getBlockchainData();
        this.$store.commit('change', event.target.value)
      }
    },
    beforeCreate() {

    },
    created() {
      //this.$store.commit('getDataFromBlockchain');
    }
  }
</script>