<template lang="jade">
#app
  editor(v-model="content" height="100%", :options="options" plugin={plugin} )
</template>

<script>
// import plugins
import mdFontawesome from 'markdown-it-fontawesome'
import mdAnchor from 'markdown-it-anchor'

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
        },
        plugin: [mdFontawesome, mdAnchor] // pass the plugins as an array in the options
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
