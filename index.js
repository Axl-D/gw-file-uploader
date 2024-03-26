import path from "path";
import mime from "mime";
import { uploadFile } from "./uploadFile.js";
import getToken from "./getToken.js";
import { notionCreateGCPFile } from "./notionCreateGCPFile.js";
import readline from "readline";

// Replace the following variables with your own values
const bucketName = "guestwhat-public";
// const folderName = "Test";
// const filePath = "/Users/axel/Downloads/Penguin-3970-Edit.jpg";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the file path: ", (filePath) => {
  rl.question("Enter the folder name: ", (folderName) => {
    // Close the readline interface after getting inputs
    rl.close();

    // Call the function with the provided filePath and folderName

    runFunctions(filePath, folderName);
  });
});

// Call the upload function
async function runFunctions(filePath, folderName) {
  const fileName = path.basename(filePath);
  const objectName = `${folderName}/${fileName}`;
  const contentType = mime.getType(filePath) || "application/octet-stream";

  getToken()
    .then((accessToken) => {
      uploadFile(bucketName, objectName, filePath, contentType, accessToken).then((uploadedFileDetails) => {
        console.log(uploadedFileDetails);
        notionCreateGCPFile(uploadedFileDetails);
      });
    })
    .catch((error) => {
      // Handle error
    });
}
