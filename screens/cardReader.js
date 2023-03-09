import React from "react";
import { GCP_VISION_API_KEY } from "@env";
import { Camera, CameraType, ImageType } from "expo-camera";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as detectCard from "../helpers/detect-card";

const CardReaderScreen = ({ navigation }) => {
  const camera = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  React.useEffect(() => {
    if (permission?.granted === false) {
      requestPermission();
    }
  }, [permission]);

  const handleClosePress = () => {
    navigation.goBack();
  };

  const handleScan = async () => {
    const image = await camera.current.takePictureAsync({
      base64: true,
      ImageType: ImageType.png,
    });

    setLoading(true);

    await detectCard.setAPISecret(GCP_VISION_API_KEY);

    try {
      const response = await detectCard.getCardDetails(image.base64);
      setLoading(false);
      navigation.navigate("CardDetail", {
        number: response?.cardNumber,
        expiry: response?.expiryDate,
      });
    } catch (error) {
      setLoading(false);
      Alert.alert("Seems to be some issue with card or image");
    }
  };

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={styles.container} type={CameraType.back}>
        <View style={[styles.opaqueView]}>
          <Text style={styles.title}>Scan Card</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.opaqueView} />
          <View style={styles.centerView} />
          <View style={styles.opaqueView} />
        </View>
        <View style={styles.opaqueView}>
          <TouchableOpacity style={styles.button} onPress={handleScan}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleClosePress}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },

  opaqueView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
    height: undefined,
    aspectRatio: 16 / 9,
  },

  centerView: {
    width: "95%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#ffffff",
  },

  button: {
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#333333",
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
  },
});

export default CardReaderScreen;
