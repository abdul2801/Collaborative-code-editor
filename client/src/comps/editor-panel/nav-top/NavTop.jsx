import React from "react";
import Slide from "./Slide";

function NavTop({selectedFile}) {
    return (
        <div>
          <Slide selectedFile={selectedFile} />
        </div>
    );
}


export default NavTop;