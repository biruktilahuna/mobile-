import { deleteProduct, updateProduct } from "@/services/appwrite";
import { uploadImageImgBB } from "@/services/imgbb";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ProductCardProps = {
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  description: string;
  discount: number;
  productnameid: string;
  onUpdate?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  imageUrl,
  stock,
  description,
  discount,
  productnameid,
  onUpdate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

  // form states
  const [titlef, setTitlef] = useState(name);
  const [newPrice, setNewPrice] = useState<number>(price);
  const [quantity, setQuantity] = useState<number>(stock);
  const [desc, setDesc] = useState<string>(description);
  const [pickedImage, setPickedImage] = useState<string>(imageUrl);
  const [disc, setDisc] = useState<number>(discount);

  // uploaded image URL from ImgBB (only set when a new image is picked)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  // uploading state
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setTitlef(name);
    setNewPrice(price);
    setQuantity(stock);
    setDesc(description);
    setPickedImage(imageUrl);
    setDisc(discount);
    setUploadedImageUrl("");
  };

  useEffect(() => {
    if (modalVisible) resetForm();
  }, [modalVisible]);

  // Image picker + upload to ImgBB
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
    });

    if (result?.canceled) return;

    const asset = result.assets[0];
    setPickedImage(asset.uri); // preview locally
    setUploading(true);

    try {
      const uploadResult = await uploadImageImgBB(result);
      if (!uploadResult) {
        throw new Error("Upload cancelled or failed");
      }

      setUploadedImageUrl(uploadResult.url); // ImgBB direct public URL
    } catch (err) {
      console.error("ImgBB upload failed:", err);
      Alert.alert("Upload Failed", "Unable to upload image. Please try again.");
      setPickedImage(imageUrl); // revert preview on failure
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (uploading) return;

    try {
      const finalImageUrl = uploadedImageUrl || imageUrl; // use new if uploaded, else keep old

      await updateProduct(productnameid, {
        title: titlef,
        price: newPrice,
        stock: quantity,
        description: desc,
        image: finalImageUrl, // direct ImgBB URL
        discount: disc,
      });

      onUpdate?.();
      setModalVisible(false);
    } catch (error) {
      console.error("Product update failed:", error);
      Alert.alert("Update Failed", "Could not save changes.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productnameid);
              onUpdate?.();
              setModalVisible(false);
            } catch (error) {
              console.error("Product delete failed:", error);
              Alert.alert("Delete Failed", "Could not delete the product.");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      {/* Product Card */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-slate-700 w-48 rounded-xl shadow-md m-2 overflow-hidden"
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="text-white font-semibold mb-1">{name}</Text>
          <View className="flex flex-row justify-between">
            <Text className="text-white text-base mb-2">${price}</Text>
            <Text className="text-white text-base mb-3">Stock: {stock}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Product Update Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-11/12 max-h-[80%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold mb-4">Update Product</Text>

              {/* Image Preview */}
              <TouchableOpacity
                onPress={() => setImagePreviewVisible(true)}
                className="mb-3"
              >
                <Image
                  source={{ uri: pickedImage }}
                  className="w-full h-40 rounded-lg"
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Change Image Button */}
              <TouchableOpacity
                onPress={pickImage}
                disabled={uploading}
                className="bg-gray-200 p-3 rounded-lg mb-4"
              >
                <Text className="text-center text-blue-600 font-medium">
                  {uploading ? "Uploading image..." : "Change Image"}
                </Text>
              </TouchableOpacity>

              {/* Form Fields */}
              <TextInput
                value={titlef}
                onChangeText={setTitlef}
                placeholder="Product Name"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-black"
              />

              <TextInput
                placeholder="Price"
                value={newPrice?.toString() || ""}
                onChangeText={(text) =>
                  setNewPrice(isNaN(parseFloat(text)) ? 0 : parseFloat(text))
                }
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-black"
              />

              <TextInput
                placeholder="Stock Quantity"
                value={quantity?.toString() || ""}
                onChangeText={(text) =>
                  setQuantity(isNaN(parseInt(text)) ? 0 : parseInt(text))
                }
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-black"
              />

              <TextInput
                value={desc}
                onChangeText={setDesc}
                placeholder="Description"
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-black"
              />

              <TextInput
                placeholder="Discount (%)"
                value={disc?.toString() || ""}
                onChangeText={(text) =>
                  setDisc(isNaN(parseInt(text)) ? 0 : parseInt(text))
                }
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3 text-black"
              />

              {/* Action Buttons */}
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-500 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  className="bg-red-600 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium">Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleUpdate}
                  disabled={uploading}
                  className={`px-6 py-3 rounded-lg ${
                    uploading ? "bg-blue-400" : "bg-blue-600"
                  }`}
                >
                  {uploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-medium">Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Full-screen Image Preview */}
      <Modal
        visible={imagePreviewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePreviewVisible(false)}
      >
        <View className="flex-1 bg-black justify-center items-center">
          <TouchableOpacity
            onPress={() => setImagePreviewVisible(false)}
            className="absolute top-12 right-6 z-10"
          >
            <Text className="text-white text-4xl">×</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: pickedImage }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
};

export default ProductCard;
