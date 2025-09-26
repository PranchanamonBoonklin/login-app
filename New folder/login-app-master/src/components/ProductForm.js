import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import {
    TextInput,
    Button,
    Card,
    Text,
    ActivityIndicator,
    Chip,
    Divider,
} from "react-native-paper";
import { supabase } from "../config/supabase";
// import ImageUpload from "./ImageUpload";
// import LocationPicker from "./LocationPicker"; // เอาไว้สำหรับคราวหน้า

export const ProductForm = ({
    product = null, // null สำหรับสร้างใหม่, object สำหรับแก้ไข
    onSave,
    onCancel,
    navigation
    // selectedLocation, // เอาไว้สำหรับคราวหน้า
    // fromMapPicker // เอาไว้สำหรับคราวหน้า
}) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    // const [location, setLocation] = useState({ // เอาไว้สำหรับคราวหน้า
    // lat: null,
    // lng: null,
    // address: ""
    // });
    // Load categories O/> product data
    useEffect(() => {
        loadCategories();
        if (product) {
            loadProductData();
        }
    }, [product]);

    // รับข้อมูลจาก MapPicker - เอาไว้สำหรับคราวหน้า
    // useEffect(() => {
    // if (fromMapPicker && selectedLocation) {
    // setLocation(selectedLocation);
    // }
    // }, [fromMapPicker, selectedLocation]);

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name");
            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Error loading categories:", error);
            Alert.alert("ไม่สามารถโหลดหมวดหมู่ได้");
        }
    };

    const loadProductData = () => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setPrice(product.price?.toString() || "");
            setImageUrl(product.image_url || "");
            // setLocation({ // เอาไว้สำหรับคราวหน้า
            // lat: product.location_lat,
            // lng: product.location_lng,
            // address: product.location_address || ""
            // });
            setSelectedCategory(product.category_id);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกชื่อสินค้า");
            return;
        }
        if (!price.trim() || isNaN(parseFloat(price))) {
            Alert.alert("ข้อผิดพลาด", "กรุณากรอกราคาที่ถูกต้อง");
            return;
        }
        if (!selectedCategory) {
            Alert.alert("ข้อผิดพลาด", "กรุณาเลือกหมวดหมู่");
            return;
        }
        setLoading(true);
        try {
            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                category_id: selectedCategory,
                // location_lat: location.lat, // เอาไว้สำหรับคราวหน้า
                // location_lng: location.lng, // เอาไว้สำหรับคราวหน้า
                // location_address: location.address, // เอาไว้สำหรับคราวหน้า
                image_url: imageUrl,
                updated_at: new Date().toISOString()
            };
            // ตรวจสอบ RLS policies ก่อนบันทึก
            const user = await supabase.auth.getUser();
            const userId = user.data.user?.id;
            console.log("´ Current user ID:", userId);
            if (!userId) {
                throw new Error("ไม่พบข้อมูลผู้ใช้ - กรุณาเข้าสู่ระบบใหม่");
            }
            let result;
            if (product) {
                // Update existing product
                console.log("« Updating product:", product.id, productData);
                const { data, error } = await supabase
                    .from("products")
                    .update(productData)
                    .eq("id", product.id)
                    .select();
                if (error) {
                    console.error("o Update Error:", error);
                    throw error;
                }
                if (!data || data.length === 0) {
                    console.error("o No rows updated - product not found or no permission");
                    throw new Error("ไม่สามารถสร้างสินค้าได้ - ตรวจสอบสิทธิ์การเข้าถึง");
                }
                result = data[0];
            } else {
                // Create new product
                console.log("« Creating product:", { ...productData, created_by: userId });
                const { data, error } = await supabase
                    .from("products")
                    .insert([{
                        ...productData,
                        created_by: userId
                    }])
                    .select();
                if (error) {
                    console.error("o Insert Error:", error);
                    throw error;
                }
                if (!data || data.length === 0) {
                    console.error("o No rows inserted - check RLS policies");
                    throw new Error("ไม่สามารถสร้างสินค้าได้ - ตรวจสอบสิทธิ์การเข้าถึง");
                }
                result = data[0];
            }
            console.log("' Product saved successfully:", result);
            Alert.alert(
                "สำเร็จ",
                product ? "แก้ไขสินค้าเรียบร้อยแล้ว" : "สร้างสินค้าเรียบร้อยแล้ว",
                [{ text: "ตกลง", onPress: () => onSave && onSave(result) }]
            );
        } catch (error) {
            console.error("Error saving product:", error);
            Alert.alert("ข้อผิดพลาด", error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!product) return;
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบสินค้าหรือไม่",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const { error } = await supabase
                                .from("products")
                                .delete()
                                .eq("id", product.id);
                            if (error) throw error;
                            Alert.alert("สำเร็จ", "ลบสินค้าเรียบร้อยแล้ว", [
                                { text: "ตกลง", onPress: () => onSave && onSave(null) }
                            ]);
                        } catch (error) {
                            console.error("Error deleting product:", error);
                            Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบสินค้าได้");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    }
    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.title}>
                        {product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                    </Text>
                    {/* ชื่อสินค้า */}
                    <TextInput
                        label="ชื่อสินค้า"
                        mode="outlined"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        disabled={loading}
                    />
                    {/* คำอธิบาย*/}
                    <TextInput
                        label="คำอธิบาย"
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        disabled={loading}
                    />
                    {/* ราคา (บาท) */}
                    <TextInput
                        label="ราคา (บาท)"
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                        value={price}
                        onChangeText={setPrice}
                        disabled={loading}
                    />
                    {/* หมวดหมู่ */}
                    <Text style={styles.sectionTitle}>หมวดหมู่ *</Text>
                    <View style={styles.chipContainer}>
                        {categories.map((category) => (
                            <Chip
                                key={category.id}
                                selected={selectedCategory === category.id}
                                onPress={() => setSelectedCategory(category.id)}
                                style={styles.chip}
                                disabled={loading}
                            >
                                {category.name}
                            </Chip>
                        ))}
                    </View>
                    <Divider style={styles.divider} />
                    {/*รูปภาพ*/}
                    <Text style={styles.sectionTitle}>รูปภาพ</Text>
                    <ImageUpload
                        imageUrl={imageUrl}
                        onImageChange={setImageUrl}
                        disabled={loading}
                    />
                    <Divider style={styles.divider} />
                    {/* Location - เอาไว้สำหรับคราวหน้า */}
                    {/* <Text style={styles.sectionTitle}>ตำแหน่งที่ตั้ง </Text>
 <LocationPicker
 location={location}
 onLocationChange={setLocation}
 disabled={loading}
 navigation={navigation}
 /> */}
                    {/* ปุ่มต่างๆ*/}
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.saveButton}
                            buttonColor="white"
                            textColor="black"
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                product ? "บันทึกการแก้ไข" : "สร้างสินค้า"
                            )}
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={onCancel}
                            style={styles.cancelButton}
                            buttonColor="white"
                            textColor="black"
                            disabled={loading}
                        >
ยกเลิก                        </Button>
                        {product && (
                            <Button
                                mode="outlined"
                                onPress={handleDelete}
                                style={styles.deleteButton}
                                disabled={loading}
                                buttonColor="#ffebee"
                                textColor="#FF4444"
                            >
 ลบสินค้า
                            </Button>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        color: "#FF6B35",
    },
    input: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    buttonContainer: {
        marginTop: 20,
    },
    saveButton: {
        marginBottom: 12,
    },
    cancelButton: {
        marginBottom: 12,
    },
    deleteButton: {
        marginBottom: 12,
    },
});

