import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { getPage, updatePage } from "@/services/appwrite";
import { uploadImageImgBB } from "@/services/imgbb";
import useFetch from "@/services/useFetch";

const TopSection = () => {
  const [editMode, setEditMode] = useState(false);

  // Persisted values from DB (direct ImgBB URLs)
  const [bgImageUrl, setBgImageUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");

  // Temporary state for newly picked + uploaded images
  const [tempBgUri, setTempBgUri] = useState<string | null>(null);
  const [tempBgUploadedUrl, setTempBgUploadedUrl] = useState<string | null>(
    null
  );
  const [tempLogoUri, setTempLogoUri] = useState<string | null>(null);
  const [tempLogoUploadedUrl, setTempLogoUploadedUrl] = useState<string | null>(
    null
  );

  // Uploading indicators
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [originalData, setOriginalData] = useState<any>({});

  const pageId = "68b55cd90004a9ce7a2b"; // your page document ID

  const {
    data: page,
    loding,
    error,
    refetch,
  } = useFetch(() => getPage(pageId));

  // Load data from Appwrite into state
  useEffect(() => {
    if (page && page.length > 0) {
      const pageData = page[0];
      setBgImageUrl(pageData.BGurl || "");
      setLogoUrl(pageData.Logourl || "");
      setTitle(pageData.title || "");
      setSubtitle(pageData.subtitle || "");
      setOriginalData(pageData);
    }
  }, [page]);

  const handleLongPress = () => setEditMode(true);

  // Generic image picker + upload to ImgBB
  const pickAndUploadImage = async (
    setUri: (uri: string | null) => void,
    setUploadedUrl: (url: string | null) => void,
    setUploading: (val: boolean) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (result?.canceled) return;

    const uri = result.assets[0].uri;
    setUri(uri); // for preview
    setUploading(true);

    try {
      const uploadResult = await uploadImageImgBB(result);
      if (!uploadResult || !uploadResult.url) {
        throw new Error("Upload failed");
      }
      setUploadedUrl(uploadResult.url); // direct public ImgBB URL
    } catch (err) {
      console.error("ImgBB upload failed:", err);
      alert("Failed to upload image. Please try again.");
      setUri(null); // revert preview on failure
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const hasChanges =
      title !== originalData.title ||
      subtitle !== originalData.subtitle ||
      tempBgUploadedUrl ||
      tempLogoUploadedUrl;

    if (!hasChanges) {
      setEditMode(false);
      return;
    }

    try {
      const updateObj: any = {};

      // Background image changed
      if (tempBgUploadedUrl) {
        updateObj.BGurl = tempBgUploadedUrl;
        // No need to store a "name" anymore – we only keep the direct URL
      }

      // Logo changed
      if (tempLogoUploadedUrl) {
        updateObj.Logourl = tempLogoUploadedUrl;
      }

      // Text fields
      if (title !== originalData.title) updateObj.title = title;
      if (subtitle !== originalData.subtitle) updateObj.subtitle = subtitle;

      // Update timestamp
      updateObj.$updatedAt = new Date().toISOString();

      await updatePage(pageId, updateObj);

      // Update local state to reflect saved values
      if (tempBgUploadedUrl) {
        setBgImageUrl(tempBgUploadedUrl);
        setTempBgUri(null);
        setTempBgUploadedUrl(null);
      }
      if (tempLogoUploadedUrl) {
        setLogoUrl(tempLogoUploadedUrl);
        setTempLogoUri(null);
        setTempLogoUploadedUrl(null);
      }

      setOriginalData((prev: any) => ({ ...prev, ...updateObj }));
      setEditMode(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes.");
    }
  };

  const fallbackBg =
    "https://img.pikbest.com/wp/202408/shopping-cart-interface-shimmering-abstract-against-blue-background-a-modern-take-on-e-commerce-design-3d-rendering_9779336.jpg!w700wp";
  const fallbackLogo =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlpb9wX_gxfa8YK3abh0Cq4SN_4BocJZwHzF5ieUpL4-pE00KJWRp-r7BLaRj6utaitRQ&usqp=CAU";

  return (
    <TouchableWithoutFeedback onLongPress={handleLongPress}>
      <View>
        {loding ? (
          <View className="h-64 justify-center items-center bg-gray-200">
            <ActivityIndicator size="large" />
            <Text className="mt-2">Loading...</Text>
          </View>
        ) : (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <ImageBackground
              source={{ uri: bgImageUrl || fallbackBg }}
              className="h-64 justify-center"
            >
              <View className="absolute top-5 left-5">
                <Image
                  source={{ uri: logoUrl || fallbackLogo }}
                  className="w-12 h-12 rounded-lg"
                />
              </View>

              <View className="items-center">
                <Text className="text-white text-2xl font-bold">
                  {title || "Welcome to Our Shop"}
                </Text>
                <Text className="text-white text-base mt-1">
                  {subtitle || "Find your next favorite item"}
                </Text>
              </View>
            </ImageBackground>
          </Animated.View>
        )}

        {/* Edit Modal */}
        <Modal
          visible={editMode}
          transparent
          animationType="slide"
          onRequestClose={() => setEditMode(false)}
        >
          <View className="flex-1 bg-black/80 justify-center px-5">
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-xl font-bold mb-4">Edit Header</Text>

              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              />

              <TextInput
                placeholder="Subtitle"
                value={subtitle}
                onChangeText={setSubtitle}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
              />

              {/* Logo Section */}
              <Text className="text-sm font-medium mb-2">Logo</Text>
              <Pressable
                onPress={() =>
                  pickAndUploadImage(
                    setTempLogoUri,
                    setTempLogoUploadedUrl,
                    setUploadingLogo
                  )
                }
                disabled={uploadingLogo}
                className="bg-blue-600 py-3 rounded-lg mb-4"
              >
                {uploadingLogo ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-medium">
                    Change Logo
                  </Text>
                )}
              </Pressable>

              {/* Background Section */}
              <Text className="text-sm font-medium mb-2">Background Image</Text>
              <Pressable
                onPress={() =>
                  pickAndUploadImage(
                    setTempBgUri,
                    setTempBgUploadedUrl,
                    setUploadingBg
                  )
                }
                disabled={uploadingBg}
                className="bg-blue-600 py-3 rounded-lg mb-6"
              >
                {uploadingBg ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-medium">
                    Change Background
                  </Text>
                )}
              </Pressable>

              {/* Action Buttons */}
              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setEditMode(false)}
                  className="bg-gray-500 px-6 py-3 rounded-lg flex-1 mr-3"
                >
                  <Text className="text-white text-center font-medium">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSave}
                  disabled={uploadingBg || uploadingLogo}
                  className={`px-6 py-3 rounded-lg flex-1 ${
                    uploadingBg || uploadingLogo ? "bg-blue-400" : "bg-blue-600"
                  }`}
                >
                  <Text className="text-white text-center font-medium">
                    Save
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopSection;
