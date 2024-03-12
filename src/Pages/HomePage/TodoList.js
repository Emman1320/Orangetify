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
  Tooltip,
} from "@mui/material";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import TimeSpentModal from "./TimeSpentModal";
import { destructuredCategoryInfo } from "../SettingsPage/TodoSettings";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categoryInfo, setCategoryInfo] = useState({});
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [categoryError, setCategoryError] = useState(false);
  const [clickedDelete, setClickedDelete] = useState([]);
  const [timeSpentModal, setTimeSpentModal] = useState({
    open: false,
    index: 0,
    value: "",
  });
  const firebaseRef = useRef({
    todos: doc(db, "todos", "emman"),
    categories: doc(db, "categories", "emman"),
  });
  const getMinutes = (time) => {
    let hours = 0;
    let minutes = 0;
    if (time.includes("h") && time.includes("m")) {
      hours = parseInt(time.split("h")[0]);
      minutes = parseInt(time.split("h")[1]);
    } else if (time.includes("m")) {
      minutes = parseInt(time);
    } else {
      hours = parseInt(time);
    }
    return hours * 60 + parseInt(minutes);
  };
  const onToggleTodo = (index) => {
    setTodos((prev) => {
      const updatedTodos = [...prev];
      updatedTodos[index].checked = !updatedTodos[index].checked;
      if (updatedTodos[index].checked) {
        // add total time and points to category
        updateDoc(firebaseRef.current.categories, {
          [`${updatedTodos[index].category}.totalTimeSpent`]: increment(
            getMinutes(updatedTodos[index].timeSpent)
          ),
          [`${updatedTodos[index].category}.totalPoints`]: increment(
            categoryInfo[updatedTodos[index].category].points
          ),
        });
      } else {
        // subtract total time to category
        updateDoc(firebaseRef.current.categories, {
          [`${updatedTodos[index].category}.totalTimeSpent`]: increment(
            -getMinutes(updatedTodos[index].timeSpent)
          ),
          [`${updatedTodos[index].category}.totalPoints`]: increment(
            -categoryInfo[updatedTodos[index].category].points
          ),
        });
      }
      saveAllTodos(updatedTodos);
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
      updateDoc(firebaseRef.current.todos, {
        todoList: arrayUnion(newTodo),
      });
      setTodos((prev) => [...prev, newTodo]);
      setCategory("");
      setCategoryError(false);
      setTodoTitle("");
    }
  };
  const saveAllTodos = (updatedTodos) => {
    updateDoc(firebaseRef.current.todos, {
      todoList: updatedTodos,
    });
  };
  const onDeleteTodo = (id) => {
    setClickedDelete((prev) => [...prev, id]);

    setTimeout(() => {
      setClickedDelete((prev) => prev.filter((itemId) => itemId !== id));
      setTodos((prev) => {
        const updatedTodos = prev.filter((todo) => id !== todo.id);
        saveAllTodos(updatedTodos);
        return updatedTodos;
      });
    }, 1000);
  };
  const timeSpentSubmitHandler = (value, index) => {
    setTodos((prev) => {
      const updatedTodos = [...prev];
      updatedTodos[index].timeSpent = value;
      saveAllTodos(updatedTodos);
      return updatedTodos;
    });
    setTimeSpentModal((prev) => {
      return { ...prev, open: false };
    });
  };
  useEffect(() => {
    try {
      getDoc(firebaseRef.current.todos).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTodos(data.todoList || []);
        } else {
          setTodos([]);
        }
        setFetchStatus("success");
      });
      getDoc(firebaseRef.current.categories).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCategoryInfo(data);
        } else {
          setCategoryInfo({});
        }
      });
    } catch (error) {
      setFetchStatus("failed");
    }
  }, []);
  return (
    <Fragment>
      <TimeSpentModal
        timeSpentSubmitHandler={timeSpentSubmitHandler}
        timeSpentValue={timeSpentModal.value}
        index={timeSpentModal.index}
        onClose={() => {
          setTimeSpentModal((prev) => {
            return { ...prev, open: false };
          });
        }}
        open={timeSpentModal.open}
      />
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
                {categoryInfo.length === 0 ? (
                  <MenuItem disabled>No Categories Available</MenuItem>
                ) : (
                  Object.keys(categoryInfo).map((categoryName, index) => (
                    <MenuItem key={index} value={categoryName}>
                      {categoryName}
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
                    if (!todo.timeSpent) return;
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
              <Paper elevation={1}>
                <Box p={1}>{todo.category}</Box>
              </Paper>
              <Paper elevation={1} sx={{ bgcolor: "#a4ffe6" }}>
                <Box p={1}>{todo.timeSpent || "0h 0m"}</Box>
              </Paper>

              <Button
                onClick={() => {
                  setTimeSpentModal((prev) => {
                    return { value: todo.timeSpent, index: index, open: true };
                  });
                }}
                color="info"
                variant="contained"
                disabled={todo.checked}
              >
                Edit Time Spent
              </Button>
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
    </Fragment>
  );
};

export default TodoList;
