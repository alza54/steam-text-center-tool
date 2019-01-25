<template>
  <div id="app">
    <Preloader></Preloader>
    <MainWrapper></MainWrapper>
  </div>
</template>

<script>

import Preloader from './components/Preloader.vue'
import MainWrapper from './components/Main.vue'

export default {
  components: { Preloader, MainWrapper },
  name: 'app',
  mounted () {
    var lang = navigator.languages
               ? navigator.languages[0]
               : (navigator.language || navigator.userLanguage);
    var accepted = ['pl', 'en'];
    lang = lang.substring(0, 2);
    this.$i18n.locale = accepted.indexOf(lang) !== -1 ? lang : 'en';
  }
}

</script>

<style lang="scss">

body {
  margin: 0;
  padding: 0;
}

#app, #preloader {
  background: $licorice;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

</style>
