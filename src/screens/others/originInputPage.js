import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export const OriginInputPage = ({
  visible,
  onClose,
  onSelectCurrentLocation,
  onSelectOnMap,
  onSearchHistorySelect,
  searchHistory,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Destination</Text>
        </View>

        {/* Options */}
        <View style={styles.optionContainer}>
          {/* Choose on Map */}
          <TouchableOpacity
            style={styles.option}
            onPress={onSelectOnMap}
          >
            <Icon name="map" size={24} color="#D3770C" />
            <Text style={styles.optionText}>Choose on Map</Text>
          </TouchableOpacity>

          {/* Your Location */}
          <TouchableOpacity
            style={styles.option}
            onPress={onSelectCurrentLocation}
          >
            <Icon name="my-location" size={24} color="#D3770C" />
            <Text style={styles.optionText}>Your Location</Text>
          </TouchableOpacity>
        </View>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <FlatList
              data={searchHistory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.historyItem}
                  onPress={() => onSearchHistorySelect(item)}
                >
                  <Icon name="history" size={20} color="#D3770C" />
                  <View style={styles.historyTextContainer}>
                    <Text style={styles.historyText}>{item.description}</Text>
                    <Text style={styles.historySubText}>
                      {item.details || "Details not available"}
                    </Text>
                  </View>
                  <Icon name="arrow-forward" size={20} color="#D3770C" />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>More from recent history</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const App = () => {
  const [isPopupVisible, setPopupVisible] = useState(true);
  const [searchHistory, setSearchHistory] = useState([
    { description: "San Francisco, CA, USA", details: "California, USA" },
    { description: "Los Angeles, CA, USA", details: "California, USA" },
    { description: "New York, NY, USA", details: "New York, USA" },
  ]);

  const handleSelectCurrentLocation = () => {
    console.log("Current location selected");
    setPopupVisible(false);
  };

  const handleSelectOnMap = () => {
    console.log("Navigating to map to select location");
    setPopupVisible(false);
  };

  const handleSearchHistorySelect = (item) => {
    console.log("Selected from history:", item);
    setPopupVisible(false);
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setPopupVisible(true)}
      >
        <Text style={styles.openButtonText}>Open Origin Input</Text>
      </TouchableOpacity>

      <OriginInputPage
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        onSelectCurrentLocation={handleSelectCurrentLocation}
        onSelectOnMap={handleSelectOnMap}
        onSearchHistorySelect={handleSearchHistorySelect}
        searchHistory={searchHistory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#444",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  optionContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    marginBottom: 15,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FFF",
  },
  historyContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    marginBottom: 10,
  },
  historyTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  historyText: {
    fontSize: 16,
    color: "#FFF",
  },
  historySubText: {
    fontSize: 12,
    color: "#AAA",
  },
  footer: {
    padding: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#D3770C",
    textDecorationLine: "underline",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  openButton: {
    padding: 15,
    backgroundColor: "#D3770C",
    borderRadius: 5,
  },
  openButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default App;
