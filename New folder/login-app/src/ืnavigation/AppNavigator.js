import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
 
 
import HomeScreen from "../pages/HomeScreen";
import LoginPage from "../pages/LoginPage";
import RegisterScreen from "../pages/RegisterScreen";
import ForgetPasswordScreen from "../pages/ForgetPasswordScreen";
import LoadingScreen from "../components/LoadingScreen";
import ProductsScreen from "../pages/ProductsScreen";
import ProductDetailScreen from "../pages/ProductDetailScreen";

const Stack = createNativeStackNavigator();
 
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f77cb9ff',
        },
        headerTintColor: '#030303ff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{
          title: " เข้าสู่ระบบ ",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "สมัครสมาชิก",
          headerBackTitle: " กลับ "
        }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{
          title: " ลืมรหัสผ่าน ",
          headerBackTitle: " กลับ "
        }}
      />
    </Stack.Navigator>
  );
};
 
const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ee9affff',
        },
        headerTintColor: '#030303ff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: " หน้าหลัก ",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: " หน้าสินค้า ",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
};
 
const AppNavigator = () => {
  const { user, loading } = useAuth();
 
  if (loading) {
    return <LoadingScreen />;
  }
 
  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
 
export default AppNavigator;