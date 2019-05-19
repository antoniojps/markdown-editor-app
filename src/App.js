import React, { useRef, useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import AceEditor from 'react-ace'
import styled from 'styled-components'
import 'brace/mode/markdown'
import 'brace/theme/dracula'
import './App.css'

const { ipcRenderer } = window.require('electron')
const settings = window.require('electron-settings')
const fs = window.require('fs')

function App() {
  const ref = useRef(false)
  const [file, setFile] = useState('')
  const [filesData, setFilesData] = useState([])
  const [directory, setDirectory] = useState(settings.get('directory') || null)

  // equivelant of code in the constructor
  // code that we only want to run once before render
  if (!ref.current) {
    ipcRenderer.on('new-dir', (event, directory) => {
      setDirectory(directory)
      settings.set('directory', directory)
    })
    ipcRenderer.on('new-file', (event, file) => {
      setFile(file)
    })
    ref.current = true
  }

  const loadAndReadFiles = directory => {
    fs.readdir(directory, (err, files) => {
      const filteredFiles = files.filter(file => file.includes('.md'))
      const filesData = filteredFiles.map(markdownFile => ({
        path: `${directory}/${markdownFile}`
      }))
      setFilesData(filesData)
    })
  }

  const loadFile = index => {
    const content = fs.readFileSync(filesData[index].path).toString()
    setFile(content)
  }

  useEffect(() => loadAndReadFiles(directory), [directory])

  return (
    <AppWrap>
      <Header>UA Markdown Editor</Header>
      {directory ? (
        <LayoutSplit>
          <FilesWindow>
            {filesData.map((file, index) => (
              <button key={file.path} onClick={() => loadFile(index)}>
                {file.path}
              </button>
            ))}
          </FilesWindow>
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
    </AppWrap>
  )
}

const AppWrap = styled.div`
  margin-top: 28px;
`

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
  z-index: 999;
  -webkit-app-region: drag;
`

const LayoutSplit = styled.div`
  display: flex;
  height: 100vh;
`

const FilesWindow = styled.div`
  background: #140f1d;
  border-right: solid 1px #302b3a;
  position: relative;
  width: 20%;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.3) inset;
  }
`

const CodeWindow = styled.div`
  flex: 1;
  background-color: #191324;
  padding-top: 2rem;
`

const RenderedWindow = styled.div`
  padding-top: 2rem;

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
