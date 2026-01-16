// optional for detecting file type
import {} from "appwrite";
import {
  Account,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import "react-native-url-polyfill/auto";
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID1 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID1!;
const COLLECTION_ID2 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID2!;
const COLLECTION_ID3 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID3!;
const COLLECTION_ID4 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID4!;
const COLLECTION_ID5 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID5!;
const BUKET = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!;
const COLLECTION_ID6 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID6!;
const COLLECTION_ID7 = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID7!;
const PROFILE_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID8!;

// Initialize Appwrite client

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!) // Replace with your project ID
  .setPlatform("com.birukweb.shop");
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

// -----------------------------------------------------------------------------------------------getAllcategrory---------------------------

export const getAllcategrory = async (): Promise<
  savedcatagory[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID4, [
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents as unknown as savedcatagory[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
// --------------------------------------------------------------------------------------------------savingcategory-------------------------------------------------------------
export const savinCategori = async (name: string) => {
  const normalizedName = name.trim().toLowerCase();

  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID4, [
      Query.equal("name", normalizedName),
    ]);

    if (result.documents.length > 0) {
      console.log(`${name} can't be duplicated`);
      return { success: false, message: "Category already exists" };
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID4, ID.unique(), {
        name: name,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// -------------------------------------------------------------------------------------------updathing category----------------------------------------------------------->

export const updathingCategory = async (name: string, newname: string) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID4, [
      Query.equal("name", name),
    ]);

    if (result.documents.length > 0) {
      const existingDoc = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID4,
        existingDoc.$id,
        {
          name: newname,
        }
      );

      console.log("Updated category name to:", newname);
    } else {
      console.log("No matching document found.");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
// ---------------------------------------------------------------------------------------------delete catagory ------------------------------------------------------

export const deleteCategory = async (id: string) => {
  console.log("we are hear !", id);
  try {
    // First check if the document exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID4, [
      Query.equal("$id", id),
    ]);

    if (result.documents.length > 0) {
      // Delete the document
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID4, id);

      console.log("Deleted category with id:", id);
    } else {
      console.log("No document found with that ID.");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// ---------------------------------------------------------------------------------------------products--------------------------------------------------------------------->

export const getProducts = async (
  categoryId: string
): Promise<Product[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID5, [
      Query.equal("categoryId", categoryId),
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents as unknown as Product[];
  } catch (error) {
    console.log("Error fetching products:", error);
    return undefined;
  }
};
// ----------------------------------------------------------------------------------------------check products------------------------------------
export const checkProducts = async (categoryId: string) => {
  console.log(categoryId);
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID5, [
      Query.equal("categoryId", categoryId),
    ]);
    let x = false;
    if (result.documents.length > 0) {
      x = true;
      console.log("this is true");
    } else {
      x = false;
      console.log("this is false ");
    }
    return x;
  } catch (error) {
    console.log("Error cheking products products exist:", error);
    return undefined;
  }
};

// ----------------------------------------------------------------------------------------------ading products-------------------------------------------------------------->

export const addProduct = async (
  product: Omit<Product, "id" | "createdAt">
): Promise<Product | undefined> => {
  try {
    const result = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID5,
      ID.unique(),
      {
        ...product,
      }
    );
    return result as unknown as Product; // ✅ make sure we RETURN here
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return undefined;
  }
};

// ----------------------------------------------------------------------------------------------------------updating prodacuts---------------------------------------------------------->

export const updateProduct = async (
  productId: string,
  updates: Partial<Omit<Product, "$id" | "$createdAt">> // 🔹 only allow updatable fields
): Promise<Product | undefined> => {
  try {
    const result = await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID5,
      productId,
      {
        ...updates,
        // optional: track last update
      }
    );

    return result as unknown as Product;
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return undefined;
  }
};
// ---------------------------------------------------------------------------------------------deleting a product-------------------------------------------------------------------------------------------->
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    await database.deleteDocument(DATABASE_ID, COLLECTION_ID5, productId);

    return true; // ✅ deletion succeeded
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return false; // ❌ deletion failed
  }
};

// ----------------------------------------------------------------------------------------------pages up date------------------------------------------------------------------------------------------------->

export const updatePage = async (
  pagesId: string,
  updates: Partial<Omit<Product, "$id" | "$createdAt">> // 🔹 only allow updatable fields
): Promise<Product | undefined> => {
  try {
    const result = await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID6,
      pagesId,
      {
        ...updates,
        // optional: track last update
      }
    );

    return result as unknown as Product;
  } catch (error) {
    console.error("❌ Error updating pages:", error);
    return undefined;
  }
};

