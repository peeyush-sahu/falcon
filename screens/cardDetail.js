import { StyleSheet, Text, View } from "react-native";

const CardDetailScreen = ({ route }) => {
  const { number, expiry } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.expiry}>Valid Thru {expiry}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#2e6efb",
    borderRadius: 20,
    padding: 20,
    height: 200,
  },

  number: {
    fontSize: 30,
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: 20,
  },

  expiry: {
    fontSize: 18,
    fontWeight: 500,
    color: "#ffffff",
  },
});

export default CardDetailScreen;
