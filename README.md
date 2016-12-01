# markdown-it-editor

> A Vue.js 2.0 Markdown Rich Text Editor

## install
```node
npm i markdown-it-editor -S
```

## Quick Start
```html
<template>
  <div id="app">
    <markdown-editor v-model="content"></markdown-editor>  
  </div>
</template>

<script>
import MarkdownEditor from 'markdown-it-editor'
export default {
  components: { MarkdownEditor },
  data () {
    return {
      content: '# hello world'
    }
  }
}
</script>

<style lang="css">
#app{
  margin: auto;
  padding-top: 20px;
}
</style>
```
