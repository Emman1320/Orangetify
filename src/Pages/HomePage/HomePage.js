import React, { useState } from "react";
import "./HomePage.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TodoList from "./TodoList";
const HomePage = () => {
  const navigate = useNavigate();
  const purple = { color: "#541690" };
  const red = { color: "#FF4949" };
  const orange = { color: "#FF8D29" };
  const yellow = { color: "#FFCD38" };
  return (
    <div className="App">
      <div className="todoContainer">
        <TodoList />
      </div>
    </div>
  );
};

export default HomePage;
