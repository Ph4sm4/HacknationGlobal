import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { ValidationResponse } from "@/types/ValidationResponse";
import { QrData } from "@/types/QrData";
import { DomainValidationResponseDto, ReturnCertInfoDto, CertificateInfo, testResponse } from "@/types/DomainValidation";


export default function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const scanLock = useRef(false);


  const [isScreenFocused, setIsScreenFocused] = useState(false);

  const getErrorMessage = (code: number) => {
  switch (code) {
    case 400:
      return "Środowisko localhost nie jest obsługiwane";
    case 404:
      return "Kod QR nie istnieje lub wygasł";
    case 409:
      return "Kod QR został już użyty";
    case 410:
      return "Kod QR wygasł";
    default:
      return "Nieznany błąd serwera";
  }
};


useFocusEffect(
  React.useCallback(() => {
    setIsScreenFocused(true);
    setIsScanning(true);
    scanLock.current = false;   // 🔓 reset blokady

    return () => {
      setIsScreenFocused(false);
      setIsScanning(false);
      setScannedData(null);
      scanLock.current = false; // 🔓 reset na wyjściu
    };
  }, [])
);



  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

 const handleBarcodeScanned = async (result: { data: string }) => {
  if (scanLock.current) return; 
  scanLock.current = true;         

  setLoading(true);
  setIsScanning(false);

  const qr = result.data;
  setScannedData(qr);
  console.log("QR:", qr);
  let qrData: QrData;

    try {
    // Example QR format: "abcd1234;https://example.com;1717439200"
    const parts = qr.split(";");

    if (parts.length !== 3) {
        throw new Error("Invalid QR format");
    }

    qrData = {
        id: parts[0],
        domain: parts[1],
        webclientSocketId: parts[2],
        // timestamp: parts[2],
    };

    console.log("Decoded QR Data:", qrData);

    // Optionally store it:
    // setScannedData(JSON.stringify(qrData));

    } catch (error) {
    // console.error("QR decoding failed:", error);
    //   scanLock.current = false; // allow scanning again
    //   setIsScanning(true);
    //   setLoading(false);
    //   return;

      router.push({
          pathname: "/errorHandler",
          params: {
          code: "",
          message: "Zly Kod QR"
          },
      });

        return;

    }


  try {

    console.log( JSON.stringify(qrData))

    const response = await fetch("http://10.42.0.1:3000/api/domains/validate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(qrData),
    });
    //TODO: delete ValidationResponse, change to constant
    
    let json = await response.json();
    let data: DomainValidationResponseDto = json.data;
    
    console.log(response)
    console.log(data)


    const testingOn = false
    if (!response.ok && !testingOn) {
        const message = getErrorMessage(response.status);

        router.push({
            pathname: "/errorHandler",
            params: {
            code: response.status.toString(),
            message,
            },
        });

        return;
    }
    // console.log(response)

    //TODO: replace with actual response
    // data = {
    //     isOK: "true", // or "false" or any string you decide
    // } as ValidationResponse;

    

    router.push({
      pathname: "/details",
      //TODO: change from test response to result data
      // params: { data: JSON.stringify(testResponse) }
      params: { data: JSON.stringify(data) }
    });

  } catch (error) {
      //TODO: delete this later the push
    // const data: ValidationResponse = {
    //     isOK: "true", // or "false" or any string you decide
    // } as ValidationResponse;

    // router.push({
    //   pathname: "/details",
    //   params: { data: JSON.stringify(data) }
    // });

    console.error("API request failed:", error);


  } finally {
    setLoading(false);
  }
};


  if (!permission) return <Text>Checking permissions...</Text>;
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text>No camera permission</Text>
      </View>
    );

  return (
    <View style={styles.container}>

        <Text style={styles.mainTitle}> Zeskanuj kod QR</Text>
      <Text style={styles.titleText}>Umieść kod QR w ramce, aby go zeskanować</Text>

      <View style={styles.cameraBox}>
       {isScreenFocused && (
  <CameraView
    style={styles.camera}
    facing="back"
    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
    onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
  />
)}

        <View style={styles.scanFrame} />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Wpisz kod</Text>
      </TouchableOpacity>

      {scannedData && (
        <View style={styles.overlay}>
          <Text style={styles.scannedText}>Scanned: {scannedData}</Text>
        </View>
      )}

      {/* 🔵 LOADING OVERLAY */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1e90ff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Ładowanie...</Text>
        </View>
      )}
    </View>
  );
}

const BOX_HEIGHT = "65%";
const BOX_WIDTH = "90%";
const FRAME_SIZE = 150;
const CORNER_SIZE = 80;
const CORNER_THICKNESS = 5;

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    // paddingBotton: 1,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
   
  },

  mainTitle: {
        color: "#000",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 500,
    paddingBottom: 20
  },

  titleText: {
    color: "#000",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
    paddingBottom: 10
  },

  cameraBox: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  camera: {
    width: "100%",
    height: "100%",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    
    marginBottom: 0,
    borderRadius: 10,
    width: "80%",
    borderWidth: 2,
    borderColor: "#1e90ff",
  },

  buttonText: {
    color: "#1e90ff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },

  scannedText: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
  },

  scanFrame: {
    position: "absolute",
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
  },

  /* 🔵 LOADING OVERLAY STYLE */
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
});
