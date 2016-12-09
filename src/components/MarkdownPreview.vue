<template lang="jade">
.markdown__editor-preview.markdown-body(v-html="html")
</template>

<script>
import markdownIt from 'markdown-it'
export default {
  props: ['content', 'options'],
  data () {
    return {
      html: ''
    }
  },
  watch: {
    content () {
      this.renderIt()
    },
    options: {
      deep: true,
      handler () {
        this.initMarkdown()
      }
    }
  },
  methods: {
    getText () {
      return this.$el.innerText
    },
    renderIt () {
      this.html = this.markdownit.render(this.content)
      this.$nextTick(() => {
        this.$el.querySelectorAll('a').forEach((a) => {
          a.setAttribute('target', '_blank')
        })
      })
    },
    initMarkdown () {
      let options = {
        html: true,
        breaks: true,
        useHighlight: true,
        defaultLang: 'javascript',
        ...this.options
      }
      this.markdownit = markdownIt(options)
      this.renderIt()
      if (options.useHighlight === true) {
        require('highlightjs/styles/github.css')
        const hljs = require('highlightjs')
        options.highlight = (str, lang) => {
          lang = lang || options.defaultLang
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value
            } catch (__) {}
          }
          return ''
        }
        this.markdownit = markdownIt(options)
        this.renderIt()
      }
    }
  },
  created () {
    this.initMarkdown()
  }
}
</script>

<style lang="css">
@import "./styles/github-markdown.css";
.markdown__editor-preview{
  min-width: 20%;
  padding: 10px;
  font-size: 16px;
  overflow: auto;
}
</style>
