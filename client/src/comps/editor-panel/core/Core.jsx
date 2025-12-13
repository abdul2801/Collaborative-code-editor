import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import Editor from '@monaco-editor/react';
import blackboardTheme from 'monaco-themes/themes/Blackboard.json';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_SERVER_URL;
const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;

const Core = forwardRef(({ roomId, selectedFile }, ref) => {
  const [editor, setEditor] = useState(null);
  const providerRef = useRef(null);
  const ydocRef = useRef(null);
  const initialBootstrapDone = useRef(false);

  function handleEditorMount(_, monaco) {
    setEditor(_);
    monaco.editor.defineTheme('blackboard', blackboardTheme);
    monaco.editor.setTheme('blackboard');
  }

  // expose API to parent
  useImperativeHandle(ref, () => ({
    getCode() {
      return ydocRef.current
        ?.getText('monaco')
        .toString() || '';
    }
  }));

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const room = `${roomId}-${selectedFile}`;
    const provider = new WebsocketProvider(wsUrl, room, ydoc);
    providerRef.current = provider;

    const bootstrapIfEmpty = async () => {
      const ytext = ydoc.getText('monaco');
      if (ytext.length > 0) return;

      const res = await axios.post(
        `${apiUrl}/file/${selectedFile}`,
        { roomId }
      );

      if (res.data?.content) {
        ydoc.transact(() => {
          ytext.insert(0, res.data.content);
        });
      }
    };

    provider.once('sync', async () => {
      if (!initialBootstrapDone.current) {
        await bootstrapIfEmpty();
        initialBootstrapDone.current = true;
      }
    });

    return () => {
      initialBootstrapDone.current = false;
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId, selectedFile]);

  useEffect(() => {
    if (!editor || !ydocRef.current || !providerRef.current) return;
    const model = editor.getModel();

    const binding = new MonacoBinding(
      ydocRef.current.getText('monaco'),
      editor.getModel(),
      new Set([editor]),
      providerRef.current.awareness
    );

   return () => {
    // Monaco may already be disposed because of key change
    if (!model.isDisposed()) {
      binding.destroy();
    }
  };
  }, [editor]);

  return (
    <Editor
      key={`${roomId}-${selectedFile}`}
      height="94.52vh"
      defaultLanguage="javascript"
      onMount={handleEditorMount}
    />
  );
});

export default Core;
