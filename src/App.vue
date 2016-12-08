<template lang="jade">
#app
  editor(v-model="content" height="20vh")
</template>

<script>
import editor from './components/MarkdownEditor'
const content = require('../README.md')
export default {
  components: { editor },
  data () {
    return {
      content: content
    }
  }
}
</script>

<style lang="css">
#app{
  background: #eee;
  height: 30vh;
  width: 80vw;
}
</style>
