import React from "react";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCompanyDetails } from "../services/company";
import { setCompanyCode, setCompanyDetails } from "../store/reducers/company";
import {
  setAuthenticationStatus,
  setBiometricRecord,
  setBiometricStatus,
  setBiometricSupport,
} from "../store/reducers/common";

const AuthLoadingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.common);

  const getStoredCompany = async (companyName) => {
    try {
      const result = await getCompanyDetails(companyName);

      try {
        dispatch(
          setCompanyDetails({
            details: result.data,
            companyName,
          })
        );
        navigation.replace("Subscription");
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      Alert.alert(error.response.data?.errors[0]?.message);
      navigation.replace("Login");
    }
  };

  const getCompanyCode = async () => {
    try {
      const companyName = await AsyncStorage.getItem("companyCode");

      if (companyName) {
        dispatch(setCompanyCode(companyName));
        getStoredCompany(companyName);
      } else {
        dispatch(setCompanyCode(""));
        navigation.replace("Login");
      }
    } catch (e) {
      dispatch(setCompanyCode(""));
      navigation.replace("Login");
      console.log(e);
    }
  };

  const getBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    dispatch(setBiometricSupport(compatible));
    return compatible;
  };

  const getBiometricRecord = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    dispatch(setBiometricRecord(savedBiometrics));
    return savedBiometrics;
  };

  const getBiometricStatus = async () => {
    try {
      const isEnabled = await AsyncStorage.getItem("isBiometricEnabled");

      if (isEnabled && isEnabled === "true") {
        dispatch(setBiometricStatus(true));
        authenticate();
      } else {
        dispatch(setBiometricStatus(false));
        getCompanyCode();
      }
    } catch (e) {
      dispatch(setBiometricStatus(false));
      getCompanyCode();
      console.log(e);
    }
  };

  const authenticate = async () => {
    const hasEnrolled = await getBiometricRecord();

    if (!hasEnrolled) {
      Alert.alert("Please configure any biometric id");
      return;
    }

    if (isAuthenticated) {
      getCompanyCode();
      return;
    }

    const result = await LocalAuthentication.authenticateAsync();

    if (result?.success) {
      dispatch(setAuthenticationStatus(true));
      getCompanyCode();
    } else {
      dispatch(setAuthenticationStatus(false));
      navigation.replace("Verify");
    }
  };

  React.useEffect(() => {
    getBiometricStatus();
    getBiometricSupport();
    getBiometricRecord();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ActivityIndicator size="large" color="#2e6efb" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AuthLoadingScreen;
