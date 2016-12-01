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
      content: 'hello world'
    }
  }
}
</script>

<style lang="css">
#app{
  margin: auto;
  padding-top: 20px;
  height: 80vh;
  width: 80vw;
}
</style>
