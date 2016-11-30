<template lang="jade">
#app
  editor(v-model="content")
</template>

<script>
import editor from './components/MarkdownEditor'
export default {
  components: { editor },
  data () {
    return {
      content: 'hello'
    }
  }
}
</script>

<style lang="css">
#app{
  height: 80vh;
  width: 80vw;
}
</style>
