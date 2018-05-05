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
      let {plugins, ...otherOptions} = this.options // Separate plugins from the other options
      let options = {
        html: true,
        breaks: true,
        ...otherOptions
      }
      let mdownitOptions = markdownIt(options)
      this.markdownit = plugins ? plugins.reduce((returned, item) => returned.use(item), mdownitOptions) : markdownIt(options) // Pass every plugin in the array to markdown-it
      this.renderIt()
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
