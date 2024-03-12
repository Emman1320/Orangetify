import { Box, Button, Rating } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./RatingPage.css";
import SmileyRating from "./SmileyRating";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const RatingPage = () => {
  const [rating, setRating] = useState({
    lastUpdatedAt: "",
    productivity: -1,
    emotionalStatus: -1,
  });
  const navigate = useNavigate();
  const [touched, setTouched] = useState(false);
  const dateRef = useRef(new Date().toDateString());
  const firebaseRef = useRef({
    lastUpdatedAt: doc(db, "rating", "emman", "timing", "lastUpdatedAt"),
    rating: doc(
      db,
      "rating",
      "emman",
      "dayRating",
      dateRef.current
    ),
  });
  const onProductivityRate = (e) => {
    if (!touched) setTouched(true);
    setRating((prev) => {
      return { ...prev, productivity: +e.target.value };
    });
  };
  const onRateEmotionalStatus = (e) => {
    if (!touched) setTouched(true);
    setRating((prev) => {
      return { ...prev, emotionalStatus: +e.target.value };
    });
  };
  const isValid = () =>
    touched && rating.productivity !== -1 && rating.emotionalStatus !== -1;

  const onSubmit = () => {
    let lastUpdatedAt = rating.lastUpdatedAt;
    if (!lastUpdatedAt) lastUpdatedAt = dateRef.current;

    updateDoc(firebaseRef.current.lastUpdatedAt, {
      date: lastUpdatedAt,
    });
    setDoc(firebaseRef.current.rating, {
      productivity: rating.productivity,
      emotionalStatus: rating.emotionalStatus,
    });
    navigate("/");
  };
  useEffect(() => {
    const fetchRatings = async () => {
      const lastUpdatedAtSnapshot = await getDoc(
        firebaseRef.current.lastUpdatedAt
      );
      const ratingSnapshot = await getDoc(firebaseRef.current.rating);
      if (lastUpdatedAtSnapshot.exists()) {
        const lastUpdatedAt = lastUpdatedAtSnapshot?.data()?.date;
        if (lastUpdatedAt && dateRef.current === lastUpdatedAt) {
          setRating((prev) => {
            return {
              ...prev,
              lastUpdatedAt: lastUpdatedAt,
            };
          });
        }
      }
      if (ratingSnapshot.exists()) {
        const todayRating = ratingSnapshot.data();
        if (todayRating) {
          setRating((prev) => {
            return {
              ...prev,
              ...todayRating,
            };
          });
        }
      }
    };
    fetchRatings();
  }, []);
  return (
    <div className="RatingPage">
      <div className="question">
        <div className="RatingPage_Header">How was today?</div>
        <div className="smileyRating center">
          <SmileyRating
            emotionalStatus={rating.emotionalStatus}
            onRateEmotionalStatus={onRateEmotionalStatus}
          />
        </div>
        <div className="RatingPage_Header">How productive was your day?</div>
        <div className="starRating center">
          <Rating
            onChange={onProductivityRate}
            name="size-large"
            value={rating.productivity}
            size="large"
            max={5}
          />
        </div>
        <Box mt="5rem" display="flex" justifyContent="center">
          <Button
            disabled={!isValid()}
            onClick={onSubmit}
            size="large"
            variant="contained"
          >
            submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default RatingPage;
