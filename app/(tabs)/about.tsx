import {
  getProfile,
  updateProfileText,
  updateSocialAndLocation,
} from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const About = () => {
  // State starts as null — fully driven by Appwrite data
  const [profileData, setProfileData] = useState<{
    title: string;
    welcomeText: string;
    socialLinks: {
      instagram: string;
      twitter: string;
      facebook: string;
      telegram: string;
      tiktok: string;
    };
  } | null>(null);

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editSocialVisible, setEditSocialVisible] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const { data, loding, error, refetch } = useFetch(async () => {
    return await getProfile();
  });
  console.log("Fetch profile error:", error);
  // Sync fetched data into local state
  useEffect(() => {
    if (!data) {
      setProfileData(null);
      setRegion(null);
      setDocumentId(null);
      return;
    }

    setDocumentId(data.$id);

    setProfileData({
      title: data.title || "My Profile",
      welcomeText: data.welcomeText || "",
      socialLinks: {
        instagram: data.instagram || "",
        twitter: data.twitter || "",
        facebook: data.facebook || "",
        telegram: data.telegram || "",
        tiktok: data.tiktok || "",
      },
    });

    setRegion({
      latitude: data.latitude ?? 9.03,
      longitude: data.longitude ?? 38.74,
      latitudeDelta: data.latitudeDelta ?? 0.01,
      longitudeDelta: data.longitudeDelta ?? 0.02,
    });
    console.log("Profile data loaded:", data);
  }, [data]);
  const regional = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };
  const getMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location access is required to update your position."
      );
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.02,
      });
      Alert.alert("Success", "Location updated!");
    } catch (err) {
      Alert.alert("Error", "Failed to get current location.");
    }
  };

  const openLink = async (url: string) => {
    if (!url) return;

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const supported = await Linking.canOpenURL(fullUrl);

    if (supported) {
      await Linking.openURL(fullUrl);
    } else {
      Alert.alert("Invalid Link", "Cannot open this URL.");
    }
  };

  // Loading state
  if (loding) {
    return (
      <View className="flex-1 bg-slate-700 justify-center items-center">
        <Text className="text-white text-lg">Loading your profile...</Text>
      </View>
    );
  }

  // No profile yet — first-time user experience
  if (!profileData || !region) {
    return (
      <View className="flex-1 bg-slate-700 justify-center items-center px-8">
        <Text className="text-white text-center text-lg mb-8">
          You haven't set up your profile yet. Let's get started!
        </Text>
        <TouchableOpacity
          onPress={() => setEditProfileVisible(true)}
          className="bg-slate-600 px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-bold text-lg">Create Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEditSocialVisible(true)}
          className="mt-4 px-8 py-3 rounded-xl border border-slate-500"
        >
          <Text className="text-slate-300 font-medium">
            Add Social Links & Location
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-700">
      {/* MAP */}
      {/* <View className="h-1/3">
        <ProfileMap region={region} height="100%" title={profileData.title} />
      </View> */}
      {/* <View className="h-1/3">
        <MapComponent region={region} height={400} title={profileData.title} />
      </View> */}
      {/* SOCIAL MEDIA SECTION */}
      <View className="bg-slate-800 px-5 py-4">
        <View className="flex-row justify-between items-center mt-10  mb-8">
          <Text className="text-white font-semibold text-lg ">
            Social Media
          </Text>
          <TouchableOpacity onPress={() => setEditSocialVisible(true)}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between">
          <SocialIcon
            name="logo-instagram"
            color="#E1306C"
            url={profileData.socialLinks.instagram}
            onPress={openLink}
          />
          <SocialIcon
            name="logo-twitter"
            color="#1DA1F2"
            url={profileData.socialLinks.twitter}
            onPress={openLink}
          />
          <SocialIcon
            name="logo-facebook"
            color="#1877F2"
            url={profileData.socialLinks.facebook}
            onPress={openLink}
          />
          <SocialIcon
            name="paper-plane-outline"
            color="#229ED9"
            url={profileData.socialLinks.telegram}
            onPress={openLink}
          />
          <SocialIcon
            name="logo-tiktok"
            color="#000000"
            url={profileData.socialLinks.tiktok}
            onPress={openLink}
          />
        </View>
      </View>

      {/* MAIN CONTENT */}
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-white">
            {profileData.title}
          </Text>
          <TouchableOpacity onPress={() => setEditProfileVisible(true)}>
            <Ionicons name="create-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-zinc-200 text-base leading-6">
          {profileData.welcomeText || "No welcome message yet."}
        </Text>
      </View>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={editProfileVisible} transparent animationType="slide">
        <ModalWrapper>
          <Text className="text-2xl font-bold mb-6 text-center">
            Edit Profile
          </Text>

          <TextInput
            className="modal-input mb-4"
            placeholder="Profile Title"
            placeholderTextColor="#999"
            value={profileData.title}
            onChangeText={(v) => setProfileData({ ...profileData, title: v })}
          />

          <TextInput
            className="modal-input h-32 mb-6"
            placeholder="Welcome message..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            value={profileData.welcomeText}
            onChangeText={(v) =>
              setProfileData({ ...profileData, welcomeText: v })
            }
          />

          <ModalActions
            onCancel={() => setEditProfileVisible(false)}
            onSave={async () => {
              if (!documentId)
                return Alert.alert("Error", "Profile ID missing.");

              await updateProfileText(
                documentId,
                profileData.title,
                profileData.welcomeText
              );
              setEditProfileVisible(false);
              refetch();
            }}
          />
        </ModalWrapper>
      </Modal>

      {/* EDIT SOCIAL & LOCATION MODAL */}
      <Modal visible={editSocialVisible} transparent animationType="slide">
        <ModalWrapper>
          <Text className="text-2xl font-bold mb-6 text-center">
            Edit Social Links & Location
          </Text>

          {Object.keys(profileData.socialLinks).map((key) => (
            <TextInput
              key={key}
              className="modal-input mb-4"
              placeholder={`${
                key.charAt(0).toUpperCase() + key.slice(1)
              } (username or full URL)`}
              placeholderTextColor="#999"
              value={profileData.socialLinks[key]}
              onChangeText={(v) =>
                setProfileData({
                  ...profileData,
                  socialLinks: { ...profileData.socialLinks, [key]: v },
                })
              }
            />
          ))}

          <TouchableOpacity
            onPress={getMyLocation}
            className="bg-blue-600 py-4 rounded-xl my-5 flex-row justify-center items-center"
          >
            <Ionicons name="location" size={20} color="white" />
            <Text className="text-white font-bold ml-2">
              Update My Current Location
            </Text>
          </TouchableOpacity>

          <ModalActions
            onCancel={() => setEditSocialVisible(false)}
            onSave={async () => {
              if (!documentId)
                return Alert.alert("Error", "Profile ID missing.");

              await updateSocialAndLocation(documentId, {
                ...profileData.socialLinks,
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              });

              setEditSocialVisible(false);
              refetch();
            }}
          />
        </ModalWrapper>
      </Modal>
    </View>
  );
};

