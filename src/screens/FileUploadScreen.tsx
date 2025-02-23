import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function FileUploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 접근 권한이 필요합니다.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadFile = async () => {
    if (!imageUri) return;
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);
    try {
      const response = await axios.post(
        "http://<SERVER_IP>:4000/files/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadedUrl(response.data.url);
      Alert.alert("업로드 성공", "파일이 업로드되었습니다.");
    } catch (error) {
      Alert.alert("업로드 실패", "파일 업로드에 실패했습니다.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <TouchableOpacity
        className="bg-gray-500 p-3 rounded mb-4"
        onPress={pickImage}
      >
        <Text className="text-white">이미지 선택</Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded mt-4"
        onPress={uploadFile}
      >
        <Text className="text-white">파일 업로드</Text>
      </TouchableOpacity>
      {uploadedUrl && (
        <Text className="mt-4 text-blue-500 underline">{uploadedUrl}</Text>
      )}
    </View>
  );
}