// ---------------------------------------------------------------------------------------------------------get the page---------------------------------------------------------------------------------------->

export const getPage = async (
  categoryId: string
): Promise<page[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID6, [
      Query.equal("$id", categoryId),
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents as unknown as page[];
  } catch (error) {
    console.log("Error fetching this page:", error);
    return undefined;
  }
};
// ------------------------------------------------------------------------------------------------------getorders--------------------------------------->
export const getorders = async (
  status: string
): Promise<orders[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID3, [
      Query.equal("status", status),
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents as unknown as orders[];
  } catch (error) {
    console.log("Error fetching orders:", error);
    return undefined;
  }
};
// ------------------------------------------------------------------------------------------------get order with id -------------------------------------->

export const getordersid = async (
  orid: string
): Promise<orders[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID3, [
      Query.equal("$id", orid),
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents as unknown as orders[];
  } catch (error) {
    console.log("Error fetching orders:", error);
    return undefined;
  }
};
// -------------------------------------------------------------------------------------------------------update order status-------------------------------

export const updateOrderStatus = async (
  orid: string,
  newStatus: string
): Promise<any | undefined> => {
  try {
    const result = await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID3,
      orid, // document ID
      {
        status: newStatus, // only update this field
      }
    );

    return result;
  } catch (error) {
    console.log("Error updating status:", error);
    return undefined;
  }
};
// ------------------------------------------------------------------------------------------------------get cart ------------------------------------------>
export const getcart = async (
  odrderid: string
): Promise<carts[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID7, [
      Query.equal("orderId", odrderid),
      Query.orderDesc("$createdAt"),
    ]);
    return result.documents as unknown as carts[];
  } catch (error) {
    console.log("Error fetching orders:", error);
    return undefined;
  }
};
// 1️⃣ Get profile
export const getProfile = async () => {
  const res = await database.listDocuments(DATABASE_ID, PROFILE_COLLECTION_ID);

  return res.documents[0] ?? null;
};

// 2️⃣ Update title + welcome text
export const updateProfileText = async (
  documentId: string,
  title: string,
  welcomeText: string
) => {
  return database.updateDocument(
    DATABASE_ID,
    PROFILE_COLLECTION_ID,
    documentId,
    { title, welcomeText }
  );
};

// 3️⃣ Update social + location
export const updateSocialAndLocation = async (
  documentId: string,
  payload: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    telegram?: string;
    tiktok?: string;
    latitude?: number;
    longitude?: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  }
) => {
  return database.updateDocument(
    DATABASE_ID,
    PROFILE_COLLECTION_ID,
    documentId,
    payload
  );
};
// ------------------------------------------------------------------------------------------------------end----------------------------------------------------------->
// export const uploadImageAppwrite = async (
//   imageUri: string,
//   urlsize: string
// ): Promise<string> => {
//   const fileName = imageUri.split("/").pop() || `image-${Date.now()}.jpg`;

//   try {
//     // In react-native-appwrite, file uploads are simplified – pass the URI directly
//     const file = {
//       uri: imageUri,
//       name: fileName,
//       type: "image/jpeg", // Or use mime.lookup for dynamic type
//       size: urlsize,
//     };

//     const result = await storage.createFile(BUKET, ID.unique(), file);
//     console.log("Uploaded File:", result);
//     return result.$id; // Returns the file ID
//   } catch (error: any) {
//     console.error("Error uploading image to Appwrite:", error.message || error);
//     throw error;
//   }
// };

// export const getImageUrl = async (fileId: string): Promise<ArrayBuffer> => {
//   try {
//     // Get preview URL (returns a string URL directly)
//     const previewUrl = await storage.getFileDownload(BUKET, fileId);
//     // Optional params: storage.getFilePreview(BUCKET, fileId, { width: 300, height: 300 });

//     console.log("Preview URL:", previewUrl);
//     return previewUrl;

//     // Alternative for full download URL:
//     // const downloadUrl = await storage.getFileDownload(BUCKET, fileId);
//     // return downloadUrl;
//   } catch (error: any) {
//     console.error("Error fetching image URL:", error.message || error);
//     throw error;
//   }
// };

// ------------------------------------------------------------------------------------------------------------------------>>>

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    console.log("User registered:", user);
    return user;
  } catch (error) {
    console.error("Registration error:", error);
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Logged in:", session);
    return session;
  } catch (error) {
    console.error("Login error:", error);
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    console.log("Current user:", user);
    return user;
  } catch (error) {
    console.error("Get user error:", error);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    console.log("Logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

function unique(): string {
  throw new Error("Function not implemented.");
}
// ------------------------------------------------------------------------------------ this should work -----------------------------------------
