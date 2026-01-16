import "dotenv/config";
import { Client, Databases, Permission, Role } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68b2acfd0011b1ff7811")
  .setKey(
    "standard_c7463d24501910e1f93f2256631f3ba154bd14f5a4bb8fd12b54f7394122cc7082441297772c70db3efa7ca0b7c6d15a154aa115b01916462fd043b4909e59e231dc79eef70f497c46b83fd48b38bcea169d0b4a6449e320bca2b8f50f830d7c9c24b2f5fb10df192a2e1ed9e28b06f27426f5b215b1db60dc11c3f43b3f7e08"
  ); // 👈 THIS is required

const databases = new Databases(client);

const DATABASE_ID = "68b2b7ce0004af892598";
const COLLECTION_ID = "profile";

async function setupProfileCollection() {
  try {
    await databases.createCollection(DATABASE_ID, COLLECTION_ID, "Profile", [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
    ]);
    console.log("✅ Collection created");
  } catch {
    console.log("ℹ️ Collection already exists");
  }

  const attributes = [
    ["title", "string", true, 255],
    ["welcomeText", "string", true, 2000],
    ["latitude", "double", false],
    ["longitude", "double", false],
    ["latitudeDelta", "double", false],
    ["longitudeDelta", "double", false],
    ["instagram", "string", false, 255],
    ["twitter", "string", false, 255],
    ["facebook", "string", false, 255],
    ["telegram", "string", false, 255],
    ["tiktok", "string", false, 255],
    ["ownerId", "string", true, 255],
    ["isPublic", "boolean", true],
  ];

  for (const [key, type, required, size] of attributes) {
    try {
      if (type === "string") {
        await databases.createStringAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          key,
          size,
          required
        );
      }
      if (type === "double") {
        await databases.createFloatAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          key,
          required
        );
      }
      if (type === "boolean") {
        await databases.createBooleanAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          key,
          required
        );
      }
      console.log(`✅ Attribute: ${key}`);
    } catch {
      console.log(`ℹ️ Attribute exists: ${key}`);
    }
  }
}

setupProfileCollection();
