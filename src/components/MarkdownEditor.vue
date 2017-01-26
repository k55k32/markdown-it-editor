<template lang="jade">
.markdown__editor(:class="{fullscreen:fullScreen}", :style="{zIndex: zIndex || 1, height: realHeight || '50vh'}")
  .markdown__editor-wrapper
    .markdown__editor-tool(@mouseover="toolover" @mouseout="toolout")
      .action-group
        i.iconfont.icon-bold(@click="doCode('**')" hotkey="ctrl+b")
        i.iconfont.icon-italic(@click="doCode('*')" hotkey="ctrl+i")
        i.iconfont.icon-underline(@click="doAction('<u></u>', 3)" hotkey="ctrl+u")
        i.iconfont.icon-shanchuxian2(@click="doCode('~~')" hotkey="ctrl+d")
        i.iconfont.icon-chain(@click="doAction('[name]()', -1)" hotkey="ctrl+l")
        i.iconfont.icon-image(@click="uploadClick" v-if="uploadOpt.url")
          input(ref="upload", type="file", :name="uploadOpt.name" v-show="0", :accept="uploadOpt.accept" @change="fileUpload")
        i.iconfont.icon-code(@click="toCode()" hotkey="ctrl+`")
        i.iconfont.icon-ellipsish(@click="doAction('\\n\\n---\\n\\n', 0, '')")
        i.iconfont.icon-quoteleft(@click="doAction('\\n> ', -1, '')")
      .action-group
        i.iconfont.icon-mailreply(@click="undo()", :class="{disabled: !canUndo}" hotkey="ctrl+z")
        i.iconfont.icon-mailforward(@click="redo()", :class="{disabled: !canRedo}" hotkey="ctrl+y")
      .action-group
        i.iconfont.icon-compress(@click="toggleFullScreen" v-if="fullScreen")
        i.iconfont.icon-expand(@click="toggleFullScreen" v-else)
    .markdown__editor-content
      .content-wrapper(@mousedown="beginDrag")
        textarea.markdown__editor-editor(@paste="pasteEvent" @scroll="scrollReset" ref="editor" v-model="content" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" @keydown="keydown")
        .preview-tool(ref="preTool")
          .allow-wrapper(@click.stop="showPreview = !showPreview")
            .allow(:class="{'allow-right':showPreview, 'allow-left':!showPreview}")
        preview(ref="preview", :content="content", :options="options", v-show="showPreview", :style="{width: previewWidth}")
    .hotkey-remind(v-show="hotkeyRemind.show", :style="{top: hotkeyRemind.top, left: hotkeyRemind.left}") {{hotkeyRemind.text}}
    transition(enter-active-class="fade in" leave-active-class="fade out")
      .markdown__editor-status(:class="statusMessage.type", v-show="statusMessage.show") {{statusMessage.text}}
</template>

<script>
function getEditorSelection (editor) {
  return {
    start: editor.selectionStart,
    end: editor.selectionEnd
  }
}

function setEditorRange (editor, start, length = 0) {
  editor.setSelectionRange(start, start + length)
  editor.focus()
}
import Preview from './MarkdownPreview'
export default {
  props: ['value', 'options', 'upload', 'zIndex', 'height'],
  data () {
    return {
      content: '',
      preview: '',
      currentTimeout: '',
      uploadOpt: {
        name: 'file',
        accept: 'image/jpg,image/jpeg,image/png',
        url: 0,
        header: {}
      },
      history: [],
      currentIndex: 0,
      showPreview: true,
      previewWidth: '45%',
      fullScreen: false,
      dragBegin: 0,
      sizeBegin: 0,
      hotkeyRemind: {show: false, text: '', top: 0, left: 0},
      statusMessage: {type: '', text: '', timeout: 0, show: false}
    }
  },
  components: { Preview },
  computed: {
    realHeight () {
      if (this.fullScreen) return '100%'
      return this.height
    },
    canUndo () {
      return this.currentIndex > 0
    },
    canRedo () {
      return this.currentIndex < this.history.length - 1
    }
  },
  created () {
    this.uploadOpt = {...this.uploadOpt, ...this.upload}
    this.content = this.value
    this.history.push(this.content)
  },
  watch: {
    value (value) {
      if (this.content !== value) this.content = value
    },
    content () {
      this.$emit('input', this.content)
      this.scrollReset()
      if (this.content === this.history[this.currentIndex]) return
      window.clearTimeout(this.currentTimeout)
      this.currentTimeout = setTimeout(() => {
        this.saveHistory()
        this.$emit('save-history')
      }, 500)
    },
    currentIndex () {
      let history = this.history[this.currentIndex]
      this.content = history
    }
  },
  methods: {
    pasteEvent (event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (let index in items) {
        let item = items[index]
        if (item.kind === 'file') {
          let blob = item.getAsFile()
          let fileData = new window.FormData()
          fileData.append(this.uploadOpt.name, blob)
          this.uploadFormData(fileData)
        }
      }
    },
    getText () {
      return this.$refs.preview.getText()
    },
    getHtml () {
      return this.$refs.preview.html
    },
    scrollReset () {
      if (this.showPreview) {
        let tag = this.$refs.editor
        let scrollHeight = (tag.scrollHeight - tag.clientHeight) || tag.scrollHeight
        let scroll = tag.scrollTop / scrollHeight
        if (scroll > 0.7) scroll += 0.1
        let preview = this.$refs.preview.$el
        let preTop = (preview.scrollHeight - tag.clientHeight) * scroll
        preview.scrollTop = preTop
      }
    },
    _status (type, text, time = text.length / 4 * 1000) {
      window.clearTimeout(this.statusMessage.timeout)
      let timeout = setTimeout(() => {
        this.statusMessage.show = false
      }, time)
      this.statusMessage = {type, text, timeout, show: true}
    },
    success (message, timeout) {
      this._status('success', message, timeout)
    },
    error (message, timeout) {
      this._status('error', message, timeout)
    },
    info (message, timeout) {
      this._status('info', message, timeout)
    },
    closeStatus () {
      this.statusMessage.show = false
    },
    toolout () {
      this.hotkeyRemind.show = false
    },
    toolover (e) {
      let tg = e.target
      let hk = tg.getAttribute('hotkey')
      let hotkeyRemind = this.hotkeyRemind
      if (hk) {
        let remind = 'hot key: ' + hk
        hotkeyRemind.left = e.x - e.offsetX + 'px'
        hotkeyRemind.top = e.y + tg.clientHeight - e.offsetY + 'px'
        hotkeyRemind.text = remind.toUpperCase()
        hotkeyRemind.show = true
      } else {
        hotkeyRemind.show = false
      }
    },
    uploadClick () {
      this.$refs.upload.click()
    },
    fileUpload () {
      let input = this.$refs.upload
      let upload = this.$emit('custom-upload', input)
      if (upload === false) return
      let fileData = new window.FormData()
      fileData.append(input.name, input.files[0])
      this.uploadFormData(fileData)
    },
    uploadFormData (formData) {
      if (!this.uploadOpt.url) {
        this.error('请先配置上传路径')
        return false
      }
      let xhr = new window.XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let success = this.$emit('upload-success', xhr.responseText)
            if (success !== false) {
              this.insertTo(`\n![alt](${xhr.responseText})\n`)
            }
          } else {
            let error = this.$emit('upload-error', xhr)
            if (error !== false) {
              this.error('上传失败')
            }
          }
        }
      }
      xhr.upload.onprogress = (e) => {
        let upload = this.$emit('uploading', { loaded: e.loaded, total: e.total })
        if (upload !== false) {
          let pre = e.loaded / e.total
          this.info(`上传中 ${e.loaded} / ${e.total} | ${pre}%`)
        }
      }
      xhr.open('POST', this.uploadOpt.url, true)
      if (this.uploadOpt.header) {
        Object.keys(this.uploadOpt.header).forEach(k => {
          xhr.setRequestHeader(k, this.uploadOpt.header[k])
        })
      }
      xhr.send(formData)
    },
    beginDrag (e) {
      if (this.showPreview) {
        e.target === this.$refs.preTool && (this.dragBegin = e.screenX)
        this.sizeBegin = this.$refs.preview.$el.clientWidth
        document.body.addEventListener('mousemove', this.moveDrag)
        document.body.addEventListener('mouseup', this.endDrag)
      }
    },
    moveDrag (e) {
      if (this.dragBegin) {
        e.preventDefault()
        let move = e.screenX - this.dragBegin
        let moveWidth = this.sizeBegin - move
        this.previewWidth = moveWidth + 'px'
      }
    },
    endDrag (e) {
      e.preventDefault()
      this.dragBegin = false
      document.body.removeEventListener('moveDrag', this.moveDrag)
      document.body.removeEventListener('mouseup', this.endDrag)
    },
    closeFullScreen () {
      this.fullScreen = false
    },
    openFullScreen () {
      this.fullScreen = true
    },
    toggleFullScreen () {
      this.fullScreen = !this.fullScreen
    },
    saveHistory () {
      this.history.splice(this.currentIndex + 1, this.history.length)
      this.history.push(this.content)
      this.currentIndex = this.history.length - 1
    },
    undo () {
      let start = getEditorSelection(this.$refs.editor).start
      let currentLength = this.content.length
      this.canUndo && this.currentIndex --
      this.$nextTick(() => {
        start -= currentLength - this.content.length
        setEditorRange(this.$refs.editor, start)
      })
    },
    redo () {
      this.canRedo && this.currentIndex ++
    },
    keydown (e) {
      let code = e.key
      if (e.ctrlKey === true) {
        let hotkey = 'ctrl+' + code
        let el = this.$el.querySelector(`[hotkey='${hotkey}']`)
        if (el) {
          e.preventDefault()
          el.click()
        }
      } else if (code === 'Tab') {
        e.preventDefault()
        const TAB_SPACE = '  '
        let editor = this.$refs.editor
        let {start, end} = getEditorSelection(editor)
        let {before, select, after} = this.selectedStr(start, end, '')
        if (select.indexOf('\n') > -1) {
          let beforeLR = before.substr(0, before.lastIndexOf('\n') + 1)
          let afterLR = before.substr(beforeLR.length)
          before = beforeLR
          select = afterLR + select
          let lines = select.split('\n')
          if (e.shiftKey) {
            lines = lines.map(l => l.substr(0, TAB_SPACE.length).replace(/(^\s*)/g, '') + l.substr(TAB_SPACE.length))
          } else {
            lines = lines.map(l => TAB_SPACE + l)
          }
          let newInsert = lines.join('\n')
          this.content = before + newInsert + after
          this.$nextTick(() => {
            setEditorRange(editor, before.length, newInsert.length)
          })
        } else {
          this.insertTo(TAB_SPACE, start)
        }
      }
    },
    toCode () {
      let select = this.getSelectStr()
      if (select.indexOf('\n') > -1) {
        this.insertBetween('```\n', '\n```')
      } else {
        this.doCode('`')
      }
    },
    insertTo (text, position = getEditorSelection(this.$refs.editor).start) {
      let before = this.content.substr(0, position)
      let after = this.content.substr(position)
      this.content = before + text + after
      this.$nextTick(() => {
        setEditorRange(this.$refs.editor, position + text.length)
      })
    },
    insertBetween (actionBefore, actionAfter, defaultStr) {
      let editor = this.$refs.editor
      let {start, end} = getEditorSelection(editor)
      let {before, select, after} = this.selectedStr(start, end, defaultStr)
      let newInsert = actionBefore + select + actionAfter
      this.content = before + newInsert + after
      this.$nextTick(() => {
        setEditorRange(editor, start + actionBefore.length, select.length)
      })
    },
    doAction (action, relativeEnd = 0, dstr) {
      if (relativeEnd <= 0) relativeEnd = action.length + relativeEnd
      let actionBefore = action.substr(0, relativeEnd)
      let actionAfter = action.substr(relativeEnd)
      this.insertBetween(actionBefore, actionAfter, dstr)
    },
    doCode (code, dstr) {
      this.insertBetween(code, code, dstr)
    },
    getSelectStr () {
      let editor = this.$refs.editor
      let {start, end} = getEditorSelection(editor)
      let {select} = this.selectedStr(start, end)
      return select
    },
    selectedStr (start, end, defaultStr = 'default') {
      let before = this.content.substr(0, start)
      let select = this.content.substr(start, end - start) || defaultStr
      let after = this.content.substr(end, this.content.length)
      return {before, select, after}
    }
  }
}
</script>

<style lang="less">
@import "./styles/editor.less";
</style>
