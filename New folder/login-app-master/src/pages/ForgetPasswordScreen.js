import React from "react";
import { TextInput, Button, Card, Text, ActivityIndicator } from "react-native-paper";
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useAuth } from "../AuthContext";
const ForgetPasswordScreen = ({ navigation }) => {
 const [email, setEmail] = useState("");
 const [loading, setLoading] = useState(false);
 const { resetPassword } = useAuth();
 const handleResetPassword = async () => {
 if (!email) {
 Alert.alert("ข้อผิดพลาด", "กรุณากรอกอีเมล");
 return;
 }
 setLoading(true);
 const { data, error } = await resetPassword(email);

 if (error) {
 Alert.alert("ข้อผิดพลาด", error.message);
 } else {
 Alert.alert(
 "สำเร็จ",
 "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล",
 [
 {
 text: "ตกลง",
 onPress: () => navigation.navigate("Login")
 }
 ]
 );
 }
 setLoading(false);
 };
 return (
 <ScrollView contentContainerStyle={styles.container}>
 <Card style={styles.card}>
 <Card.Content>
 <Text variant="titleLarge" style={styles.title}>ลืมรหัสผ่าน</Text>
 <Text style={styles.description}>
กรุณากรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ
 </Text>

 <TextInput
 label="อีเมล"
 mode="outlined"
 keyboardType="email-address"
 autoCapitalize="none"
 autoComplete="email"
 style={styles.input}
 value={email}
 onChangeText={setEmail}
 disabled={loading}
 />

 <Button
 mode="contained"
 onPress={handleResetPassword}
 style={styles.button}
 disabled={loading}
 >
 {loading ? <ActivityIndicator color="white" /> : "ส่งลิงก์รีเซ็ต"}
 </Button>
 <View style={styles.linkContainer}>
 <TouchableOpacity
 onPress={() => navigation.navigate("Login")}
 disabled={loading}
 >
 <Text style={styles.linkText}>กลับไปเข้าสู่ระบบ</Text>
 </TouchableOpacity>
 </View>
 </Card.Content>
 </Card>
 </ScrollView>
 );
};
const styles = StyleSheet.create({
 container: {
 flexGrow: 1,
 alignItems: "center",
 justifyContent: "center",
 padding: 20,
 },
 card: {
 width: "100%",
 maxWidth: 400,
 },
 title: {
 textAlign: "center",
 marginBottom: 10,
 },
 description: {
 textAlign: "center",
 marginBottom: 20,
 color: "#666",
 },
 input: {
 marginBottom: 16,
 },
 button: {
 marginTop: 10,
 marginBottom: 20,
 },
 linkContainer: {
 alignItems: "center",
 marginBottom: 10,
 },
 linkText: {
 color: "#6200ea",
 textDecorationLine: "underline",
 },
});
export default ForgetPasswordScreen;