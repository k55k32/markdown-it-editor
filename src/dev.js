import Vue from 'vue'
import editor from './components/MarkdownEditor'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<editor/>',
  components: {editor}
})
