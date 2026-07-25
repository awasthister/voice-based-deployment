import React, { useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import axios from "axios";

const CommandForm = () => {
  const [commands, setCommands] = useState({
    launch: "",
    configure: "",
    deploy: "",
  });

  const handleInputChange = (field) => (e) => {
    setCommands({ ...commands, [field]: e.target.value });
  };

  const handleVoiceInput = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setCommands((prev) => ({ ...prev, [field]: spokenText }));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleSubmit = async (field) => {
    try {
      await axios.post(`http://localhost:3001/api/${field}`, {
        text: commands[field],
      });
      setCommands({
        launch: "",
        configure: "",
        deploy: "",
      });
    } catch (err) {
      console.error(err);
      alert(`Error while calling /${field}`);
    }
  };

  const fields = ["launch", "configure", "deploy"];

  return (
    <Grid>
      {fields.map((field) => (
        <Box mb={10}>
          <TextField
            multiline
            fullWidth
            rows={4}
            label={field.toUpperCase()}
            variant="filled"
            value={commands[field]}
            onChange={handleInputChange(field)}
          />
          <Grid container spacing={2} mt={1}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => handleVoiceInput(field)}
              >
                🎤 Speak
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(field)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

export default CommandForm;
