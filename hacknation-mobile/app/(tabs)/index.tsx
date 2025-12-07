import { StyleSheet, View, Text, Image } from "react-native";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image 
          source={require("../../assets/images/ikonamobywatel.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Dokumenty</Text>
      </View>

      <View style={styles.documentsContainer}>
        <View style={styles.configView}>
          <Text style={styles.configText}>Dostosuj</Text>
          <Text style={styles.configText} > Dodaj</Text>
        </View>
        <Image 
          source={require("../../assets/images/kartymobywatel.jpg")}
          style={styles.documents}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",  // ensure vertical stacking
    backgroundColor: "rgb(245, 246, 252)", // rgb(245, 246, 252)"
                                            //
    paddingTop: 50,
  },

  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
  },


  logo: {
    width: 40,
    height: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    paddingLeft: "1%"
  },

  configView : {
    display: "flex",
    flexDirection: "row",
    // alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
    gap: 10,
    paddingRight: 30,
    fontFamily: "Inter-Medium",
    // fontWeight: "100"
  },

  configText: {
    color: "blue"
  },
documentsContainer: {
  alignItems: "center",
  justifyContent: "flex-start",
  flexShrink: 0,   // ⬅️ prevents shrinking upward
  width: "100%",
  height: "100%"
},

documents: {
  width: "100%",
  maxHeight: 500,  // ⬅️ prevents vertical expansion from pushing layout
  resizeMode: "contain",
}

});
