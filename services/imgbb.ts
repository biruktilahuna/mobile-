import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY!;
// console.log("IMGBB KEY:", IMGBB_API_KEY);

async function uriToBase64(uri: string) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

export type ImgBBUploadResult = {
  url: string;
  thumbUrl?: string | null;
  mediumUrl?: string | null;
  deleteUrl?: string | null;
  expiresAt?: Date | null;
};

// Upload image to ImgBB with a 6-month expiration
export async function uploadImageImgBB(
  result: ImagePicker.ImagePickerResult,
): Promise<ImgBBUploadResult | null> {
  if (result?.canceled || !result?.assets?.length) return null;

  const asset = result.assets[0];

  if (!asset.uri || !asset.type) {
    throw new Error("Selected asset is missing URI or type.");
  }

  // Convert to Base64
  const base64Image = await uriToBase64(asset.uri);
  console.log("Base64 image length:", base64Image);
  // ImgBB expects "data:<mime>;base64,<base64>"
  // const base64Image = await uriToBase64(asset.uri);
  // ImgBB wants RAW base64 only
  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", base64Image);
  formData.append("expiration", "15552000"); // 180 days

  try {
    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    console.log("ImgBB raw response:", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(
        "ImgBB returned non-JSON response. Check request formatting.",
      );
    }

    if (!json?.success || !json?.data?.url) {
      throw new Error(json?.error?.message || "ImgBB upload failed");
    }

    return {
      url: json.data.url,
      thumbUrl: json.data.thumb?.url ?? null,
      mediumUrl: json.data.medium?.url ?? null,
      deleteUrl: json.data.delete_url ?? null,
      expiresAt: json.data.expiration
        ? new Date(json.data.expiration * 1000)
        : null,
    };
  } catch (error) {
    console.error("ImgBB upload error:", error);
    throw error;
  }
}
