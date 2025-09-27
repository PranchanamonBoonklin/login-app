import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Text, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../config/supabase";

const ImageUpload = ({
  imageUrl,
  onImageChange,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);

  // ฟังก์ชั่นอัปโหลดรูปภาพ
  const uploadImage = async (imageUri) => {
    try {
      setUploading(true);
      console.log("กำลังอัปโหลดรูปภาพ:", imageUri);

      // สร้างชื่อไฟล์ unique
      const timestamp = Date.now();
      const filename = `product_${timestamp}.jpg`;
      console.log("i Filename:", filename);

      // ดึงข้อมูลไฟล์
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();
      console.log("File info:", {
        size: arrayBuffer.byteLength,
        type: "image/jpeg"
      });

      if (arrayBuffer.byteLength === 0) {
        throw new Error("ไฟล์รูปภาพว่างเปล่า");
      }

      // อัปโหลดไป Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filename, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true
        });
      if (error) throw error;

      console.log("Upload Success:", data);

      // ตรวจสอบไฟล์ใน bucket
      const { data: fileList, error: listError } = await supabase.storage
        .from("product-images")
        .list();
      if (listError) console.error("List Error:", listError);
      else console.log("Files in bucket:", fileList);

      const uploadedFile = fileList.find(file => file.name === filename);
      console.log("Uploaded file found:", uploadedFile);

      // ดึง public URL
      const filePath = data.path || filename;
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      console.log("Public URL:", publicUrl);

      // ทดสอบ URL
      try {
        const testResponse = await fetch(publicUrl, { method: "HEAD" });
        console.log("URL Test Response:", {
          status: testResponse.status,
          statusText: testResponse.statusText,
        });
      } catch (testError) {
        console.error("URL Test Error:", testError);
      }

      onImageChange(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปภาพได้: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // เลือกรูปจาก Gallery / Camera
  const pickImageFromGallery = () => {
    Alert.alert(
      "เลือกรูปภาพ",
      "เลือกแหล่งที่มาของรูปภาพ",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "แกลเลอรี่",
          onPress: async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== "granted") {
                Alert.alert("ข้อผิดพลาด", "ต้องการสิทธิ์เข้าถึงแกลเลอรี่");
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });
              if (!result.canceled && result.assets[0]) {
                uploadImage(result.assets[0].uri);
              }
            } catch (error) {
              console.error("Error picking image:", error);
              Alert.alert("ข้อผิดพลาด", "ไม่สามารถเลือกรูปภาพได้");
            }
          }
        },
        {
          text: "กล้อง",
          onPress: async () => {
            try {
              const cameraAvailable = await ImagePicker.getCameraPermissionsAsync();
              if (!cameraAvailable.granted) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                  Alert.alert(
                    "ต้องการสิทธิ์เข้าถึงกล้อง",
                    "กรุณาอนุญาตให้แอปเข้าถึงกล้องเพื่อถ่ายรูป",
                    [
                      { text: "ยกเลิก", style: "cancel" },
                      { text: "ตั้งค่า", onPress: () => ImagePicker.requestCameraPermissionsAsync() }
                    ]
                  );
                  return;
                }
              }
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                exif: false,
              });
              if (!result.canceled && result.assets && result.assets[0]) {
                uploadImage(result.assets[0].uri);
              }
            } catch (error) {
              console.error("Error taking photo:", error);
              let errorMessage = "ไม่สามารถถ่ายรูปได้";
              if (error.message.includes("Camera not available")) {
                errorMessage = "กล้องไม่พร้อมใช้งาน กรุณาตรวจสอบอุปกรณ์";
              } else if (error.message.includes("Permission")) {
                errorMessage = "ต้องการสิทธิ์เข้าถึงกล้อง";
              }
              Alert.alert("ข้อผิดพลาด", errorMessage);
            }
          }
        }
      ]
    );
  };

  // ลบรูปภาพ
  const removeImage = () => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณต้องการลบรูปภาพนี้หรือไม่",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ลบ", style: "destructive", onPress: () => onImageChange("") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Card style={styles.imageCard}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={removeImage}
              disabled={disabled || uploading}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <Card.Content>
            <Text style={styles.imageText}>เค้กของคุณพร้อมโชว์แล้ว 🎂</Text>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.uploadCard}>
          <Card.Content style={styles.uploadContent}>
            <Text style={styles.uploadText}>
              {uploading ? "กำลังอัปโหลดรูปเค้กน่ารัก..." : "ยังไม่มีรูปเค้ก เลือกเลย 💖"}
            </Text>
            {uploading ? (
              <ActivityIndicator size="large" color="#FF69B4" />
            ) : (
              <Button
                mode="outlined"
                onPress={pickImageFromGallery}
                disabled={disabled}
                style={styles.uploadButton}
              >
                📸 เลือกรูปเค้ก
              </Button>
            )}
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imageCard: {
    marginBottom: 8,
    backgroundColor: "#ffe6f0",
    borderRadius: 12,
    shadowColor: "#ff69b4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,105,180,0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginTop: 8,
  },
  uploadCard: {
    marginBottom: 8,
    backgroundColor: "#fff0f5",
    borderRadius: 12,
  },
  uploadContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  uploadText: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555",
    textAlign: "center",
  },
  uploadButton: {
    borderColor: "#ff69b4",
    color: "#ff1493",
  },
});

export default ImageUpload;
