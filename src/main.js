// import MarkdownEditor from './components/MarkdownEditor.vue'
// import MarkdownPreview from './components/MarkdownPreview'

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.component('MarkdownEditor', MarkdownEditor)
//   window.Vue.component('MarkdownPreview', MarkdownPreview)
// }

// module.exports = { MarkdownEditor, MarkdownPreview }

import Vue from 'vue/dist/vue.js'
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
