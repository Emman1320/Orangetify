import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomePage from "./Pages/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import RatingPage from "./Pages/RatingPage/RatingPage";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";
import AccountSettings from "./Pages/SettingsPage/AccountSettings";
import TodoSettings from "./Pages/SettingsPage/TodoSettings";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { SpaceContext } from "./store/space-provider";
import { spaceActions } from "./store/constants";
import Layout from "./components/Layout";
import Login from "./Pages/LoginPage/Login";
import Signup from "./Pages/LoginPage/Signup";
import AnalyticsPage from "./Pages/AnalyticsPage/AnalyticsPage";

const theme = createTheme({
  palette: {
    yellow: {
      main: "#FFCD38",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: '"Red Hat Display", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Red Hat Display', sans-serif;
          font-style: normal;
          font-weight: 400;
          text-transform: none;
        }
      `,
    },
  },
});

function App() {
  // const spaceCtx = React.useContext(SpaceContext);
  // React.useEffect(() => {
  //   const todoRef = doc(db, "orangetify-data", "emman");
  //   getDoc(todoRef).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.data();
  //       console.log(data);
  //       spaceCtx.dispatch({ type: spaceActions.LOGIN, ...data });
  //     }
  //   });
  // }, []);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/rating"
            exact
            element={
              <Layout>
                <RatingPage />
              </Layout>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/analytics"
            exact
            element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            exact
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          >
            <Route path="" element={<AccountSettings />} />
            <Route path="todo" element={<TodoSettings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
