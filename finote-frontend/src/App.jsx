import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import JournalEntryForm from "./components/JournalEntryForm";
import JournalEntryList from "./components/JournalEntryList";
import JournalEntryDetail from "./components/JournalEntryDetail";
import "./App.css";

const JournalPage = () => (
  <Box className="page-content">
    <Typography className="eyebrow">Your personal journal</Typography>
    <Typography className="page-title" variant="h1">A little more mindful, every day.</Typography>
    <Typography className="page-intro">
      Keep a private record of your routines, revisit your entries, and find small ideas for what comes next.
    </Typography>
    <Box className="journal-grid">
      <Card className="finote-card">
        <CardContent sx={{ p: 3 }}>
          <Typography className="section-title" variant="h5">New journal entry</Typography>
          <JournalEntryForm onActivityAdded={() => window.location.reload()} />
        </CardContent>
      </Card>
      <Box>
        <Typography className="section-title" variant="h5">Recent entries</Typography>
        <JournalEntryList />
      </Box>
    </Box>
  </Box>
);

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) dispatch(setCredentials({ token, user: tokenData }));
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <Box className="app-shell">
        {!token ? (
          <Box className="login-wrap">
            <Card className="finote-card login-card">
              <Typography className="eyebrow">A personal journal</Typography>
              <Typography className="brand" variant="h2" sx={{ fontSize: "3rem", mt: 1 }}>Finote</Typography>
              <Typography className="page-intro" sx={{ mt: 1, mb: 4 }}>
                A quieter place to keep track of the things you do and reflect on your progress.
              </Typography>
              <Button className="finote-button" variant="contained" size="large" onClick={logIn} fullWidth>
                Sign in to your journal
              </Button>
            </Card>
          </Box>
        ) : (
          <>
            <Box component="header" className="topbar">
              <Typography className="brand" variant="h5">Finote</Typography>
              <Button onClick={logOut} sx={{ color: "#315c4e", textTransform: "none", fontWeight: 700 }}>
                Sign out
              </Button>
            </Box>
            <Routes>
              <Route path="/activities" element={<JournalPage />} />
              <Route path="/activities/:id" element={<JournalEntryDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
            </Routes>
          </>
        )}
      </Box>
    </Router>
  );
}

export default App;
