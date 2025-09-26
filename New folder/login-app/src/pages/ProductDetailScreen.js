import React, { useState, useEffect } from "react";
import {
        View,
        StyleSheet,
        ScrollView,
        Image,
        Alert,
        Linking,
} from "react-native";
import {
        Card,
        Text,
        Button,
        Chip,
        IconButton,
        ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../AuthContext";
const ProductDetailScreen = ({ navigation, route }) => {
        const { product: initialProduct } = route.params;
        const { user } = useAuth();
        const [product, setProduct] = useState(initialProduct);
        const [loading, setLoading] = useState(false);
        const isOwner = user?.id === product?.created_by;
        useEffect(() => {
                if (initialProduct) {
                        setProduct(initialProduct);
                }
        }, [initialProduct]);
        const formatPrice = (price) => {
                return new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                }).format(price);
        };
        const formatDate = (dateString) => {
                return new Date(dateString).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                });
        };
        const handleEdit = () => {
                navigation.navigate("ProductForm", { product });
        };
        const handleDelete = () => {
                Alert.alert(
                        "ยืนยันการลบ",
                        `คุณต้องการลบสินค้า "${product.name}" หรือไม่ ?`,
                        [
                                { text: "ยกเลิก", style: "cancel" },
                                {
                                        text: "ลบ",
                                        style: "destructive",
                                        onPress: async () => {
                                                setLoading(true);
                                                try {
                                                        // TODO: Implement delete functionality
                                                        // const { error } = await supabase
                                                        // .from("products")
                                                        // .delete()
                                                        // .eq("id", product.id);
                                                        //
                                                        // if (error) throw error;
                                                        Alert.alert("สำเร็จ", "ลบสินค้าเรียบร้อยแล้ว", [
                                                                { text: "ตกลง", onPress: () => navigation.goBack() }
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
        };
        const handleCall = () => {
                // TODO: Implement call functionality
                Alert.alert("แจ้งเตือน", "เจอร์นี้จะใช้งานได้เมื่อเพิ่มข้อมูลติดต่อ");
        };
        const handleMessage = () => {
                // TODO: Implement message functionality
                Alert.alert("แจ้งเตือน", "ฟีเจอร์นี้จะใช้งานได้เมื่อเพิ่มระบบแชท");
        };
        const handleShare = () => {
                // TODO: Implement share functionality
                Alert.alert("แจ้งเตือน", "ฟีเจอร์นี้จะใช้งานได้เมื่อเพิ่มระบบแชร์ ");
        };
        // const handleLocationPress = () => { // เอาไว้สำหรับคราวหน้า
        // if (product.location_lat && product.location_lng) {
        // const url = https://www.google.com/maps?q=${product.location_lat},${product.location_lng};
        // Linking.openURL(url).catch(() => {
        // Alert.alert("ข้อผิดพลาด", "ไม่สามารถเปิดแผนที่ได้");
        // });
        // }
        // };
        if (!product) {
                return (
                        <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#FF6B35" />
                                <Text style={styles.loadingText}>กำลังโหลด...</Text>
                        </View>
                );
        }
        return (
                <View style={styles.container}>
                        <ScrollView style={styles.scrollView}>
                                {/* รูปภาพสินค้า */}
                                {product.image_url && (
                                        <View style={styles.imageContainer}>
                                                <Image source={{ uri: product.image_url }} style={styles.image} />
                                                {product.category && (
                                                        <Chip style={styles.categoryChip} textStyle={styles.categoryText}>
                                                                {product.category.name}
                                                        </Chip>
                                                )}
                                        </View>
                                )}
                                <View style={styles.content}>
                                        {/* ชื่อสินค้า */}
                                        <Text variant="headlineSmall" style={styles.title}>
                                                {product.name}
                                        </Text>
                                        {/*ราคา */}
                                        <Text variant="headlineMedium" style={styles.price}>
                                                {formatPrice(product.price)}
                                        </Text>
                                        {/* คำอธิบาย */}
                                        {product.description && (
                                                <Card style={styles.descriptionCard}>
                                                        <Card.Content>
                                                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                                                        คำอธิบาย
                                                                </Text>
                                                                <Text variant="bodyLarge" style={styles.description}>
                                                                        {product.description}
                                                                </Text>
                                                        </Card.Content>
                                                </Card>
                                        )}
                                        {/* ตำแหน่งที่ตั้ง - เอาไว้สำหรับคราวหน้า */}
                                        {/* {product.location_address && (
 <Card style={styles.locationCard}>
 <Card.Content>
 <Text variant="titleMedium" style={styles.sectionTitle}>
ตำแหน่งที่ตั้ง
 </Text>
 <View style={styles.locationContainer}>
 <IconButton
 icon="map-marker"
 size={20}
 iconColor="#FF6B35"
 />
 <View style={styles.locationTextContainer}>
 <Text variant="bodyLarge" style={styles.locationAddress}>
 {product.location_address}
 </Text>
 {product.location_lat && product.location_lng && (
 <Text variant="bodySmall" style={styles.locationCoords}>
 />ละติจูด: {product.location_lat.toFixed(6)},
 //ลองติจูด: {product.location_lng.toFixed(6)}
 </Text>
 )}
 </View>
 <IconButton
 icon="open-in-new"
 size={20}
 iconColor="#FF6B35"
 onPress={handleLocationPress}
 />
 </View>
 </Card.Content>
 </Card>
 )} */}
                                        {/*ข้อมูลเพิ่มเติม*/}
                                        <Card style={styles.infoCard}>
                                                <Card.Content>
                                                        <Text variant="titleMedium" style={styles.sectionTitle}>
                                                                ข้อมูลเพิ่มเติม
                                                        </Text>
                                                        <View style={styles.infoRow}>
                                                                <Text variant="bodyMedium" style={styles.infoLabel}>
                                                                        สร้างเมื่อ
                                                                </Text>
                                                                <Text variant="bodyMedium" style={styles.infoValue}>
                                                                        {formatDate(product.created_at)}
                                                                </Text>
                                                        </View>
                                                        {product.updated_at !== product.created_at && (
                                                                <View style={styles.infoRow}>
                                                                        <Text variant="bodyMedium" style={styles.infoLabel}>
                                                                                แก้ไขล่าสุด
                                                                        </Text>
                                                                        <Text variant="bodyMedium" style={styles.infoValue}>
                                                                                {formatDate(product.updated_at)}
                                                                        </Text>
                                                                </View>
                                                        )}
                                                </Card.Content>
                                        </Card>
                                        {/* ปุ่มติดต่อ (สำหรับผู้ที่ไม่ใช่เจ้าของ) */}
                                        {!isOwner && (
                                                <View style={styles.contactButtons}>
                                                        <Button
                                                                mode="contained"
                                                                onPress={handleCall}
                                                                style={styles.contactButton}
                                                                buttonColor="white"
                                                                textColor="black"
                                                                icon="phone"
                                                        >
                                                                โทร
                                                        </Button>
                                                        <Button
                                                                mode="outlined"
                                                                onPress={handleMessage}
                                                                style={styles.contactButton}
                                                                buttonColor="white"
                                                                textColor="black"
                                                                icon="message"
                                                        >
                                                                ส่งข้อความ
                                                        </Button>
                                                </View>
                                        )}
                                        {/* ปุ่มจัดการ (สำหรับเจ้าของ) */}
                                        {isOwner && (
                                                <View style={styles.ownerButtons}>
                                                        <Button
                                                                mode="contained"
                                                                onPress={handleEdit}
                                                                style={styles.ownerButton}
                                                                buttonColor="white"
                                                                textColor="black"
                                                                icon="pencil"
                                                        >
                                                                แก้ไขสินค้า
                                                        </Button>
                                                        <Button
                                                                mode="outlined"
                                                                onPress={handleDelete}
                                                                style={styles.ownerButton}
                                                                buttonColor="white"
                                                                textColor="black"
                                                                icon="delete"
                                                                disabled={loading}
                                                        >
                                                                {loading ? "กำลังลบ" : "ลบสินค้า"}
                                                        </Button>
                                                </View>
                                        )}
                                </View>
                        </ScrollView>
                </View>
        );
};
const styles = StyleSheet.create({
        container: {
                flex: 1,
        },
        loadingContainer: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
        },
        loadingText: {
                marginTop: 16,
                color: "#666",
        },
        scrollView: {
                flex: 1,
        },
        imageContainer: {
                position: "relative",
        },
        image: {
                width: "100%",
                height: 300,
                resizeMode: "cover",
        },
        categoryChip: {
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: "rgba(98, 0, 234, 0.9)",
        },
        categoryText: {
                color: "white",
                fontSize: 14,
        },
        content: {
                padding: 16,
        },
        title: {
                fontWeight: "bold",
                marginBottom: 8,
                color: "#333",
        },
        price: {
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 16,
        },
        sectionTitle: {
                fontWeight: "bold",
                marginBottom: 12,
                color: "#333",
        },
        descriptionCard: {
                marginBottom: 16,
        },
        description: {
                lineHeight: 24,
                color: "#555",
        },
        locationCard: {
                marginBottom: 16,
        },
        locationContainer: {
                flexDirection: "row",
                alignItems: "flex-start",
        },
        locationTextContainer: {
                flex: 1,
                marginLeft: 8,
        },
        locationAddress: {
                color: "#333",
                marginBottom: 4,
        },
        locationCoords: {
                color: "#666",
                fontStyle: "italic",
        },
        infoCard: {
                marginBottom: 16,
        },
        infoRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
        },
        infoLabel: {
                color: "#666",
        },
        infoValue: {
                color: "#333",
                fontWeight: "500",
        },
        contactButtons: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
        },
        contactButton: {
                flex: 1,
                marginHorizontal: 4,
        },
        ownerButtons: {
                marginTop: 16,
        },
        ownerButton: {
                marginBottom: 12,
        },
});
export default ProductDetailScreen;