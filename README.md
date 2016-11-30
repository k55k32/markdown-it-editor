# markdown-it-editor

> a markdown rich text editor

## For use

``` bash
# install dependencies
npm install markdown-it

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

```javascript
options: {
  ...markdown-it options all support
  ...editor custom options
  highlight: boolean || funciton,
  defaultLang: 'javascript' || string
},

// custom options eg.
if (options.highlight === true) {
  loadHighlightjs(options.defaultLang) // that will beautify your code
  // you can use  
  //"```javascript
  // you code
  //```" to use the highlight
}


upload: {
  file: '',
  url: '',
  accept: ''
}
```
