<template>
  <div class="video-wrapper">
    <stream src="aaa0dcc8b69be8ef4683a87488771209" preload autoplay loop mute></stream>
  </div>
</template>

<script>

  export default {}

</script>

<style lang="scss" scoped>

 .video-wrapper {
   position: fixed;
   width: 100vw;
   height: 100vh;
   background: #000;
   overflow: hidden;
 }

  stream {
    height: 100%;
    width: 100vh * 16 / 9;
    min-width: 100%;
    min-height: 100vw * 9 / 16;
  }

</style>
