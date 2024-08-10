import React, { useState } from "react";

import './Main.css';

import Button from "@mui/material/Button";
import { Paper } from "@mui/material";

const Main = () => {

  return (
    <main className="mainWrapper">
      <div className="responseWrapper">
      </div>
      <div className="uploadFileWrapper">
        <Button variant="contained" sx={{width:"20vw"}}>送信</Button>
      </div>
    </main>
  )
}

export default Main
