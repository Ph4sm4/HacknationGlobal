import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from "react-native";
import { useState } from "react";
import { DomainValidationResponseDto } from "@/types/DomainValidation";

export default function DetailsScreen() {
  const { data } = useLocalSearchParams();
  const [showMore, setShowMore] = useState(false);
  const [expandedCerts, setExpandedCerts] = useState<Record<number, boolean>>({});

  let parsedData: DomainValidationResponseDto | null = null;

  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.warn("Could not parse param 'data':", e);
    }
  }

  console.log(parsedData?.aiAnalysis)
  const isSafe = parsedData?.isInOfficialList || parsedData?.aiAnalysis === "Potencjalnie bezpieczna - zalecane ostrożne postępowanie.";

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ✅ WYNIK BEZPIECZEŃSTWA */}
      {parsedData && (
        <View
          style={[
            styles.safetyBox,
            isSafe ? styles.safetyBoxSafe : styles.safetyBoxNSafe,
          ]}
        >
          <Text
            style={[
              styles.safetyTitle,
              isSafe ? styles.safetyTitleSafe : styles.safetyTitleNSafe,
            ]}
          >
            {isSafe ? "Strona bezpieczna" : "Strona niebezpieczna"}
          </Text>
          <Text
            style={[
              styles.safetySub,
              isSafe ? styles.safetySubSafe : styles.safetySubNSafe,
            ]}
          >
            {isSafe
              ? "Ta witryna przeszła wszystkie testy bezpieczeństwa"
              : "Ta witryna nie przeszła wszystkich testów bezpieczeństwa"}
          </Text>
        </View>
      )}

      {
        /**here add the button wihtout any function */
      }

          {!isSafe &&    <TouchableOpacity
                  style={styles.button}
                  onPress={() =>{}}
              >
                  <Text style={styles.buttonText}>Zreportuj Witryne</Text>
              </TouchableOpacity> }
      


      {/* ✅ PRZYCISK ROZWIJANIA */}
      <Pressable onPress={() => setShowMore((p) => !p)} style={styles.moreBtn}>
        <Text style={styles.moreText}>
          {showMore ? "Ukryj dane techniczne ▼" : "Pokaż dane techniczne ▲"}
        </Text>
      </Pressable>

      {/* ✅ DANE TECHNICZNE */}
      {showMore && parsedData && (
        <>
          {/* ✅ INFORMACJE O DOMENIE */}
          <View style={styles.section}>
            <Text style={styles.header}>Informacje o domenie</Text>

            {parsedData.domainIncludesGov != null && (
              <Text style={styles.row}>
                Zawiera .gov:{" "}
                <Text style={styles.value}>
                  {parsedData.domainIncludesGov ? "Tak" : "Nie"}
                </Text>
              </Text>
            )}

            {parsedData.isInOfficialList != null && (
              <Text style={styles.row}>
                Na oficjalnej liście:{" "}
                <Text style={styles.value}>
                  {parsedData.isInOfficialList ? "Tak" : "Nie"}
                </Text>
              </Text>
            )}

            {parsedData.aiAnalysis && (
              <Text style={styles.row}>
                Analiza AI:{" "}
                <Text style={styles.value}>{parsedData.aiAnalysis}</Text>
              </Text>
            )}
          </View>

          {/* ✅ METADANE CERTYFIKATU */}
          {parsedData.certificatesData && (
            <View style={styles.section}>
              <Text style={styles.header}>Metadane certyfikatu</Text>

              {parsedData.certificatesData.host && (
                <Text style={styles.row}>
                  Host:{" "}
                  <Text style={styles.value}>
                    {parsedData.certificatesData.host}
                  </Text>
                </Text>
              )}

              {parsedData.certificatesData.port != null && (
                <Text style={styles.row}>
                  Port:{" "}
                  <Text style={styles.value}>
                    {parsedData.certificatesData.port}
                  </Text>
                </Text>
              )}

              {parsedData.certificatesData.isTrusted != null && (
                <Text style={styles.row}>
                  Zaufany:{" "}
                  <Text
                    style={[
                      styles.value,
                      {
                        color: parsedData.certificatesData.isTrusted
                          ? "green"
                          : "red",
                      },
                    ]}
                  >
                    {parsedData.certificatesData.isTrusted ? "Tak" : "Nie"}
                  </Text>
                </Text>
              )}

              {parsedData.certificatesData.overallTimeValid != null && (
                <Text style={styles.row}>
                  Ważność czasowa:{" "}
                  <Text
                    style={{
                      color: parsedData.certificatesData.overallTimeValid
                        ? "green"
                        : "red",
                    }}
                  >
                    {parsedData.certificatesData.overallTimeValid
                      ? "Ważny"
                      : "Nieważny"}
                  </Text>
                </Text>
              )}

              {parsedData.certificatesData.trustError && (
                <Text style={[styles.row, { color: "red" }]}>
                  Błąd: {parsedData.certificatesData.trustError}
                </Text>
              )}
            </View>
          )}

          {/* ✅ CERTYFIKATY */}
          {parsedData.certificatesData?.certificates?.length > 0 && (
            <>
              <Text
                style={[styles.header, { marginTop: 20, marginBottom: 20 }]}
              >
                Certyfikaty (
                {parsedData.certificatesData.certificates.length})
              </Text>

              {parsedData.certificatesData.certificates.map((cert, i) => {
                const isOpen = expandedCerts[i];

                return (
                  <View key={i} style={styles.certCard}>
                    <Pressable
                      onPress={() =>
                        setExpandedCerts((prev) => ({
                          ...prev,
                          [i]: !prev[i],
                        }))
                      }
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.certTitle}>
                        Certyfikat #{cert.position + 1}
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        {isOpen ? "▲" : "▼"}
                      </Text>
                    </Pressable>

                    {isOpen && (
                      <>
                        {cert.subject?.CN && (
                          <Text style={styles.row}>
                            Właściciel (CN):{" "}
                            <Text style={styles.value}>{cert.subject.CN}</Text>
                          </Text>
                        )}

                        {cert.subject?.O && (
                          <Text style={styles.row}>
                            Organizacja (O):{" "}
                            <Text style={styles.value}>{cert.subject.O}</Text>
                          </Text>
                        )}

                        {cert.subject?.C && (
                          <Text style={styles.row}>
                            Kraj (C):{" "}
                            <Text style={styles.value}>{cert.subject.C}</Text>
                          </Text>
                        )}

                        {cert.issuer?.CN && (
                          <Text style={[styles.row, { marginTop: 6 }]}>
                            Wystawca (CN):{" "}
                            <Text style={styles.value}>
                              {cert.issuer.CN}
                            </Text>
                          </Text>
                        )}

                        {cert.issuer?.O && (
                          <Text style={styles.row}>
                            Organizacja wystawcy (O):{" "}
                            <Text style={styles.value}>{cert.issuer.O}</Text>
                          </Text>
                        )}

                        {cert.issuer?.C && (
                          <Text style={styles.row}>
                            Kraj wystawcy (C):{" "}
                            <Text style={styles.value}>{cert.issuer.C}</Text>
                          </Text>
                        )}

                        {cert.validFrom && (
                          <Text style={styles.row}>
                            Ważny od:{" "}
                            <Text style={styles.value}>{cert.validFrom}</Text>
                          </Text>
                        )}

                        {cert.validTo && (
                          <Text style={styles.row}>
                            Ważny do:{" "}
                            <Text style={styles.value}>{cert.validTo}</Text>
                          </Text>
                        )}

                        {cert.isTimeValid != null && (
                          <Text style={styles.row}>
                            Ważność czasu:{" "}
                            <Text
                              style={{
                                color: cert.isTimeValid ? "green" : "red",
                              }}
                            >
                              {cert.isTimeValid ? "Tak" : "Nie"}
                            </Text>
                          </Text>
                        )}

                        {cert.subjectAltName && (
                          <Text style={styles.row}>
                            SAN:{" "}
                            <Text style={styles.value}>
                              {cert.subjectAltName}
                            </Text>
                          </Text>
                        )}

                        {cert.fingerprint && (
                          <Text style={styles.row}>
                            Odcisk palca:{" "}
                            <Text style={styles.value}>
                              {cert.fingerprint}
                            </Text>
                          </Text>
                        )}

                        {cert.isCA != null && (
                          <Text style={styles.row}>
                            Urząd certyfikacji (CA):{" "}
                            <Text style={styles.value}>
                              {cert.isCA ? "Tak" : "Nie"}
                            </Text>
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safetyBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 3,
  },
  safetyBoxSafe: {
    borderColor: "#009E60",
    backgroundColor: "#E8F6EEFF",
  },
  safetyBoxNSafe: {
    borderColor: "#EF5350",
    backgroundColor: "#FFEBEE",
  },
  safetyTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  safetyTitleSafe: { color: "#009E60" },
  safetyTitleNSafe: { color: "#EF5350" },
  safetySub: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  safetySubSafe: { color: "#009E60" },
  safetySubNSafe: { color: "#EF5350" },
  moreBtn: {
    alignSelf: "center",
    marginBottom: 20,
  },
  moreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  row: { fontSize: 15, marginBottom: 4 },
  value: { fontWeight: "700" },
  header: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  section: {
    marginTop: 25,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#a7a7a7ff",
  },
  certCard: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#a7a7a7ff",
  },
  certTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },


  button: {
    backgroundColor: "#f5534dff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 20,
    
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: 'center'
  },
});
