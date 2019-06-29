<template>
  <div id="app">
    <EmailExtractorTool/>
  </div>
</template>

<script>
import EmailExtractorTool from './components/EmailExtractorTool.vue'

export default {
  name: 'app',
  components: {
    EmailExtractorTool
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
.disable-dbl-tap-zoom {
  touch-action: manipulation;
}
</style>
