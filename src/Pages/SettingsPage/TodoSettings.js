import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import { spaceActions } from "../../store/constants";
import { SpaceContext } from "../../store/space-provider";
import CategoryInput from "./CategoryInput";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const TodoSettings = () => {
  const [categoryArray, setCategoryArray] = useState([]);
  const [touched, setTouched] = useState();
  const [loading, setLoading] = useState(false);
  const categoryNamePattern = /^(?!\s*$).+/;
  const categoryPointsPattern = /^-?\d+$/;
  const isValid = () => {
    return (
      categoryArray.filter((category) => {
        return (
          categoryNamePattern.test(category.name) &&
          categoryPointsPattern.test(category.points)
        );
      }).length === categoryArray.length
    );
  };
  let allowSubmit = touched && isValid();
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
    setCategoryArray((prev) => {
      const updatedArray = [...prev];
      updatedArray.splice(index, 1);
      const categoryRef = doc(db, "categories", "emman");
      updateDoc(categoryRef, {
        categories: updatedArray,
      });
      return updatedArray;
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isValid()) {
        const categoryRef = doc(db, "categories", "emman");
        await updateDoc(categoryRef, {
          categories: categoryArray,
        });
        setTouched(false);
      }
    } catch (error) {}
    setLoading(false);
  };
  useEffect(() => {
    const categoryRef = doc(db, "categories", "emman");
    getDoc(categoryRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log(data);
        setCategoryArray(data.categories || []);
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
          <Button
            onClick={onSubmit}
            disabled={!allowSubmit}
            variant="contained"
          >
            {loading ? <CircularProgress color="inherit" size="20px" /> : "submit"}
          </Button>
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
              }}
            />
          ))
        )}
      </div>
      <Button
        onClick={addCategory}
        className="todo-addcategory-button"
        variant="contained"
      >
        <Add /> Add Category
      </Button>
    </div>
  );
};

export default TodoSettings;
