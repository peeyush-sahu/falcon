import React from "react";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { getCompanyDetails } from "../services/company";
import { setCompanyDetails } from "../store/reducers/company";

const { height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");

  const handleNext = async () => {
    if (!companyName.trim()) {
      Alert.alert("Company name cannot be blank!");
      setCompanyName("");
      return;
    }

    setLoading(true);

    try {
      const result = await getCompanyDetails(companyName);

      try {
        await AsyncStorage.setItem("companyCode", companyName);
        dispatch(setCompanyDetails({ details: result.data, companyName }));
        setCompanyName("");
        setLoading(false);
        navigation.replace("Subscription");
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      Alert.alert(error.response.data?.errors[0]?.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />
      <LinearGradient colors={["#2e6efb", "#2e6efb"]} style={styles.header} />
      <SvgXml
        style={styles.wave}
        xml={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 300">
          <path fill="#2e6efb" fill-opacity="1" d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,208C672,213,768,171,864,170.7C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>`}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Hello there! Sign up to your account.</Text>
        <Text style={styles.subTitle}>Company Code</Text>
        <TextInput
          style={styles.textbox}
          placeholder="Please enter the company code"
          placeholderTextColor="#999999"
          value={companyName}
          onChangeText={(text) => setCompanyName(text)}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleNext}
          returnKeyType="done"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.paragraph}>Need help ?</Text>
        <TouchableOpacity style={styles.ghostButton}>
          <Text style={styles.primaryText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={loading ? () => null : handleNext}
        >
          <LinearGradient
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#5692fb", "#2e6efb"]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <SafeAreaView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: height * 0.25,
  },

  wave: {
    height: 90,
    marginTop: -30,
  },

  content: {
    marginTop: 10,
    paddingHorizontal: 20,
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 32,
  },

  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 26,
  },

  textbox: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 6,
    borderColor: "#f5f5f5",
    backgroundColor: "#f6f6f6",
    marginVertical: 24,
  },

  footer: {
    paddingHorizontal: 20,
    alignItems: "center",
  },

  ghostButton: {
    width: "100%",
    height: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fbff",
    marginVertical: 8,
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
  },

  paragraph: {
    fontSize: 16,
  },

  primaryText: {
    color: "#2e6efb",
    fontSize: 18,
    fontWeight: 600,
  },
});

export default LoginScreen;
