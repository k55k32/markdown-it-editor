import MarkdownEditor from './components/MarkdownEditor.vue'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('MarkdownEditor', MarkdownEditor)
  console.log('register markdown editor')
}

module.exports = MarkdownEditor
