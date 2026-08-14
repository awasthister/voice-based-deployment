
// Import the required modules
const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
const dotenv = require('dotenv');

// Load configuration from environment variables
dotenv.config();
const { AWS_REGION, EC2_USER, KEY_PATH, INSTANCE_ID } = process.env;

(async function() {
  try {
    // Create AWS EC2 client
    const ec2 = new EC2Client({ region: AWS_REGION });

    // Retrieve the public IP of the EC2 instance
    const command = new DescribeInstancesCommand({ InstanceIds: [INSTANCE_ID] });
    const response = await ec2.send(command);
    
    const publicIp = response.Reservations[0].Instances[0].PublicIpAddress;

    // Read private key
    const privateKey = fs.readFileSync(KEY_PATH, "utf-8");

    // Create ssh client
    const ssh = new NodeSSH();

    // Connect to EC2 instance
    await ssh.connect({
      host: publicIp,
      username: EC2_USER,
      privateKey: privateKey,
    });

    // Execute Docker commands
    await ssh.execCommand('docker pull kodekishan/website:latest');
    await ssh.execCommand('docker run -d -p 80:80 kodekishan/website:latest');

  } catch (error) {
    console.error(`Error: ${error}`);
  }
})();
