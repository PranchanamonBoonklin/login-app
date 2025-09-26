import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Card, ActivityIndicator } from "react-native-paper";
 
const DataScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://www.apicountries.com/countries");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating size="large" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }
 
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ padding: 16 }}>
        <Text
          variant="headlineMedium"
          style={{ textAlign: "center", marginBottom: 20, color: "#1976d2" }}
        >
          ข้อมูลประเทศ
        </Text>
 
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Home")}
          style={{ marginBottom: 20 }}
        >
          กลับหน้าหลัก
        </Button>
 
        {data && data.length > 0 ? (
          data.map((country, index) => (
            <Card key={index} style={{ marginBottom: 12, elevation: 2 }}>
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={{ color: "#1976d2", marginBottom: 8 }}
                >
                  {country.name}
                </Text>
 
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>เมืองหลวง: </Text>
                  {country.capital || "ไม่ระบุ"}
                </Text>
 
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>ประชากร: </Text>
                  {country.population
                    ? country.population.toLocaleString()
                    : "ไม่ระบุ"}
                </Text>
 
                <Text style={{ marginBottom: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>ภูมิภาค: </Text>
                  {country.region || "ไม่ระบุ"}
                </Text>
 
                {country.flag && (
                  <Text style={{ fontWeight: "bold" }}>ธง: {country.flag}</Text>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={{ padding: 20, alignItems: "center" }}>
            <Card.Content>
              <Text variant="bodyLarge">ไม่พบข้อมูล</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};
 
export default DataScreen;
 
 