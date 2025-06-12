import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    boiteText: {
        borderRadius: 10,
        height: 70,
        width: 270,
        backgroundColor: "white",
        shadowColor: '#373C3F',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // justifyContent: "center",
        marginTop: 10,
    },
    textHeure: {
        color: "#111716",
        fontFamily: "inter-extraBold",
        fontSize: 22,
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],  // Modifie la taille du Switch
    },
});