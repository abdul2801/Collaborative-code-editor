import React, { useEffect, useRef } from 'react';
import { useTheme } from '@emotion/react';
import Terminal from 'react-console-emulator';

export default function Console({ consoleText }) {
  const theme = useTheme();
  const terminalRef = useRef(null);

  

  useEffect(() => {
    if (!terminalRef.current || !consoleText) return;

    terminalRef.current.pushToStdout(consoleText);
  }, [consoleText]);

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: '10px',
        fontFamily: 'monospace',
        overflow: 'hidden',
        height: '92.3vh',
      }}
    >
      <Terminal
        ref={terminalRef}
        // commands={commands}
        promptLabel=">"
        style={{
          height: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
        }}
      />
    </div>
  );
}
