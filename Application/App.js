import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useFonts } from "expo-font";
import LampScreen from './components/LampScreen/LampScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import outwardBlock from "./assets/fonts/outward-block.ttf";
import interRegular from "./assets/fonts/Inter-Regular.otf";
import interExtraBold from "./assets/fonts/Inter-ExtraBold.otf";

export default function App() {
    const [fontsLoaded] = useFonts({
        "outward-block": outwardBlock,
        "inter-regular": interRegular,
        "inter-extraBold": interExtraBold,
    });

    // Attendre que les polices soient chargées avant de rendre le composant
    if (!fontsLoaded) {
        return (
            <GestureHandlerRootView>
                <LoadingScreen />
            </GestureHandlerRootView>
        );
    }

    return (
        <GestureHandlerRootView>
            <MainApp />
        </GestureHandlerRootView>
    );
}

function LoadingScreen() {
    return <Text>Loading...</Text>;
}

function MainApp() {
    return (
        <View style={styles.container}>
            <LampScreen/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111716',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerHorizontal: {
        width: 270,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    containerVertical: {
        height: 410,
        flex: 0,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    boutonSwitch: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: "#D5D6DA", // #373C3F
        shadowColor: '#D5D6DA',
        shadowOffset: { width: -5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        right: 15,
        bottom: 15,
    },
    iconBouton: {
        fontSize: 30,
    },
    imageContainer: {
        width: 40,
        height: 40
    }
});