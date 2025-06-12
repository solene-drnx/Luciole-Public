import { StyleSheet } from "react-native";


export const style = StyleSheet.create({
    textPrincipal: {
        color: "#111716",
        fontFamily: "inter-extraBold",
        fontSize: 22,
        padding: 7,
        paddingLeft: 10,
    },
    containerText: {
        marginBottom: 0,
    },
    boiteText: {
        borderRadius: 10,
        height: 130,
        width: 130,
        backgroundColor: "white",
        shadowColor: '#373C3F',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        justifyContent: "space-between",
    },
    imageContainer: {
        width: 60,
        height: 60,
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],  // Modifie la taille du Switch
    },
    containerIconSwitch: {
        paddingTop: 7,
        paddingRight: 4,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    blurViewContainer : {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    containerModal: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: '#373C3F',
        shadowOffset: { width: -10, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    MainTextModal: {
        color: "#111716",
        fontFamily: "inter-extraBold",
        fontSize: 22,
        padding: 20,
        paddingLeft: 20,
    },
    containerButton: {
        width: 120,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    textButtonModal: {
        fontFamily: "inter-regular",
        fontSize: 14,
    },
    containerButtonModal: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#373C3F",
        borderRadius: 10,
        padding: 10,
    },
    containerSwitchLamp: {
        display: "flex",
        flexDirection: "column",
        marginHorizontal: 20,
        justifyContent: "space-between",
        marginBottom: 20,
    },
    containerSwitchLampUnique : {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    textSwitchLamp : {
        fontFamily: "inter-regular",
    }
});