import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Add, Clear, Edit } from "@mui/icons-material";
import CategoryInput from "./CategoryInput";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const destructuredCategoryArray = (data) => {
  const array = [];
  for (const category in data) {
    array.push({
      name: category,
      points: data[category].points,
      totalTimeSpent: data[category].totalTimeSpent,
      totalPoints: data[category].totalPoints,
    });
  }
  return array;
};

const TodoSettings = () => {
  const [categoryArray, setCategoryArray] = useState([]);
  const categoryArrayBackupRef = useRef([]);
  const firebaseRef = useRef({
    categories: doc(db, "categories", "emman"),
    todos: doc(db, "todos", "emman"),
  });

  const [touched, setTouched] = useState();
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  const categoryNamePattern = /^(?!\s*$).+/;
  const categoryPointsPattern = /^-?\d+$/;
  const isValid = () => {
    return (
      categoryArray.filter((category) => {
        return (
          categoryNamePattern.test(category.name) &&
          categoryPointsPattern.test(category.points) &&
          categoryArray.filter((e) => e.name === category.name).length === 1
        );
      }).length === categoryArray.length
    );
  };
  let allowSubmit = touched && editable && isValid();
  const addCategory = () => {
    setCategoryArray((prev) => [...prev, { name: "", points: "", new: true }]);
  };
  const onEnterValue = (index, key, e) => {
    if (!touched) setTouched(true);
    setCategoryArray((prev) => {
      const updatedArray = [...prev];
      updatedArray[index][key] = e.target.value;
      return updatedArray;
    });
  };
  const removeCategory = (index, e) => {
    if (!touched) setTouched(true);
    setCategoryArray((prev) => {
      const updatedArray = [...prev];
      updatedArray.splice(index, 1);
      return updatedArray;
    });
  };

  const toggleEditable = () => {
    setEditable((prevIsEditable) => {
      if (prevIsEditable) {
        setCategoryArray(categoryArrayBackupRef.current);
      }
      return !prevIsEditable;
    });
  };
  const structuredCategoryArray = () => {
    const data = {};
    categoryArray.forEach((category) => {
      data[category.name] = {
        points: +category.points,
        totalTimeSpent: category.totalTimeSpent || 0,
        totalPoints: category.totalPoints || 0,
      };
    });
    return data;
  };
  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isValid()) {
        await updateDoc(
          firebaseRef.current.categories,
          structuredCategoryArray()
        );
        await getDoc(firebaseRef.current.todos).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const todos = data.todoList || [];
            const categoryNames = categoryArray.map((e) => e.name);
            const updatedTodos = todos.filter((todo) =>
              categoryNames.includes(todo.category)
            );
            if (updatedTodos.length !== todos.length) {
              updateDoc(firebaseRef.current.todos, {
                todoList: updatedTodos,
              });
            }
          }
        });
        categoryArrayBackupRef.current = categoryArray;
        setTouched(false);
        setEditable(false);
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    getDoc(firebaseRef.current.categories).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        categoryArrayBackupRef.current = destructuredCategoryArray(data);
        setCategoryArray(destructuredCategoryArray(data));
      } else {
        setCategoryArray([]);
      }
    });
  }, []);

  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" fontWeight="500">
            Add Category
          </Typography>
        </Grid>
        <Grid item>
          <Grid container gap={2}>
            <Grid item>
              <Button
                disabled={!editable}
                onClick={addCategory}
                variant="contained"
              >
                <Add />
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={toggleEditable}
                color={editable ? "error" : "primary"}
                variant="contained"
              >
                {editable ? <Clear /> : <Edit />}
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={onSubmit}
                disabled={!allowSubmit}
                variant="contained"
              >
                {loading ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "submit"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div className="todo-category-list-container">
        {categoryArray.length === 0 ? (
          <div style={{ textAlign: "center" }}>No Categories Available</div>
        ) : (
          categoryArray.map((category, index) => (
            <CategoryInput
              key={index}
              {...{
                category,
                index,
                categoryNamePattern,
                categoryPointsPattern,
                onEnterValue,
                removeCategory,
                disabled: !editable,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoSettings;
