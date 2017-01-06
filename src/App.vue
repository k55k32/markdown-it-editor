<template lang="jade">
#app
  editor(v-model="content" height="100%", :options="options")
</template>

<script>
import editor from './components/MarkdownEditor'
import 'highlightjs/styles/github.css'
import hljs from 'highlightjs'
const content = require('../README.md')
export default {
  components: { editor },
  data () {
    return {
      content: content,
      options: {
        highlight (str, lang) {
          lang = lang || 'javascript'
          if (hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value
            } catch (__) {}
          }
          return ''
        }
      }
    }
  }
}
</script>

<style lang="css">
#app{
  width: 100vw;
  height: 100vh;
}
</style>
