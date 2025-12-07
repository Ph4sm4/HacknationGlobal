import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function ErrorHandler() {
  const { code, message } = useLocalSearchParams<{
    code: string;
    message: string;
  }>();

  return (
    <View style={styles.container}>

        <View style={styles.yellowBox}>
            <Text style={styles.title}>Wystąpił błąd</Text>

            <Text style={styles.code}>Kod błędu: {code}</Text>
            <Text style={styles.message}>{message}</Text>


        </View>

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/(tabs)/scanqr")}
        >
            <Text style={styles.buttonText}>Wróć do skanera</Text>
        </TouchableOpacity>

    </View>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
  },

  title: {
    color: "#EF5350",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center"
  },

  code: {
    fontSize: 16,
    color: "#EF5350",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center"
  },

  message: {
    fontSize: 16,
    color: "#EF5350",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  yellowBox: {
    backgroundColor: "#FFEBEE",
    color: "#EF5350",
    borderWidth: 3,
    borderColor: "#EF5350",
    borderRadius: 15,
    width: "80%",
    marginBottom: 50
  }
});
