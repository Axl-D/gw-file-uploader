import fetch from "node-fetch";

const integrationToken = process.env.INTEGRATION_TOKEN;

export async function notionCreateGCPFile(uploadedFileDetails) {
  const { fileName, folderName, publicUrl } = uploadedFileDetails;
  const pageProperties = {
    Name: {
      title: [
        {
          text: {
            content: fileName,
          },
        },
      ],
    },
    URL: {
      url: publicUrl, // URL for the new page
    },
    Folder: {
      select: {
        name: folderName, // Selecting "Logos" as the folder category
      },
    },
    // Assuming you want to link to an existing page in the related database,
    // you would need the ID of the page you're linking to. For simplicity,
    // this example won't include a direct relation update as it requires
    // fetching and specifying existing page IDs in the related database.
  };

  const databaseId = "1d65013c04d945fbab1e8ee94ccff836";
  const emoji = "🖼️";
  const children = [
    {
      object: "block",
      type: "image",
      image: {
        type: "external",
        external: {
          url: publicUrl,
        },
      },
    },
  ];

  createPageInDatabase(databaseId, pageProperties, emoji, children);
}

async function createPageInDatabase(databaseId, pageProperties, emoji, children) {
  var requestBody = { parent: { database_id: databaseId }, properties: pageProperties };
  if (emoji) {
    requestBody.icon = { type: "emoji", emoji: emoji };
  }

  if (children) {
    requestBody.children = children;
  }

  console.log(requestBody);

  try {
    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${integrationToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Page created:", data.id);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
