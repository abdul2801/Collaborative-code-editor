import React from "react";
import Slide from "./Slide";
import { Button } from "@mui/material";

function NavTop({selectedFile , onRun , onSave}) {
    return (
        <div>
          <Slide selectedFile={selectedFile} onRun={onRun} onSave={onSave} />
        </div>
    );
}


export default NavTop;