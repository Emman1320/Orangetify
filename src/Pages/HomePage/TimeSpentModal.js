import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

const TimeSpentModal = ({
  timeSpentSubmitHandler,
  index,
  open,
  onClose,
  timeSpentValue,
}) => {
  const [timeSpent, setTimeSpent] = useState({
    value: timeSpentValue,
    error: false,
  });
  const onTimeSpentChange = (e) => {
    const timePattern = /^(\d+h\s?(?:[1-9]|[1-5]\d)m|[1-9]\d*h|[1-9]\d*m)$/;
    setTimeSpent({
      value: e.target.value,
      error: !timePattern.test(e.target.value),
    });
  };
  const closeHandler = () => {
    setTimeSpent({ value: "", error: false });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <TextField
          label="Time Spent"
          value={timeSpent.value}
          autoComplete="off"
          helperText="hour minutes (eg. 1h 1m)"
          onChange={onTimeSpentChange}
          error={timeSpent.error}
          fullWidth
        />
        <Box display="flex" justifyContent="end" mt={2} gap={2}>
          <Button variant="outlined" onClick={closeHandler}>
            close
          </Button>
          <Button
            variant="contained"
            disabled={!timeSpent.value || timeSpent.error}
            onClick={timeSpentSubmitHandler.bind(this, timeSpent.value, index)}
          >
            submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TimeSpentModal;
