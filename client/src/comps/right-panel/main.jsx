import React from 'react'
import Nav from './top-nav/Nav'
import { Divider, Typography } from '@mui/material';
import Console from './Console';
import Hosting from './Hosting';

export default function () {
    const [value, setValue] = React.useState(0);
    let consoleText = 'Welcome to your terminal';
    let ins = "Instructions Texdsadasdt";
  
    return (
      <div>
        <Nav value={value} setValue={setValue}/>
        <Divider variant='middle'/>
        <Typography component="div">
          <div style={{ display: value === 0 ? 'block' : 'none' }}>
            <Console consoleText={consoleText} />
          </div>
        
          <div style={{ display: value === 1 ? 'block' : 'none' }}>
            <Hosting consoleText={ins} />
          </div>
        </Typography>

      </div>
    );
}
