import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { supabase } from "../config/supabase"; 
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import ImageUpload from "./ImageUpload";

// import ImageUpload from "./ImageUpload"; // ปิดไว้ก่อนถ้ายังไม่มี

const AddProduct = ({ visible, onClose, onAdded, categories = [] }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });
  const [adding, setAdding] = useState(false);

  // ฟังก์ชันตรวจสอบข้อมูล
  const validateForm = () => {
    if (!newProduct.name.trim()) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อสินค้า");
      return false;
    }
    if (!newProduct.category) {
      Alert.alert("ข้อผิดพลาด", "กรุณาเลือกหมวดหมู่");
      return false;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกราคาที่ถูกต้อง");
      return false;
    }
    return true;
  };

  const handleAddProduct = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const user = await supabase.auth.getUser();
      setAdding(true);
      console.log("🎯 Adding product:", newProduct);

      // หา category_id จาก category name
      const selectedCategory = categories.find(cat => cat.name === newProduct.category);
      const categoryId = selectedCategory ? selectedCategory.id : null;

      if (!categoryId) {
        Alert.alert("ข้อผิดพลาด", "หมวดหมู่ไม่ถูกต้อง");
        return;
      }

      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        category_id: categoryId,
        image_url: imageUrl || null, // ถ้าไม่มีรูปก็ใส่ null
        created_by: (await supabase.auth.getUser()).data.user.id,
      };

      console.log("📦 Product data to insert:", productData);

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) {
        console.error("❌ Supabase error:", error);
        throw error;
      }

      console.log("✅ Product added successfully:", data);

      Alert.alert(
        "สำเร็จ", 
        "เพิ่มสินค้าใหม่เรียบร้อย 🎉",
        [{ text: "OK", onPress: () => {
          handleClose();
          if (onAdded) onAdded();
        }}]
      );

    } catch (error) {
      console.error("❌ Error adding product:", error);
      Alert.alert(
        "ข้อผิดพลาด", 
        `ไม่สามารถเพิ่มสินค้าใหม่ได้\n${error.message || 'Unknown error'}`
      );
    } finally {
      setAdding(false);
    }
  }, [newProduct, imageUrl, categories, onAdded, onClose]);

  const handleClose = () => {
    console.log("🔒 Closing AddProduct modal");
    // รีเซ็ตฟอร์ม
    setNewProduct({ 
      name: "", 
      description: "", 
      category: "", 
      price: "" 
    });
    setImageUrl("");
    setAdding(false);

    if(onClose) onClose();
  };

  const handleCategorySelect = useCallback((categoryName) => {
    console.log("📂 Category selected:", categoryName);
    setNewProduct(prev => ({ ...prev, category: categoryName }));
  }, []);

  const handlePriceChange = useCallback((text) => {
    // อนุญาตเฉพาะตัวเลขและจุดทศนิยม
    const numericText = text.replace(/[^0-9.]/g, '');
    setNewProduct(prev => ({ ...prev, price: numericText }));
  }, []);

  // ฟังก์ชันแปลง uri เป็น blob
  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    console.log(response);
    
    const blob = await response.blob();
    return blob;
  };

// ฟังก์ชันอัปโหลดไป Supabase
  const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบไฟล์รูปภาพที่จะอัปโหลด");
      return null;
    }

    try {
      const fileExt = uri.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, base64, {
          contentType: "image/jpeg",
          upsert: true,
          // ให้ supabase รู้ว่าเป็น base64
          upsert: true,
          // ใช้ `options` encode
        });
      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return publicUrl.publicUrl;
    } catch (err) {
      console.error("❌ Upload failed:", err);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปได้");
      return null;
    }
  };

  // Simple ImageUpload placeholder
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("แจ้งเตือน", "ต้องการสิทธิ์เข้าถึงรูปภาพ");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(uri);
      if (uploadedUrl) setImageUrl(uploadedUrl);
    }
  };

  if (!visible) return null;

  return (
    <Modal 
      visible={visible} 
      animationType="slide"
      transparent={true}
      onRequestClose={() => handleClose()}
      statusBarTranslucent={false}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>➕ เพิ่มสินค้าใหม่</Text>
            <IconButton 
              icon="close" 
              size={25} 
              onPress={() => handleClose()}
              iconColor="#FF69B4"
            />
          </View>

          {/* Form */}
           <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* ชื่อสินค้า */}
            <TextInput
              label="ชื่อสินค้า *"
              value={newProduct.name}
              onChangeText={(text) =>
                setNewProduct(prev => ({ ...prev, name: text }))
              }
              style={styles.input}
              mode="outlined"
              outlineColor="#FFC0CB"
              activeOutlineColor="#FF69B4"
              error={!newProduct.name.trim() && adding}
            />

            {/* คำอธิบาย */}
            <TextInput
              label="คำอธิบาย"
              value={newProduct.description}
              onChangeText={(text) =>
                setNewProduct(prev => ({ ...prev, description: text }))
              }
              style={styles.input}
              multiline
              mode="outlined"
              numberOfLines={3}
              outlineColor="#FFC0CB"
              activeOutlineColor="#FF69B4"
            />

            {/* ราคา */}
            <TextInput
              label="ราคา (บาท) *"
              value={newProduct.price}
              onChangeText={handlePriceChange}
              style={styles.input}
              keyboardType="decimal-pad"
              mode="outlined"
              outlineColor="#FFC0CB"
              activeOutlineColor="#FF69B4"
              // error={(!newProduct.price || parseFloat(newProduct.price) <= 0) && adding}
            />

            {/* อัปโหลดรูปภาพ */}
            <ImageUpload
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
            />

            {/* เลือกหมวดหมู่ */}
            <Text style={styles.label}>หมวดหมู่ *</Text>
            {categories.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollView}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      newProduct.category === cat.name && styles.selectedCategory,
                    ]}
                    onPress={() => handleCategorySelect(cat.name)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        newProduct.category === cat.name && styles.selectedCategoryText
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noCategoriesText}>ไม่มีหมวดหมู่</Text>
            )}

            {/* ปุ่มเพิ่มสินค้า */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleClose}
                style={[styles.button, styles.cancelButton]}
                textColor="#FF69B4"
                disabled={adding}
              >
                ยกเลิก
              </Button>
              
              <Button
                mode="contained"
                buttonColor="#FF69B4"
                onPress={handleAddProduct}
                loading={adding}
                disabled={adding}
                style={[styles.button, styles.addButton]}
                labelStyle={styles.addButtonLabel}
              >
                {adding ? "กำลังเพิ่ม..." : "เพิ่มสินค้า"}
              </Button>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF0F5",
    margin: 20,
    borderRadius: 12,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FFC0CB",
    backgroundColor: "#FFEEF8",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#FF69B4",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  input: { 
    marginVertical: 8, 
    backgroundColor: "#fff",
  },
  label: { 
    marginTop: 16, 
    marginBottom: 8, 
    fontWeight: "bold",
    fontSize: 16,
    color: "#FF69B4",
  },
  imageUploadContainer: {
    marginVertical: 8,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#FFC0CB",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  imageUploadText: {
    color: "#FF69B4",
    fontSize: 16,
    fontWeight: "500",
  },
  categoryScrollView: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FF69B4",
    borderRadius: 20,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedCategory: { 
    backgroundColor: "#FF69B4",
  },
  categoryButtonText: {
    color: "#FF69B4",
    fontWeight: "600",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "#fff",
  },
  noCategoriesText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginBottom: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: "#FF69B4",
  },
  addButton: {
    elevation: 2,
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddProduct;