import { addProduct, getProducts } from "@/services/appwrite";
import { uploadImageImgBB } from "@/services/imgbb";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "./ProductCard";

export default function ProductList({ categoryid }): React.JSX.Element {
  const [modalVisiblep, setModalVisiblep] = useState(false);
  const [titlef, setTitlef] = useState("");
  const [pricef, setPricef] = useState<number>(0);
  const [stockf, setStockf] = useState<number>(0);
  const [descriptionf, setDescriptionf] = useState("");

  // 🖼 Image state
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageDeleteUrl, setImageDeleteUrl] = useState("");

  // 🔄 UI state
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    data: Savedproduct,
    loding: productLoading,
    error: productError,
    refetch: prefetch,
    reset: preset,
  } = useFetch(() => getProducts(categoryid.toString()));

  useEffect(() => {
    preset();
    prefetch();
  }, [categoryid]);

  const fetchProducts = async () => {
    preset();
    await prefetch();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // 📸 Pick & upload image (ImgBB)
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    setPickedImage(result.assets[0].uri);
    setUploading(true);

    try {
      const uploaded = await uploadImageImgBB(result);

      if (!uploaded) throw new Error("Upload failed");

      setImageUrl(uploaded.url);
      // setImageDeleteUrl(uploaded.deleteUrl);
      // console.log("this the delete", uploaded.deleteUrl); // ✅ RELIABLE
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
      setPickedImage(null);
    } finally {
      setUploading(false);
    }
  };

  // 💾 Save product
  const handleAddProduct = async () => {
    if (!pickedImage || uploading || !imageUrl) {
      alert("Please pick and upload an image first.");
      return;
    }

    await addProduct({
      title: titlef,
      description: descriptionf,
      price: pricef,
      stock: stockf,
      image: imageUrl, // ImgBB public URL
      name: imageDeleteUrl, // 🔑 store for delete
      categoryId: categoryid,
      discount: 0,
    });

    // 🔄 Reset state
    setModalVisiblep(false);
    setTitlef("");
    setDescriptionf("");
    setPricef(0);
    setStockf(0);
    setPickedImage(null);
    setImageUrl("");
    setImageDeleteUrl("");

    await fetchProducts();
  };

  if (productLoading) return <Text>Loading...</Text>;
  if (productError) return <Text>Error loading products</Text>;

  return (
    <>
      <FlatList
        data={Savedproduct}
        renderItem={({ item }) => (
          <ProductCard
            name={item.title}
            price={item.price}
            imageUrl={item.image}
            stock={item.stock}
            productnameid={item.$id}
            discount={item.discount}
            description={item.description}
            // imageDeleteUrl={item.imageDeleteUrl} // 👈 used later
            onUpdate={fetchProducts}
          />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 7,
          marginBottom: 7,
        }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 600,
          paddingHorizontal: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* ➕ Floating Add Button */}
      <TouchableOpacity
        className="absolute z-0 bg-cyan-900 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        style={{ top: 380, right: 20 }}
        onPress={() => setModalVisiblep(true)}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* ➕ Product Add Modal (UNCHANGED UI) */}
      <Modal
        animationType="slide"
        visible={modalVisiblep}
        transparent
        onRequestClose={() => setModalVisiblep(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80">
            <Text className="text-lg font-bold mb-4 text-black">
              Add New Product
            </Text>

            <TextInput
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholder="Product Title"
              value={titlef}
              onChangeText={setTitlef}
              placeholderTextColor="#888"
            />

            <TextInput
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholder="Price"
              value={pricef.toString()}
              onChangeText={(text) => setPricef(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />

            <TouchableOpacity
              className="bg-gray-400 py-2 px-3 rounded mb-3 items-center"
              onPress={pickImage}
            >
              <Text className="text-white font-semibold">
                {uploading ? "Uploading..." : "Pick Image"}
              </Text>
            </TouchableOpacity>

            {pickedImage && (
              <Image
                source={{ uri: pickedImage }}
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}

            <TextInput
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholder="Stock Quantity"
              value={stockf.toString()}
              onChangeText={(text) => setStockf(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />

            <TextInput
              className="border border-gray-300 rounded px-3 py-2 mb-3 text-black"
              placeholder="Product Description"
              value={descriptionf}
              onChangeText={setDescriptionf}
              multiline
              numberOfLines={3}
              placeholderTextColor="#888"
            />

            <TouchableOpacity
              className={`py-2 rounded items-center ${
                uploading || !pickedImage ? "bg-blue-500" : "bg-cyan-900"
              }`}
              disabled={uploading || !pickedImage}
              onPress={handleAddProduct}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">Save Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
