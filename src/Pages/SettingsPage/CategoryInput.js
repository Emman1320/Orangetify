import { Delete } from "@mui/icons-material";
import { Box, Card, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";

const CategoryInput = ({
  index,
  categoryNamePattern,
  categoryPointsPattern,
  category,
  onEnterValue,
  disabled,
  removeCategory,
}) => {
  const [touched, setTouched] = useState({ name: false, points: false });
  return (
    <Card variant="outlined" className="todo-category-container">
      <Box display="flex" gap={2} my={2} alignItems="center">
        <TextField
          fullWidth
          disabled={disabled}
          error={touched.name && !categoryNamePattern.test(category.name)}
          value={category.name}
          onInput={() => {
            setTouched((prev) => {
              return { ...prev, name: true };
            });
          }}
          onChange={onEnterValue.bind(this, index, "name")}
          label="Category"
        />
        <TextField
          fullWidth
          error={touched.points && !categoryPointsPattern.test(category.points)}
          value={category.points}
          disabled={disabled}
          onInput={() => {
            setTouched((prev) => {
              return { ...prev, points: true };
            });
          }}
          onChange={onEnterValue.bind(this, index, "points")}
          label="Points"
        />
        <IconButton onClick={removeCategory.bind(this, index)} color="error">
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CategoryInput;
