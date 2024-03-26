import axios from "axios";
import fs from "fs";

export async function uploadFile(bucketName, objectName, filePath, contentType, accessToken) {
  const boundaryString = "my_custom_boundary";
  const metadata = {
    name: objectName,
  };

  let data = `--${boundaryString}\r\n`;
  data += `Content-Type: application/json; charset=UTF-8\r\n\r\n`;
  data += `${JSON.stringify(metadata)}\r\n`;
  data += `--${boundaryString}\r\n`;
  data += `Content-Type: ${contentType}\r\n\r\n`;

  const fileContent = fs.readFileSync(filePath);
  const endOfData = `\r\n--${boundaryString}--`;

  try {
    const response = await axios.post(
      `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=multipart`,
      Buffer.concat([Buffer.from(data, "utf-8"), Buffer.from(fileContent, "binary"), Buffer.from(endOfData, "utf-8")]),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundaryString}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    // console.log("Upload successful:", response.data);
    const publicUrlBase = "https://storage.googleapis.com/";
    const publicUrl = `${publicUrlBase}${bucketName}/${response.data.name}`;
    const [folderName, fileName] = objectName.split("/");
    return { fileName, folderName, publicUrl };
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
  }
}
