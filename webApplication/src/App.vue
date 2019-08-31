<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Form></Form>
    <Display></Display>
  <vue-data-table></vue-data-table>
  </div>
</template>

<script>
import Form from './components/Form'
import Display from './components/Display'
import VueDataTable from './components/VueDataTable'


export default {
  name: 'app',
  components: {
    Form,
    Display,
    VueDataTable
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
