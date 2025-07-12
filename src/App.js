import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UserPreferencesPanel from "./components/UserPreferencesPanel";

function App() {
  return (
    <Container maxWidth="sm">
      <Box my={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Preferences
        </Typography>
        <UserPreferencesPanel userId="12345" />
      </Box>
    </Container>
  );
}

export default App;
