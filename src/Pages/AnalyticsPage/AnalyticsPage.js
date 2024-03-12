import React, { useEffect, useState } from "react";
import "./AnalyticsPage.css";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { teal } from "@mui/material/colors";
import styled from "@emotion/styled";

const AnalyticsPage = () => {
  const [rating, setRating] = useState([]);
  const [checked, setChecked] = useState({
    emotionalStatus: true,
    productivity: true,
  });
  // const dates = Object.keys(rating);
  // const emotionalStatus = dates.map((date) => rating[date].emotionalStatus);
  // const productivity = dates.map((date) => rating[date].productivity);
  // console.log(emotionalStatus, productivity);
  // console.log(rating);
  useEffect(() => {
    const fetchRating = async () => {
      const ratingRef = collection(db, "rating", "emman", "dayRating");
      const ratings = await getDocs(ratingRef);
      ratings.forEach((snap) => {
        setRating((prev) => {
          return [...prev, { ...snap.data(), date: snap.id }];
        });
      });
    };
    fetchRating();
  }, []);
  const valueFormatter = (value) => `${value}`;
  let series = [];
  if (checked.emotionalStatus) {
    series.push({
      dataKey: "emotionalStatus",
      label: "Emotional Status",
      showMark: false,
      valueFormatter,
    });
  }
  if (checked.productivity) {
    series.push({
      dataKey: "productivity",
      label: "Productivity",
      showMark: false,
      valueFormatter,
    });
  }
  return (
    <div className="analytics-container">
      <Grid container justifyContent="space-between" direction="column" gap={5}>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormGroup>
              <Grid container>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!checked.productivity}
                        color={"primary"}
                        checked={checked.emotionalStatus}
                        onChange={() => {
                          setChecked((prev) => {
                            return {
                              ...prev,
                              emotionalStatus: !prev.emotionalStatus,
                            };
                          });
                        }}
                      />
                    }
                    label="Emotional Status"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!checked.emotionalStatus}
                        color="primary"
                        checked={checked.productivity}
                        onChange={() => {
                          setChecked((prev) => {
                            return {
                              ...prev,
                              productivity: !prev.productivity,
                            };
                          });
                        }}
                      />
                    }
                    label="Productivity"
                  />
                </Grid>
              </Grid>
            </FormGroup>
            {rating.length && (
              <BarChart
                dataset={rating}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "date",
                  },
                ]}
                series={series}
                yAxis={[
                  {
                    max: 5,
                    min: 1,
                  },
                ]}
                height={400}
              />
            )}
          </Paper>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormGroup>
              <Grid container>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!checked.productivity}
                        color={"primary"}
                        defaultChecked
                        checked={checked.emotionalStatus}
                        onChange={() => {
                          setChecked((prev) => {
                            return {
                              ...prev,
                              emotionalStatus: !prev.emotionalStatus,
                            };
                          });
                        }}
                      />
                    }
                    label="Emotional Status"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!checked.emotionalStatus}
                        color="primary"
                        defaultChecked
                        checked={checked.productivity}
                        onChange={() => {
                          setChecked((prev) => {
                            return {
                              ...prev,
                              productivity: !prev.productivity,
                            };
                          });
                        }}
                      />
                    }
                    label="Productivity"
                  />
                </Grid>
              </Grid>
            </FormGroup>
            {rating.length && (
              <LineChart
                dataset={rating}
                xAxis={[
                  {
                    scaleType: "point",
                    dataKey: "date",
                  },
                ]}
                series={series}
                yAxis={[
                  {
                    max: 5,
                    min: 1,
                  },
                ]}
                height={400}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnalyticsPage;
