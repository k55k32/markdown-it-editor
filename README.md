
# markdown-it-editor

> A Vue.js 2.0 Markdown Rich Text Editor [@Github](https:/github.com/k55k32/markdown-it-editor)

![preview-image](https://k55k32.github.io/markdown-it-editor/readme/preview.jpg)

## install
```node
npm i markdown-it-editor -S
```

## Quick Start
use .vue template
```html
<template>
<div id="app">
  <markdown-editor v-model="content"></markdown-editor>
</div>
</template>

<script>
import { MarkdownEditor } from 'markdown-it-editor'
import hljs from 'highlightjs' // have to npm install highlight
import 'highlightjs/styles/github.css'  

export default {
  components: { MarkdownEditor },
  data () {
    return {
      content: 'hello world',
      options: {
        highlight (str, lang) { // you can add highlightjs plugin to highlight your code
          if (lang && hljs.getLanguage(lang)) {
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
```
You can also use that in native javascript. In this way you have to include vuejs [@Demo](http://md.diamondfsd.com/static/demo.html)
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <!-- markdown editor style -->
    <link rel="stylesheet" href="../lib/index.css">
  </head>
  <body>
    <div id="app">
      <markdown-editor v-model="content"></markdown-editor>
    </div>
  </body>
  <!-- vuejs -->
  <script src="//cdn.bootcss.com/vue/2.1.4/vue.min.js"></script>
  <!-- markdown editor component -->
  <script src="../lib/index.js"></script>
  <script type="text/javascript">
    var vue = new Vue({
      el: '#app',
      data: { content: '# hello world' }
    })
  </script>
</html>
```


## Component Attributes

 param | description | type | default
 ------- | ------------ | ---- | -----
 v-model | bind-textarea's values |  String  | null
 options | the markdown-it render options| Object | [see details](#attr-options)
 upload |  image upload config | Object | [see details](#attr-upload)
 z-index | when full screen the editor z-index style | number | 1
 height | editor height style | string,number| stirng: 50vh

## Events
all event if `return false`, the default function will not execute

name | description | param
--- | --- | ---
custom-upload | defautl upload function use html5's `window.FormData` implement.You can replace other implement | upload input's dom
upload-success | default upload function success event  | the server return value like `xhr.responseText`
upload-error | when the upload faild event | `XMLHttpRequest` object
uploading | upload on progress event | ` { loaded: number, total: number }`


## Params Default Value
<a  id="attr-options"></a>
### options
```javascript
{
    // markdown-it options @more-see
    // https://github.com/markdown-it/markdown-it#init-with-presets-and-options
    html:         true,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                                // This is only for full CommonMark compatibility.
    breaks:       true,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                                // useful for external highlighters.
    linkify:      false,        // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: function (/*str, lang*/) { return ''; }
}
```
<a  id="attr-upload"></a>
### upload
> allow you paste the image to the editor

```javascript
{
    // defualt form upload name
    name: 'file',  
    // default upload accept  
    // @like <input type = 'file' accept='image/jpg,image/jpeg,image/png'/>
    accept: 'image/jpg,image/jpeg,image/png',

    // your  file upload url
    //if url == null or other params 'false' the upload button will hidden
    url: null, // your upload url

    header: {'Authorization': 'you code'}
}
```
