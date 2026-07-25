import React from "react";
import { Container, Typography } from "@mui/material";
import CommandForm from "./components/CommandForm";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Voice Command Center
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <CommandForm />
      </Container>
    </Box>
  );
}

export default App;
