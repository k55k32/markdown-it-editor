<template lang="jade">
#app
  editor(v-model="content" height="100vh")
</template>

<script>
import editor from './components/MarkdownEditor'
const code = '```'
const slash = '/'
export default {
  components: { editor },
  data () {
    return {
      content:
`
# markdown-it-editor

> A Vue.js 2.0 Markdown Rich Text Editor

## install
${code}node
npm i markdown-it-editor -S
${code}

## Quick Start
${code}html
<template>
<div id="app">
  <markdown-editor v-model="content"></markdown-editor>
</div>
</template>

<script>
import MarkdownEditor from './components/MarkdownEditor'
export default {
  components: { MarkdownEditor },
  data () {
    return {
      content: 'hello world'
    }
  }
}
<${slash}script>

<style lang="css">
#app{
  margin: auto;
  padding-top: 20px;
  height: 80vh;
  width: 80vw;
}
</style>
${code}
`
    }
  }
}
</script>

<style lang="css">
</style>
