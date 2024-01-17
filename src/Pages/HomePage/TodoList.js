import { Delete } from "@mui/icons-material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { SpaceContext } from "../../store/space-provider";
import { db } from "../../firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const TodoList = () => {
  const spaceCtx = useContext(SpaceContext);
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categoryArray, setCategoryArray] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [categoryError, setCategoryError] = useState(false);
  const [clickedDelete, setClickedDelete] = useState([]);
  const onToggleTodo = (index) => {
    setTodos((prev) => {
      const updatedTodos = [...prev];
      updatedTodos[index].checked = !updatedTodos[index].checked;
      const todoRef = doc(db, "todos", "emman");
      updateDoc(todoRef, {
        todoList: updatedTodos,
      });
      return updatedTodos;
    });
  };
  const onAddTodo = () => {
    if (todoTitle) {
      if (!category) {
        setCategoryError(true);
        return;
      }
      const newTodo = {
        id: Math.random(),
        title: todoTitle,
        checked: false,
        category: category,
        timeSpent: "",
      };
      const todoRef = doc(db, "todos", "emman");
      updateDoc(todoRef, {
        todoList: arrayUnion(newTodo),
      });
      setTodos((prev) => [...prev, newTodo]);
      setCategory("");
      setCategoryError(false);
      setTodoTitle("");
    }
  };
  const onDeleteTodo = (id) => {
    setClickedDelete((prev) => [...prev, id]);

    setTimeout(() => {
      setClickedDelete((prev) => prev.filter((itemId) => itemId !== id));
      setTodos((prev) => {
        const updatedTodos = prev.filter((todo) => id !== todo.id);
        const todoRef = doc(db, "todos", "emman");
        updateDoc(todoRef, {
          todoList: updatedTodos,
        });
        return updatedTodos;
      });
    }, 1000);
  };
  const timeSpentChangeHandler = (value, index) => {
    const timePattern = /^(\d+h\s?(?:[1-9]|[1-5]\d)m|[1-9]\d*h|[1-9]\d*m)$/;
    setTodos((prev) => {
      const updatedTodos = [...prev];
      updatedTodos[index].timeSpent = value;
      updatedTodos[index].timeSpentError = !timePattern.test(value);
      return updatedTodos;
    });
  };
  useEffect(() => {
    try {
      const todoRef = doc(db, "todos", "emman");
      getDoc(todoRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTodos(data.todoList || []);
        } else {
          setTodos([]);
        }
        setFetchStatus("success");
      });
    } catch (error) {
      setFetchStatus("failed");
    }
    try {
      const categoryRef = doc(db, "categories", "emman");
      getDoc(categoryRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCategoryArray(data.categories || []);
        } else {
          setCategoryArray([]);
        }
      });
    } catch (error) {}
  }, []);
  return (
    <div className="todoList">
      <div className="todoItem addTodo">
        <Tooltip title="Add Todo">
          <IconButton onClick={onAddTodo}>
            <PostAddIcon sx={{ height: "50px" }} />
          </IconButton>
        </Tooltip>
        <input
          value={todoTitle}
          onInput={(e) => {
            setTodoTitle(e.target.value);
          }}
          className="todoCustomInput"
          onKeyDown={(e) => {
            if (e.code === "Enter") onAddTodo();
          }}
        />
        <Box width="30%">
          <FormControl fullWidth size="small" error={categoryError}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={(e) => {
                if (categoryError) setCategoryError(false);
                setCategory(e.target.value);
              }}
            >
              {categoryArray.length === 0 ? (
                <MenuItem disabled>No Categories Available</MenuItem>
              ) : (
                categoryArray.map((item, index) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>
      </div>
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className={`todoItem ${
            clickedDelete.includes(todo.id) && "deleteTodo"
          }`}
        >
          <div className="todoTitle">
            <Tooltip
              title={
                !todo.timeSpent || todo.timeSpentError
                  ? "Enter time spent to complete task"
                  : ""
              }
              placement="left"
            >
              <Checkbox
                checked={todo.checked}
                onClick={() => {
                  if (!todo.timeSpent || todo.timeSpentError) return;
                  onToggleTodo(index);
                }}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 24,
                    color:
                      !todo.timeSpent || todo.timeSpentError
                        ? "rgba(0, 0, 0, 0.26)"
                        : "inherit",
                  },
                  "&.Mui-checked": {
                    color: "#1e56a6",
                  },
                }}
              />
            </Tooltip>
            {todo.title}
            <div className="strike-out">
              <div style={{ width: todo.checked ? "95%" : "0%" }}></div>
            </div>
          </div>
          <Box display="flex" alignItems="center" mr={1} gap={1}>
            <Tooltip
              placement="bottom"
              title={todo.checked ? "" : "hour minutes (eg. 1h 1m)"}
            >
              <TextField
                label="Time Spent"
                disabled={todo.checked}
                value={todo.timeSpent}
                autoComplete="off"
                onChange={(e) => timeSpentChangeHandler(e.target.value, index)}
                error={todo.timeSpentError}
                size="small"
              />
            </Tooltip>
            <Paper elevation={1}>
              <Box p={1}>{todo.category}</Box>
            </Paper>
            <Button
              sx={{ minWidth: "10px" }}
              onClick={() => {
                onDeleteTodo(todo.id);
              }}
              color="info"
              variant="contained"
              className="deleteButton"
              aria-label="delete"
            >
              <Delete />
            </Button>
          </Box>
        </div>
      ))}
      {todos.length === 0 && (
        <div
          className="todoStatus"
          style={{ paddingBottom: fetchStatus === "loading" ? "1rem" : 0 }}
        >
          {fetchStatus === "success" ? (
            "No tasks available"
          ) : fetchStatus === "loading" ? (
            <CircularProgress />
          ) : (
            "Failed to fetch todos"
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
