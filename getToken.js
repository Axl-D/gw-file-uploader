import { GoogleAuth } from "google-auth-library";

export default async function obtainAccessToken() {
  const auth = new GoogleAuth({
    keyFile: "copper-vertex-402509-5554c3d97225.json", // Replace with the path to your service account key file
    scopes: ["https://www.googleapis.com/auth/cloud-platform"], // Adjust scopes according to your needs
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  // console.log("Access Token:", accessToken.token);
  return accessToken.token;
}

obtainAccessToken().catch(console.error);
