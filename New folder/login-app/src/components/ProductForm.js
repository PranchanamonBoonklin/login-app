// 📂 src/components/ProductForm.js
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { supabase } from "../config/supabase";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
  const [flavor, setFlavor] = useState(product?.flavor || ""); // รสชาติ
  const [size, setSize] = useState(product?.size || ""); // ขนาด
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อและราคา");
      return;
    }
    setLoading(true);

    try {
      let newProduct;
      if (product) {
        // อัปเดตสินค้า
        const { data, error } = await supabase
          .from("products")
          .update({
            name,
            price: parseFloat(price),
            description,
            flavor,
            size,
            image_url: imageUrl,
            updated_at: new Date(),
          })
          .eq("id", product.id)
          .select()
          .single();
        if (error) throw error;
        newProduct = data;
      } else {
        // เพิ่มสินค้าใหม่
        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              name,
              price: parseFloat(price),
              description,
              flavor,
              size,
              image_url: imageUrl,
            },
          ])
          .select()
          .single();
        if (error) throw error;
        newProduct = data;
      }
      Alert.alert("สำเร็จ", "บันทึกสินค้าเรียบร้อยแล้ว");
      onSave(newProduct);
    } catch (error) {
      console.error(error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกสินค้าได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            {product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </Text>

          <TextInput
            label="ชื่อเค้ก"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="ราคา (บาท)"
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <TextInput
            label="รายละเอียด"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <TextInput
            label="รสชาติ (เช่น สตรอว์เบอร์รี่, ช็อกโกแลต)"
            value={flavor}
            onChangeText={setFlavor}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="ขนาด (Mini, M, L)"
            value={size}
            onChangeText={setSize}
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              buttonColor="#FF69B4"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.button}
              textColor="#FF69B4"
            >
              ยกเลิก
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  card: { borderRadius: 16, backgroundColor: "#fff" },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  input: { marginBottom: 16 },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: { flex: 1, marginHorizontal: 4 },
});

export default ProductForm;
