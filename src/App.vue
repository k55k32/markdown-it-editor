<template lang="pug">
#app
  editor(v-model="content" height="100%", :options="options")
</template>

<script>
import editor from './components/markdown-editer'
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
            } catch (e) {
              console.log(e)
            }
          }
          return ''
        }
      }
    }
  }
}
</script>

<style lang="css">
body{
  margin:0;
  padding: 0;
}
#app{
  width: 100vw;
  height: 100vh;
}
</style>
