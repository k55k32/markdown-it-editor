import MarkdownPreview from './components/MarkdownPreview'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('MarkdownPreview', MarkdownPreview)
}

module.exports = MarkdownPreview
