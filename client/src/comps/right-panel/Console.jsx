import React from 'react';
import { useTheme } from '@emotion/react';
import Terminal from 'react-console-emulator';

export default function Console({ consoleText }) {
    const theme = useTheme();

    const commands = {
        echo: {
            description: 'Echo a message',
            usage: 'echo <text>',
            fn: (...args) => args.join(" "),
        },
    };

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
                commands={commands}
                welcomeMessage={consoleText}
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
