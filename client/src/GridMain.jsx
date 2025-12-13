import React, { useEffect } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Grid2';
import Versions from "./comps/left-panel/Versions";
import Nav from "./comps/right-panel/top-nav/Nav";
import Main from "./comps/right-panel/main";
import NavTop from "./comps/editor-panel/nav-top/NavTop";
import Core from "./comps/editor-panel/core/Core";
import Bottom from "./comps/editor-panel/bottom-nav/Bottom";
import { useWebSocket } from "./WebSocketContext";
import { useAuth } from "./AuthContext";
// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));




export default function GridMain() {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const { roomId } = useAuth();
  const coreRef = React.useRef(null);
  const [terminalOutput, setTerminalOutput] = React.useState('');
  function appendOutput(text) {
    setTerminalOutput(prev => prev + text);
  }


  function handleRun() {
    setTerminalOutput('');
    const code = coreRef.current?.getCode();
    console.log('RUN CODE:', code);
    // → send to JS worker / Pyodide / SQL runner
    // match filetype for different runners
    if (!code) return;
    if (selectedFile.endsWith('.js')) {
      const worker = new Worker(
        new URL('./workers/jsRunner.worker.js', import.meta.url),
        { type: 'module' }
      );

      const timeout = setTimeout(() => {
        worker.terminate();
        console.error('Execution timed out');
      }, 2000);

      worker.onmessage = (e) => {
        clearTimeout(timeout);

        const { logs, result, error } = e.data;

        let output = '';

        if (logs && logs.length) {
          output += logs.join('\n') + '\n';
        }

        if (error) {
          output += `JS ERROR: ${error}\n`;
        }
        else if (result !== undefined) {
          output += `JS RESULT: ${String(result)}\n`;
        }
        appendOutput(output);




        worker.terminate();
      };



      worker.postMessage(code);
    }
    else if (selectedFile.endsWith('.py')) {
      // Pyodide execution logic here
      console.log('PYTHON EXECUTION NOT IMPLEMENTED');
    } else if (selectedFile.endsWith('.sql')) {
      // SQL execution logic here
      console.log('SQL EXECUTION NOT IMPLEMENTED');
    } else {
      console.log('UNSUPPORTED FILE TYPE FOR RUNNING CODE');
    }

  }

  function handleSave() {
    const code = coreRef.current?.getCode();
    console.log('SAVE CODE:', code);
    // → POST to backend
  }

  return (
    <Grid2 container sx={{ padding: '20px' }}>
      <Grid2 size={2.5}>
        <Versions handleFileSelect={(e) => setSelectedFile(e.name)} />
      </Grid2>

      <Grid2 size={6}>
        <NavTop
          selectedFile={selectedFile}
          onRun={handleRun}
          onSave={handleSave}
        />

        {selectedFile && (
          <Core
            ref={coreRef}
            roomId={roomId}
            selectedFile={selectedFile}
          />
        )}
      </Grid2>

      <Grid2 size="grow">
        <Main consoleText={terminalOutput}/>
      </Grid2>
    </Grid2>
  );
}
