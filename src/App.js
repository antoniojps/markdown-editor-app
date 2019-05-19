import React, { useRef, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import AceEditor from 'react-ace'
import styled from 'styled-components'
import 'brace/mode/markdown'
import 'brace/theme/dracula'
import './App.css'

const { ipcRenderer } = window.require('electron')
const settings = window.require('electron-settings')

function App() {
  // equivelant of code in the constructor
  const ref = useRef(false)
  const [file, setFile] = useState('')
  const [directory, setDirectory] = useState(settings.get('directory') || null)
  if (!ref.current) {
    // code that we only want to run once before render
    ipcRenderer.on('new-dir', (event, filePaths, directory) => {
      setDirectory(directory)
      settings.set('directory', directory)
    })
    ipcRenderer.on('new-file', (event, file) => {
      setFile(file)
    })
    ref.current = true
  }
  return (
    <div className="App">
      <Header>UA Markdown Editor</Header>
      {directory ? (
        <LayoutSplit>
          <CodeWindow>
            <AceEditor
              mode="markdown"
              theme="dracula"
              onChange={newFile => setFile(newFile)}
              name="markdown-editor"
              value={file}
            />
          </CodeWindow>
          <RenderedWindow>
            <Markdown>{file}</Markdown>
          </RenderedWindow>
        </LayoutSplit>
      ) : (
        <h1>No directory</h1>
      )}
    </div>
  )
}

const Header = styled.header`
  background-color: #191324;
  color: #75717c;
  font-size: 0.8rem;
  height: 23px;
  text-align: center;
  position: fixed;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 6px;
  z-index: 10px;
  -webkit-app-region: drag;
`

const LayoutSplit = styled.div`
  display: flex;
  height: 100vh;
`

const CodeWindow = styled.div`
  flex: 1;
  padding-top: 2rem;
  background-color: #191324;
`

const RenderedWindow = styled.div`
  background-color: #191324;
  width: 35%;
  padding: 20px;
  color: #fff;
  border-left: 1px solid #302b3a;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #82d8d8;
  }
  h1 {
    border-bottom: solid 3px #e54b4b;
    padding-bottom: 10px;
  }
  a {
    color: #e54b4b;
  }
`

export default App
