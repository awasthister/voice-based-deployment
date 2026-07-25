require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cleanScript = (rawCode, filename) => {
  try {
    const cleanedCode = rawCode.split("```javascript")[1].split("```")[0];
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, cleanedCode, "utf8");
    console.log(`✅ EC2 Configure Environment script written to ${filePath}`);
    executeScript(filePath);
  } catch (error) {
    console.error("Error cleaning script:", error);
    console.log(`\n Wait Retrying...`);
    configure();
  }
};

const executeScript = (filePath) => {
  exec(`node "${filePath}"`, (error, stdout, stderr) => {
    if (stdout) {
      console.log(`✅ Output:\n${stdout}`);
    } else if (stderr) {
      console.log("Standard Error: ", stderr);
      configure();
    } else if (error) {
      console.log("Error: ", error);
      console.log(`\n Wait Retrying...`);
      configure();
    }
    fs.rmSync(filePath);
    filePath = null;
  });
};

async function configure() {
  console.log("Configuring...");
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Generate a Node.js script that uses AWS SDK for JavaScript v3, dotenv, and node-ssh to securely connect to an EC2 instance and configure it. The script should import fs, dotenv, @aws-sdk/client-ec2, and node-ssh. Use dotenv.config() to load environment variables: AWS_REGION, EC2_USER, KEY_PATH, and INSTANCE_ID. Use EC2Client and DescribeInstancesCommand to get the EC2 instance's public IP address. If a valid public IP is found, connect via SSH using node-ssh and the private key read from fs.readFileSync(KEY_PATH, "utf-8"). Execute these commands on the instance via SSH: wait for yum lock, run sudo yum update -y, install Docker, start Docker, enable Docker on boot, and add the EC2 user to the Docker group. Log stdout and stderr for each step. Wrap everything inside an async IIFE, handle all errors gracefully, and disconnect the SSH session at the end.`,
        },
      ],
    });
    cleanScript(response.choices[0]?.message?.content, "configureInstance.js");
  } catch (error) {
    console.error("Error generating script:", error);
  }
}

module.exports = { configure };
