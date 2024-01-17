import { Rating } from "@mui/material";
import React from "react";
import "./RatingPage.css";
import SmileyRating from "./SmileyRating";

const RatingPage = () => {
  const onProductivityRate = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className="RatingPage">
      <div className="question">
        <div className="RatingPage_Header">How was today?</div>
        <div className="smileyRating center">
          <SmileyRating />
        </div>
      </div>
      <div className="question">
        <div className="RatingPage_Header">How productive was your day?</div>
        <div className="starRating center">
          <Rating
            onChange={onProductivityRate}
            name="size-large"
            size="large"
            max={10}
          />
        </div>
      </div>
    </div>
  );
};

export default RatingPage;
