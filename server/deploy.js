//Deployment Config file
require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const executeScript = (filePath, message) => {
  exec(`node "${filePath}"`, (error, stdout, stderr) => {
    if (stdout) {
      console.log(`✅ Output:\n${stdout}`);
    } else if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      console.log(`\n Wait Retrying...`);
      deploy(message);
    } else if (error) {
      console.error(`❌ Execution error: ${error.message}`);
      console.log(`\n Wait Retrying...`);
      deploy(message);
    }
    fs.rmSync(filePath);
    filePath = null;
  });
};

const cleanScript = (rawCode, filename, message) => {
  try {
    const cleanedCode = rawCode.split("```javascript")[1].split("```")[0];
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, cleanedCode, "utf8");
    console.log(`✅ deploy script written to ${filePath}`);
    executeScript(filePath, message);
  } catch (error) {
    console.error("Error cleaning script:", error);
    console.log(`\n Wait Retrying...`);
    deploy(message);
  }
};

async function deploy(message) {
  try {
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
      "deployWebsite.js",
      message
    );
  } catch (error) {
    console.error("Error generating script:", error);
  }
}

module.exports = { deploy };
