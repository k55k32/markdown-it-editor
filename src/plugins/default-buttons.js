export default {
  bold: {
    style: 'iconfont icon-bold',
    hotkey: 'ctrl+b',
    action: (editor) => {
      editor.doCode('**')
    }
  },
  italic: {
    style: 'iconfont icon-italic',
    hotkey: 'ctrl+i',
    action: (editor) => {
      editor.doCode('*')
    }
  },
  underline: {
    style: 'iconfont icon-underline',
    hotkey: 'ctrl+u',
    action: (editor) => {
      editor.doAction('<u></u>', 3)
    }
  },
  deleteline: {
    style: 'iconfont icon-shanchuxian2',
    hotkey: 'ctrl+d',
    action: (editor) => {
      editor.doCode('~~')
    }
  },
  link: {
    style: 'iconfont icon-chain',
    hotkey: 'ctrl+b',
    action: (editor) => {
      editor.doAction('[name]()', -1)
    }
  },
  image: {
    style: 'iconfont icon-image',
    action: (editor) => {
      editor.doCode('**')
    }
  },
  code: {
    style: 'iconfont icon-code',
    hotkey: 'ctrl+`',
    action: (editor) => {
      editor.toCode()
    }
  },
  ellipsish: {
    style: 'iconfont icon-ellipsish',
    action: (editor) => {
      editor.doAction('\\n\\n---\\n\\n', 0, '')
    }
  },
  quoteleft: {
    style: 'iconfont icon-quoteleft',
    action: (editor) => {
      editor.doAction('\\n> ', -1, '')
    }
  },
}