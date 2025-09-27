import React from "react";
import { TextInput, Button, Card, Text, ActivityIndicator } from "react-native-paper";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";
const LoginForm = () => {
 const navigation = useNavigation();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const { signIn } = useAuth();
 const handleSignIn = async () => {
 if (!email || !password) {
 Alert.alert("ข้อผิดพลาด", "กรุณากรอกอีเมลและรหัสผ่าน");
 return;
 }
 setLoading(true);
 const { data, error } = await signIn(email, password);

 if (error) {
 Alert.alert("ข้อผิดพลาด", error.message);
 } else if (data?.user) {
 Alert.alert("สำเร็จ", "เข้าสู่ระบบเรียบร้อยแล้ว");
 }
 setLoading(false);
 };
 return (
 <View style={styles.container}>
 <Card style={styles.card}>
 <Card.Content>
 <Text variant="titleLarge" style={styles.title}>เข้าสู่ระบบ</Text>

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

 <Button
 mode="contained"
 onPress={handleSignIn}
 style={styles.button}
 disabled={loading}
 >
 {loading ? <ActivityIndicator color="white" /> : "เข้าสู่ระบบ"}
 </Button>
 <View style={styles.linkContainer}>
 <TouchableOpacity
 onPress={() => navigation?.navigate("Register")}
 disabled={loading}
 >
 <Text style={styles.linkText}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
 </TouchableOpacity>
 </View>
 <View style={styles.linkContainer}>
 <TouchableOpacity
 onPress={() => navigation?.navigate("ForgetPassword")}
 disabled={loading}
 >
 <Text style={styles.linkText}>ลืมรหัสผ่าน?</Text>
 </TouchableOpacity>
 </View>
 </Card.Content>
 </Card>
 </View>
 );
};
const styles = StyleSheet.create({
 container: {
 flex: 1,
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
export default LoginForm;