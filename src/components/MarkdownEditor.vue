<template lang="jade">
.markdown__editor(:class="{fullscreen:fullScreen}")
  .markdown__editor-wrapper
    .markdown__editor-tool
      .action-group
        i.iconfont.icon-bold(@click="doCode('**')" hotkey="ctrl+b")
        i.iconfont.icon-italic(@click="doCode('*')" hotkey="ctrl+i")
        i.iconfont.icon-underline(@click="doAction('<u></u>', 3)" hotkey="ctrl+u")
        i.iconfont.icon-shanchuxian2(@click="doCode('~~')" hotkey="ctrl+d")
        i.iconfont.icon-chain(@click="doAction('[Type Your Link Name](http://)', -1)" hotkey="ctrl+l")
        i.iconfont.icon-image(@click="uploadClick" v-if="uploadOpt.url")
          input(ref="upload", type="file", :name="uploadOpt.name" v-show="0", :accept="uploadOpt.accept" @change="fileUpload")
        i.iconfont.icon-code(@click="toCode()")
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
        textarea.markdown__editor-editor(ref="editor" v-model="content" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" @keydown="keydown")
        .preview-tool(ref="preTool")
          .allow-wrapper(@click.stop="showPreview = !showPreview")
            .allow(:class="{'allow-right':showPreview, 'allow-left':!showPreview}")
        .markdown__editor-preview(ref="preview" v-html="preview" v-show="showPreview", :style="{width: previewWidth + '%'}")
    .markdown__editor-status(:class="statusMessage.type", v-show="statusMessage.show") {{statusMessage.message}}

</template>

<script>
import markdownIt from 'markdown-it'
import 'highlightjs/styles/github.css'

function getEditorSelection (editor) {
  return {
    start: editor.selectionStart,
    end: editor.selectionEnd
  }
}

function setEditorRange (editor, start, length = 0) {
  editor.focus()
  editor.setSelectionRange(start, start + length)
}

export default {
  props: ['value', 'options', 'upload'],
  data () {
    return {
      content: '',
      currentTimeout: '',
      uploadOpt: {
        name: 'file',
        accept: 'image/jpg,image/jpeg,image/png',
        url: 0
      },
      history: [],
      currentIndex: 0,
      showPreview: true,
      previewWidth: 45,
      fullScreen: false,
      dragBegin: 0,
      sizeBegin: 0,
      statusMessage: {type: '', text: '', timeout: 0, show: false}
    }
  },
  computed: {
    preview () {
      return this.markdown__editor.render(this.content)
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
    let options = {
      html: true,
      breaks: true,
      highlight: true,
      defaultLang: 'javascript',
      ...this.options
    }
    this.markdown__editor = markdownIt(options)
    if (options.highlight === true) {
      require.ensure('highlightjs', (require) => {
        const hljs = require('highlightjs')
        options.highlight = (str, lang) => {
          lang = lang || options.defaultLang
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value
            } catch (__) {}
          }
          return ''
        }
        this.markdown__editor = markdownIt(options)
      })
    }
  },
  watch: {
    value (value) {
      if (this.content !== value) this.content = value
    },
    content () {
      this.$emit('input', this.content)
      if (this.content === this.history[this.currentIndex]) return
      window.clearTimeout(this.currentTimeout)
      this.currentTimeout = setTimeout(() => {
        this.saveHistory()
      }, 500)
    },
    currentIndex () {
      this.content = this.history[this.currentIndex]
    }
  },
  methods: {
    _status (type, message, time = message.length / 4 * 1000) {
      this.statusMessage.type = type
      this.statusMessage.message = message
      window.clearTimeout(this.statusMessage.timeout)
      this.statusMessage.timeout = setTimeout(() => {
        this.statusMessage.show = false
      }, time)
      this.statusMessage.show = true
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
    uploadClick () {
      this.$refs.upload.click()
    },
    fileUpload () {
      let input = this.$refs.upload
      let fileData = new window.FormData()
      fileData.append(input.name, input.files[0])
      let xhr = new window.XMLHttpRequest()
      xhr.onload = () => {
        this.insertTo(`\n![alt](${xhr.responseText})\n`)
        this.$emit('upload-success', xhr.responseText)
        this.info('上传成功')
      }
      xhr.onerror = () => {
        this.$emit('upload-error', xhr)
        this.error('上传失败')
      }
      xhr.upload.onprogress = (e) => {
        let pre = e.loaded / e.total
        this.info(`上传中 ${e.loaded} / ${e.total} | ${pre}%`)
      }
      // xhr.onreadystatechange = () => {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status !== 200) {
      //       this.$emit('upload-error', xhr)
      //       this.error(`服务器异常 ${xhr.status}`)
      //     }
      //   }
      // }

      xhr.open('POST', this.uploadOpt.url, true)
      xhr.send(fileData)
    },
    beginDrag (e) {
      if (this.showPreview) {
        e.target === this.$refs.preTool && (this.dragBegin = e.screenX)
        this.sizeBegin = this.$refs.preview.clientWidth
        document.body.addEventListener('mousemove', this.moveDrag)
        document.body.addEventListener('mouseup', this.endDrag)
      }
    },
    moveDrag (e) {
      if (this.dragBegin) {
        e.preventDefault()
        let move = e.screenX - this.dragBegin
        let moveWidth = this.sizeBegin - move
        this.$refs.preview.style.width = moveWidth + 'px'
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
      this.canUndo && this.currentIndex --
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
        let editor = this.$refs.editor
        let {start, end} = getEditorSelection(editor)
        let {before, select, after} = this.selectedStr(start, end, '')
        let lines = select.split('\n')
        lines = lines.map(l => '  ' + l)
        let newInsert = lines.join('\n')
        this.content = before + newInsert + after
        this.$nextTick(() => {
          setEditorRange(editor, before.length + 2, newInsert.length)
        })
      }
    },
    toCode () {
      let select = this.getSelectStr()
      let code = '`'
      if (select.indexOf('\n') > -1) {
        code = '```'
      }
      this.doCode(code)
    },
    insertTo (text, position = getEditorSelection(this.$refs.editor).start) {
      let before = this.content.substr(0, position)
      let after = this.content.substr(position)
      this.content = before + text + after
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
@import "./styles/iconfont/iconfont.css";
@border: 2px solid rgba(0, 0, 0, 0.25);

.markdown__editor-preview{
  min-width: 20%;
  padding: 10px;
  font-size: 16px;
  overflow: auto;
  code {
      display: inline-block;
      border: 1px solid rgba(0,0,0,0.08);
      padding: 10px;
      border-radius: 5px;
      background: rgba(0,0,0,0.05);
      margin-bottom: 10px;
  }
  blockquote{
    border-left: 5px solid rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.1);
    padding: 10px;
    margin-bottom: 10px;
  }
  img{
    max-width: 100%;
  }
}
.markdown__editor-status{
  position: absolute;
  bottom: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
}

.allow{
  @size: 15px;
  height: @size;
  width: @size;
  border-left:@border;
  border-top:@border;
  &.allow-left{
    transform: rotate(-45deg);
  }
  &.allow-right{
    transform: rotate(135deg);
  }
}
.preview-tool{
  display: flex;
  align-items: center;
  cursor: w-resize;;
  .allow-wrapper{
    padding: 20px 8px;
    &:hover{
      background: rgba(0, 0, 0, 0.1);
      &>.allow{
        border-color: #000;
      }
    }
  }
}
.markdown__editor-tool{
  display: flex;
  overflow-x: auto;
  justify-content: space-between;
  width: 100%;
  padding: 0px 10px;
  .action-group{
    margin-right: 25px;
    display: flex;
    &:last-child{
      margin: 0;
    }
  }
  .iconfont{
    font-size: 1.5em;
    padding:12px 15px;
    &:hover:not(.disabled){
      background: #fff;
      cursor: pointer;
    }
    &.disabled{
      color: #ccc;
    }
  }
}
.markdown__editor{
  & *{
    box-sizing: border-box;
  }
  &.fullscreen{
    top: 0;
    left: 0;
    position: fixed;
  }
  background: #eee;
  height: 100%;
  width: 100%;
  .markdown__editor-wrapper{
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .markdown__editor-content{
    position: relative;
    flex: 1;
    .content-wrapper{
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      .markdown__editor-editor{
        font-size: 16px;
        flex: 1;
        border: 0;
        outline: 0;
        resize: none;
        border-right: 1px solid #eee;
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        background: #fff;
      }
    }
  }
}
</style>
