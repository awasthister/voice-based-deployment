// Load environment variables from the .env file
require("dotenv").config();
const { exec } = require("child_process");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate and launch an EC2 instance script
async function launch(message) {
  const envFilePath = path.join(".env");
  try {
    if (fs.existsSync(envFilePath)) {
      let envContent = fs.readFileSync(envFilePath, "utf8");
      const updatedContent = envContent.replace(/^INSTANCE_ID=.*\n?/gm, "");
      fs.writeFileSync(envFilePath, updatedContent, "utf8");
    } else {
      console.error(`.env file not found at path: ${envFilePath}`);
    }

    // Generate the EC2 launch script using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    cleanScript(
      response.choices[0].message.content,
      "launchInstance.js",
      message
    );
  } catch (error) {
    console.error("Error generating script:", error);
  }
}

// Extract JavaScript code and save it to a temporary file
const cleanScript = (rawCode, filename, message) => {
  try {
    const cleanedCode = rawCode.split("```javascript")[1].split("```")[0];
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, cleanedCode, "utf8");
    console.log(`✅ EC2 script written to ${filePath}`);
    executeScript(filePath);
  } catch (error) {
    launch(message);
  }
};

// Execute the generated script
const executeScript = (filePath, message) => {
  exec(`node "${filePath}"`, (error, stdout, stderr) => {
    fs.rmSync(filePath);
    filePath = null;
    if (stdout) console.log(`✅ Output:\n${stdout}`);
    else if (stderr) launch(message);
    else if (error) launch(message);
  });
};

module.exports = { launch };
