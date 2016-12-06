import MarkdownEditor from './components/MarkdownEditor.vue'
import MarkdownPreview from './components/Preview'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('MarkdownEditor', MarkdownEditor)
  window.Vue.component('MarkdownPreview', MarkdownPreview)
}

module.exports = { MarkdownEditor, MarkdownPreview }
