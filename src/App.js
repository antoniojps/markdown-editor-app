import React, { useRef, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import AceEditor from 'react-ace'
import 'brace/mode/markdown'
import 'brace/theme/dracula'
import './App.css'

const { ipcRenderer } = window.require('electron')

function App() {
  // equivelant of code in the constructor
  const ref = useRef(false)
  const [file, setFile] = useState(null)
  if (!ref.current) {
    // code that we only want to run once before render
    ipcRenderer.on('new-file', (event, fileContent) => {
      setFile(fileContent)
    })
    ref.current = true
  }
  return (
    <div className="App">
      {file ? (
        <>
          <AceEditor
            mode="markdown"
            theme="dracula"
            onChange={newFile => setFile(newFile)}
            name="markdown-editor"
            value={file}
          />
          <Markdown>{file}</Markdown>
        </>
      ) : (
        <h1>Open up a markdown file!</h1>
      )}
    </div>
  )
}

export default App
