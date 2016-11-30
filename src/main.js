import MarkdownEditor from './components/MarkdownEditor.vue'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('MarkdownEditor', MarkdownEditor)
}

module.exports = MarkdownEditor
