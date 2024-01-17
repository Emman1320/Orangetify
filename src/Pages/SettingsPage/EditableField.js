import { Clear, Done, Edit } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
const EditableField = ({
  type = "text",
  tooltip = "",
  pattern = /^.*$/,
  label = "",
  value,
  edit,
}) => {
  const [field, setField] = useState({
    value: value,
    disabled: !edit,
  });
  const [valueOnEdit, setValueOnEdit] = useState(field.value);
  const [touched, setTouched]  = useState(false);

  const onChangeField = (e) => {
    if(!touched) setTouched(true);
    setValueOnEdit(e.target.value);
  };
  const isError = touched && !field.disabled && !pattern.test(valueOnEdit);
  const handleFieldEdit = (action) => {
    switch (action) {
      case "edit":
        setField((prev) => {
          return { ...prev, disabled: false };
        });
        return;
      case "done":
        if (isError) setField({ value: valueOnEdit, disabled: true });
        return;
      case "reset":
        setValueOnEdit(field.value);
        setField((prev) => {
          return { ...prev, disabled: true };
        });
        return;
      default:
        return;
    }
  };
  return (
    <FormControl variant="outlined" fullWidth error={isError}>
      <InputLabel
        htmlFor="editable-field"
      >
        {label}
      </InputLabel>
      <Tooltip placement="bottom-start" title={field.disabled ? "" : tooltip}>
        <OutlinedInput
          id="editable-field"
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
            },
          }}
          value={field.disabled ? field.value : valueOnEdit}
          disabled={field.disabled}
          size="small"
          label={label}
          onChange={onChangeField}
          type={type}
          endAdornment={
            <InputAdornment position="end">
              {field.disabled ? (
                <IconButton
                  size="small"
                  onClick={handleFieldEdit.bind(this, "edit")}
                >
                  <Edit />
                </IconButton>
              ) : (
                <>
                  <IconButton
                    size="small"
                    onMouseDown={(e) => {
                      if (isError) {
                        e.preventDefault();
                      }
                    }}
                    onClick={handleFieldEdit.bind(this, "done")}
                  >
                    <Done />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleFieldEdit.bind(this, "reset")}
                  >
                    <Clear />
                  </IconButton>
                </>
              )}
            </InputAdornment>
          }
        />
      </Tooltip>
    </FormControl>
  );
};

export default EditableField;
