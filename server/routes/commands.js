const express = require("express");
const router = express.Router();
const { launch } = require("../launch");
const { configure } = require("../configure");
const { deploy } = require("../deploy");

router.post("/launch", async (req, res) => {
  if (req.body["text"] == "create ec2 instance") {
    const message = `Generate the Node.js executable script automates the creation of an Amazon EC2 instance using the AWS SDK for JavaScript (v3). It starts by loading environment variables via dotenv to securely manage configuration values such as OPENAI_API_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, KEY_NAME, and SECURITY_GROUP_ID. The script initializes an EC2Client using the provided AWS region and credentials. It defines the parameters required to launch an EC2 instance 64-bit (x86), including the Amazon Machine Image (AMI) ID (ami-0f88e80871fd81e91 for Amazon Linux), the instance type (t2.micro), and tags the instance with the name company-instance-${Math.random()
      .toString(36)
      .substring(
        2,
        10
      )}. It then executes the RunInstancesCommand asynchronously to create the instance. On success, the script logs the instance ID and name, then appends the generated instance ID in the format INSTANCE_ID=<instance-id> to the .env file. If an error occurs, it is caught and the error details are logged to the console.`;
    await launch(message).then(() => {
      res.json({ message: "Launch executed successfully" });
    });
  } else {
    res.json({ message: "Failed to launch EC2 instance. Please try again." });
  }
});

router.post("/configure", async (req, res) => {
  if (req.body["text"] == "configure ec2 instance") {
    configure().then(() => {
      res.json({ message: "Configured successfully" });
    });
  } else {
    res.json({
      message: "Failed to configure EC2 instance. Please try again.",
    });
  }
});

router.post("/deploy", async (req, res) => {
  if (req.body["text"] == "deploy website") {
    const message = `Generate a Node.js script that uses the AWS SDK v3 and the node-ssh library to connect to an EC2 instance and run a couple of Docker commands. Begin by importing the necessary modules: fs, node-ssh, @aws-sdk/client-ec2, and dotenv. Use dotenv.config() to load environment variables, including AWS_REGION, EC2_USER, KEY_PATH, and INSTANCE_ID. Use the AWS EC2 client to retrieve the public IP of the EC2 instance by its ID. Then, use the node-ssh library to connect to the instance using the provided username and a private key read from the path stored in KEY_PATH. Be sure to read the private key using fs.readFileSync(KEY_PATH, "utf-8"), with "utf-8" explicitly specified as the encoding. Once connected, execute two Docker commands: one to pull an image (docker pull kodekishan/website:latestGenerate a Node.js script that uses the AWS SDK v3 and the node-ssh library to remotely access an AWS EC2 instance and execute Docker commands. Begin by importing the required modules: fs, node-ssh, @aws-sdk/client-ec2, and dotenv. Use dotenv.config() to load environment variables including AWS_REGION, EC2_USER, KEY_PATH, and INSTANCE_ID. Using the EC2 client, retrieve the public IP address of the EC2 instance specified by INSTANCE_ID. Then establish an SSH connection to the instance using the node-ssh library, authenticating with the username and private key loaded from the file path in KEY_PATH, read using fs.readFileSync(KEY_PATH, "utf-8"). Once connected, execute two Docker commands on the EC2 instance: the first command should pull the Docker image kodekishan/website:latest (note: not kodekloud/website, but explicitly kodekishan/website:latest), and the second command should run this image in detached mode, mapping port 80 of the container to port 80 of the host. Make sure to wrap all operations in an immediately invoked async function and include proper error handling.) and another to run it detached on port 80 from 80. Wrap everything in an immediately invoked async function and handle any errors gracefully.`;
    await deploy(message).then(() => {
      res.json({ message: "Deployed successfully" });
    });
  } else {
    res.json({
      message: "Deployment Failed. Please try again.",
    });
  }
});

module.exports = router;