export default About;

/* ================= HELPER COMPONENTS ================= */

const SocialIcon = ({ name, color, url, onPress }) => {
  const disabled = !url?.trim();

  return (
    <TouchableOpacity
      onPress={() => onPress(url)}
      disabled={disabled}
      className={`w-14 h-14 rounded-full items-center justify-center shadow-lg ${
        disabled ? "bg-gray-700" : "bg-white"
      }`}
      style={!disabled && { borderWidth: 3, borderColor: color }}
    >
      <Ionicons name={name} size={28} color={disabled ? "#666" : color} />
    </TouchableOpacity>
  );
};

const ModalWrapper = ({ children }) => (
  <View className="flex-1 bg-black/70 justify-center px-6">
    <View className="bg-white rounded-3xl p-7 shadow-2xl">{children}</View>
  </View>
);

const ModalActions = ({ onCancel, onSave }) => (
  <View className="flex-row justify-between mt-4">
    <TouchableOpacity
      onPress={onCancel}
      className="flex-1 mr-3 py-4 rounded-xl bg-gray-200"
    >
      <Text className="text-center font-bold text-gray-800">Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onSave}
      className="flex-1 ml-3 py-4 rounded-xl bg-slate-700"
    >
      <Text className="text-center font-bold text-white">Save Changes</Text>
    </TouchableOpacity>
  </View>
);
