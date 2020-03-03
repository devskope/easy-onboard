import React from "react";
import { BrowserRouter, Link } from 'react-router-dom';
import { Divider, Image } from "semantic-ui-react";


import logo from "./logo.png";
import "./App.css";
import Routes from "./router";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <Image
            as={Link}
            centered
            src={logo}
            alt="logo"
            size="small"
            to="/"
          />
        </header>
        <Divider section />
        <Routes />
      </BrowserRouter>
    </div>
  );
};

export default App;
