import React, { useEffect, useState } from "react";
import "./AnalyticsPage.css";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { destructuredCategoryArray } from "../SettingsPage/TodoSettings";

const AnalyticsPage = () => {
  const [rating, setRating] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);

  const [checked, setChecked] = useState({
    emotionalStatus: true,
    productivity: true,
  });

  const [graphType, setGraphType] = useState("barplot");
  const [categoryGraphType, setCategoryGraphType] = useState({
    points: "pie",
    timeSpent: "pie",
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
      const extractedRating = [];
      ratings.forEach((snap) => {
        extractedRating.push({ ...snap.data(), date: snap.id });
      });
      setRating(extractedRating);
    };
    const fetchCategories = async () => {
      const categoryRef = doc(db, "categories", "emman");
      const snapshot = await getDoc(categoryRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCategoryArray(destructuredCategoryArray(data));
      } else {
        setCategoryArray([]);
      }
    };
    fetchRating();
    fetchCategories();
  }, []);
  const valueFormatter = (value) => `${value}`;
  let series = [];
  if (checked.emotionalStatus) {
    series.push({
      dataKey: "emotionalStatus",
      label: "Emotional Status",
      showMark: true,
      valueFormatter,
    });
  }
  if (checked.productivity) {
    series.push({
      dataKey: "productivity",
      label: "Productivity",
      showMark: true,
      valueFormatter,
    });
  }

  return (
    <div className="analytics-container">
      <Grid container justifyContent="space-between" direction="column" gap={5}>
        <Grid item>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormGroup>
              <Grid container alignItems="center">
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
                <Grid item>
                  <Select
                    value={graphType}
                    onChange={(e) => {
                      setGraphType(e.target.value);
                    }}
                  >
                    <MenuItem value="barplot">Bar Plot</MenuItem>
                    <MenuItem value="lineplot">Line Plot</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </FormGroup>
            {rating.length &&
              (graphType === "barplot" ? (
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
                      max: 5.5,
                      min: 1,
                    },
                  ]}
                  height={400}
                />
              ) : (
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
                      max: 5.5,
                      min: 1,
                    },
                  ]}
                  height={400}
                />
              ))}
          </Paper>
        </Grid>
        <Grid item>
          <Grid container justifyContent="space-between" gap={3}>
            <Grid item width="48.5%">
              <Paper elevation={3} sx={{ p: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h5" fontWeight="500">
                      Total Points
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Select
                      value={categoryGraphType.points}
                      onChange={(e) => {
                        setCategoryGraphType((prev) => {
                          return { ...prev, points: e.target.value };
                        });
                      }}
                    >
                      <MenuItem value="pie">Pie</MenuItem>
                      <MenuItem value="bar">Bar</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                {categoryArray?.length &&
                  (categoryGraphType.points === "pie" ? (
                    <PieChart
                      series={[
                        {
                          data: categoryArray.map((category) => {
                            return {
                              value: category.totalPoints,
                              label: category.name,
                            };
                          }),
                          valueFormatter: (value) => `${value.value} points`,
                        },
                      ]}
                      height={400}
                    />
                  ) : (
                    <BarChart
                      dataset={categoryArray}
                      xAxis={[
                        {
                          scaleType: "band",
                          dataKey: "name",
                        },
                      ]}
                      series={[
                        {
                          dataKey: "totalPoints",
                          label: "Total points",
                          valueFormatter: (value) => `${value} points`,
                        },
                      ]}
                      height={400}
                    />
                  ))}
              </Paper>
            </Grid>
            <Grid item width="48.5%">
              <Paper elevation={3} sx={{ p: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h5" fontWeight="500">
                      Time Spent
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Select
                      value={categoryGraphType.timeSpent}
                      onChange={(e) => {
                        setCategoryGraphType((prev) => {
                          return { ...prev, timeSpent: e.target.value };
                        });
                      }}
                    >
                      <MenuItem value="pie">Pie</MenuItem>
                      <MenuItem value="bar">Bar</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                {categoryArray?.length &&
                  (categoryGraphType.timeSpent === "pie" ? (
                    <PieChart
                      series={[
                        {
                          data: categoryArray.map((category) => {
                            return {
                              value: category.totalTimeSpent,
                              label: category.name,
                            };
                          }),
                          valueFormatter: (value) =>
                            `${parseInt(value.value / 60)}h ${
                              value.value % 60 ? `${value.value % 60}m` : ""
                            }`,
                        },
                      ]}
                      height={400}
                    />
                  ) : (
                    <BarChart
                      dataset={categoryArray}
                      xAxis={[
                        {
                          scaleType: "band",
                          dataKey: "name",
                        },
                      ]}
                      series={[
                        {
                          dataKey: "totalTimeSpent",
                          label: "Time spent",
                          valueFormatter: (value) =>
                            `${parseInt(value / 60)}h ${
                              value % 60 ? `${value % 60}m` : ""
                            }`,
                        },
                      ]}
                      height={400}
                    />
                  ))}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnalyticsPage;
