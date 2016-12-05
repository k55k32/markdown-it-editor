<template lang="jade">
#app
  editor(v-model="content" height="100vh")
</template>

<script>
import editor from './components/MarkdownEditor'
const content = require('../README.md')
console.log(content)
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
</style>
