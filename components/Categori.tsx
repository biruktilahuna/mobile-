import {
  checkProducts,
  deleteCategory,
  getAllcategrory,
  savinCategori,
  updathingCategory,
} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductList from "./Productlist";

export default function Categori() {
  const [refresh, setrefresh] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [categoryi, setCategoryi] = useState("");
  const [collectionid, setcollectionid] = useState("");
  const [newcategory, setnewcategory] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblecat, setModalVisiblecat] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [editError, setEditError] = useState("");
  const [productCount, setProductCount] = useState(0);

  const {
    data: Savedcategori,
    loding: savedLoading,
    error: savedError,
    refetch,
    reset,
  } = useFetch(getAllcategrory);

  const onrefresh = useCallback(async () => {
    setrefresh(true);
    reset();
    await refetch();
    setrefresh(false);
  }, []);

  /* LOAD PRODUCT COUNT WHEN MODAL OPENS */
  useEffect(() => {
    if (!modalVisiblecat || !collectionid) return;

    (async () => {
      const count = await checkProducts(collectionid);
      setProductCount(count);
    })();
  }, [modalVisiblecat, collectionid]);

  /* SET FIRST CATEGORY AS DEFAULT WHEN DATA LOADS */
  useEffect(() => {
    if (Savedcategori && Savedcategori.length > 0 && !categoryi) {
      const first = Savedcategori[0];
      setCategoryi(first.name);
      setcollectionid(first.$id);
      setnewcategory(first.name);
    }
  }, [Savedcategori, categoryi]);

  /* ADD CATEGORY */
  const addItem = async () => {
    if (!newItem.trim()) return;

    await savinCategori(newItem.trim());
    setNewItem("");
    setModalVisible(false);
    await refetch();
  };

  /* UPDATE CATEGORY */
  const updateCategory = async () => {
    if (!newcategory.trim()) {
      setEditError("Category name cannot be empty");
      return;
    }

    setEditError("");
    setModalVisiblecat(false);

    await updathingCategory(categoryi, newcategory.trim());
    setCategoryi(newcategory.trim());
    setnewcategory("");
    await refetch();
  };

  /* DELETE CATEGORY (CONFIRMED & EMPTY ONLY) */
  const confirmRemove = async () => {
    if (productCount > 0) return;

    setConfirmDelete(false);
    setModalVisiblecat(false);

    await deleteCategory(collectionid);
    setCategoryi("");
    setcollectionid("");
    setnewcategory("");
    await refetch();
  };

  return (
    <View>
      {savedLoading ? (
        <ActivityIndicator size="large" className="mt-10 self-center" />
      ) : savedError ? (
        <Text>{savedError.message}</Text>
      ) : (
        <>
          {/* HEADER */}
          <View className="flex-row justify-between bg-slate-700 p-2">
            <Pressable
              onPress={() => categoryi && setModalVisiblecat(true)}
              disabled={!categoryi}
            >
              <Text className="text-white font-semibold">
                {categoryi || "Edit"}
              </Text>
            </Pressable>

            <TouchableOpacity
              className="bg-green-700 px-4 py-1 rounded-lg"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white font-semibold">New</Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORY LIST */}
          <FlatList
            horizontal
            data={Savedcategori}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setCategoryi(item.name);
                  setcollectionid(item.$id);
                  setnewcategory(item.name);
                }}
              >
                <View className="px-4 py-2 bg-cyan-900 rounded-lg">
                  <Text className="text-white">{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View className="w-3" />}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onrefresh} />
            }
          />
        </>
      )}

      {/* ADD MODAL */}
      <Modal transparent visible={modalVisible}>
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white p-6 mx-8 rounded-lg">
            <Text className="text-lg font-bold mb-4">Add New Category</Text>

            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="New category"
              className="border rounded p-2 mb-4 text-black"
            />

            <View className="flex-row justify-end">
              <Pressable
                className="bg-gray-400 px-6 py-2 rounded mr-3"
                onPress={() => {
                  setNewItem("");
                  setModalVisible(false);
                }}
              >
                <Text className="text-white text-center">Cancel</Text>
              </Pressable>

              <Pressable
                className="bg-blue-500 px-6 py-2 rounded"
                onPress={addItem}
              >
                <Text className="text-white text-center">Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT MODAL */}
      <Modal transparent visible={modalVisiblecat}>
        <View className="flex-1 justify-center bg-black/50 items-center">
          <View className="bg-white p-6 w-80 rounded-lg">
            <Text className="text-lg font-bold mb-2">Edit Category</Text>

            <TextInput
              value={newcategory}
              onChangeText={(t) => {
                setnewcategory(t);
                setEditError("");
              }}
              className="border rounded p-2 text-black"
            />

            {/* PRODUCT COUNT */}
            <Text className="text-gray-600 mt-2">
              Products in category: {productCount}
            </Text>

            {editError ? (
              <Text className="text-red-600 mt-2">{editError}</Text>
            ) : null}

            <View className="flex-row mt-4">
              <Pressable
                className="bg-gray-400 flex-1 mr-2 py-2 rounded"
                onPress={() => setModalVisiblecat(false)}
              >
                <Text className="text-white text-center">Cancel</Text>
              </Pressable>

              <Pressable
                className="bg-blue-600 flex-1 mr-2 py-2 rounded"
                onPress={updateCategory}
              >
                <Text className="text-white text-center">Save</Text>
              </Pressable>

              {/* REMOVE (DISABLED IF NOT EMPTY) */}
              <Pressable
                disabled={productCount > 0}
                className={`flex-1 py-2 rounded ${
                  productCount > 0 ? "bg-red-300" : "bg-red-600"
                }`}
                onPress={() => setConfirmDelete(true)}
              >
                <Text className="text-white text-center">Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal transparent visible={confirmDelete}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-72">
            <Text className="font-bold text-lg mb-2 text-black">
              Delete Category?
            </Text>
            <Text className="text-gray-700 mb-4">
              This action cannot be undone.
            </Text>

            <View className="flex-row">
              <Pressable
                className="bg-gray-400 flex-1 mr-2 py-2 rounded"
                onPress={() => setConfirmDelete(false)}
              >
                <Text className="text-white text-center">Cancel</Text>
              </Pressable>

              <Pressable
                className="bg-red-600 flex-1 py-2 rounded"
                onPress={confirmRemove}
              >
                <Text className="text-white text-center">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ProductList categoryid={collectionid} />
    </View>
  );
}
