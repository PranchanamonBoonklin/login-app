import React from "react";
import { TextInput, Button, Card, Text, ActivityIndicator } from "react-native-paper";
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useAuth } from "../AuthContext";
const RegisterScreen = ({ navigation }) => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);
const { signUp } = useAuth();
const handleSignUp = async () => {
if (!email || !password || !confirmPassword) {
 Alert.alert("ข้อผิดพลาด","กรุณากรอกข้อมูลให้ครบถ้วน");
return;
 }
if (password !== confirmPassword) {
 Alert.alert("ข้อผิดพลาด","รหัสผ่านไม่ตรงกัน");
return;
 }
if (password.length < 6) {
 Alert.alert("ข้อผิดพลาด","รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
return;
 }
 setLoading(true);
const { data, error } = await signUp(email, password);
if (error) {
 Alert.alert("ข้อผิดพลาด", error.message);
 } else if (data?.user) {
 Alert.alert(
"สำเร็จ",
"สมัครสมาชิกเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี", 
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
<Text variant="titleLarge" style={styles.title}>สมัครสมาชิก</Text>
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
<TextInput
label="รหัสผ่าน"
mode="outlined"
secureTextEntry
style={styles.input}
value={password}
onChangeText={setPassword}
disabled={loading}
/>
<TextInput
label="ยืนยันรหัสผ่าน"
mode="outlined"
secureTextEntry
style={styles.input}
value={confirmPassword}
onChangeText={setConfirmPassword}
disabled={loading}
/>
<Button
mode="contained"
onPress={handleSignUp}
style={styles.button}
disabled={loading}
>
{loading ? <ActivityIndicator color="white" /> : "สมัครสมาชิก"}
</Button>
<View style={styles.linkContainer}>
<TouchableOpacity
onPress={() => navigation.navigate("Login")}
disabled={loading}
>
<Text style={styles.linkText}>มีบัญชีแล้ว? เข้าสู่ระบบ</Text>
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
 marginBottom: 20,
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
export default RegisterScreen;