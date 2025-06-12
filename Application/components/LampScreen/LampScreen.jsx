import { StyleSheet, Text, TouchableOpacity, TextInput, View, Image, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { BentoBoxSwitch } from '../BentoBoxSwitch/BentoBoxSwitch';
import Reveil from '../Reveil/Reveil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Picker } from '@react-native-picker/picker';
import { Swipeable } from 'react-native-gesture-handler';

export default function LampScreen() {
    const [heureReveil, setHeureReveil] = useState("0:0");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [listeReveils, setListeReveils] = useState([]);

    // Récupère le dernier réveil sélectionné depuis la mémoire long terme
    const recupereHeureFichier = async () => {
        try {
            const content = await AsyncStorage.getItem('heureReveil');
            if (content !== null) {
                console.log('Heure de réveil récupérée depuis AsyncStorage:', content);
                return content;
            } else {
                console.log('Aucune heure de réveil trouvée, retour à 0:0');
                return "0:0";
            }
        } catch (e) {
            console.log('Erreur lors de la lecture depuis AsyncStorage', e);
            return "0:0";
        }
    };

    // Enregistre l'heure du réveil sur la mémoire long terme
    const enregistrerHeureReveil = async (listeReveil) => {
        try {
            await AsyncStorage.setItem('listeReveil', JSON.stringify(listeReveil));
            console.log('Liste de réveil sauvegardée dans AsyncStorage:', listeReveil);
        } catch (e) {
            console.log('Erreur lors de la sauvegarde dans AsyncStorage', e);
        }
    };    

    // Récupère la liste des réveil de la mémoire long terme
    const recupererListeReveil = async () => {
        try {
            const content = await AsyncStorage.getItem('listeReveil');
            if (content !== null) {
                console.log('Liste de réveil récupérée depuis AsyncStorage:', content);
                return JSON.parse(content);  
            } else {
                console.log('Aucune heure de réveil trouvée');
                return [];  
            }
        } catch (e) {
            console.log('Erreur lors de la lecture depuis AsyncStorage', e);
            return []; 
        }
    };    

    useEffect(() => {
        const fetchHeureReveil = async () => {
            const content = await recupereHeureFichier();
            setHeureReveil(content);
        };
        const fetchListeReveil = async () => {
            const content = await recupererListeReveil();
            setListeReveils(content);
        };
        fetchHeureReveil();
        fetchListeReveil();
    }, []);

    // Fonction pour ajouter un réveil
    function handleAjoutReveil() {
        const newListeReveils = [...listeReveils, { heure: selectedHour, minute: selectedMinute }];
        setListeReveils(newListeReveils);  
        enregistrerHeureReveil(newListeReveils); 
        setModalVisible(false); 
    }

    // Fonction pour supprimer un réveil
    function handleSuppressionReveil(index) {
        const newListeReveils = listeReveils.filter((_, idx) => idx !== index);
        setListeReveils(newListeReveils);  
        enregistrerHeureReveil(newListeReveils); 
    }

    const renderRightActions = (index) => (
        <TouchableOpacity onPress={() => handleSuppressionReveil(index)}>
            <View style={styles.deleteButton}>
                <Text style={styles.deleteText}>Supprimer</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.containerVertical}>
                <View style={styles.containerHorizontal}>
                    <BentoBoxSwitch titre={"Lampe"} image={require('../../assets/lightbulb.png')} />
                    <BentoBoxSwitch titre={"Radio"} image={require('../../assets/radio.png')} />
                </View>
            </View>
            <ScrollView
                style={styles.containerScrollView}
                contentContainerStyle={styles.scrollViewContentContainer}
            >
                {listeReveils.map((reveil, index) => (
                    <Swipeable key={index} renderRightActions={() => renderRightActions(index)}>
                        <Reveil 
                            heure={reveil.heure} 
                            minute={reveil.minute} 
                            heureReveil={heureReveil} 
                            setHeureReveil={setHeureReveil} 
                        />
                    </Swipeable>
                ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(true)}><View style={styles.containerBoutonReveil}><Text style={styles.textPrincipalBouton}>ajouter un réveil</Text></View></TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <BlurView intensity={8} style={styles.blurViewContainer}>
                    <View style={styles.containerModal}>
                        <Text style={styles.MainTextModal}>Ajouter un réveil</Text>
                        <View style={styles.containerPickers}>
                            <Picker
                                selectedValue={selectedHour}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedHour(itemValue)}
                                itemStyle={styles.pickerItem}
                            >
                                {[...Array(28).keys()].map((value) => (
                                    <Picker.Item label={`${value}`} value={`${value}`} key={value} />
                                ))}
                            </Picker>
                            <Text style={styles.textPicker}>:</Text>
                            <Picker
                                selectedValue={selectedMinute}
                                style={styles.picker}
                                onValueChange={(itemValue) => setSelectedMinute(itemValue)}
                                itemStyle={styles.pickerItem}
                            >
                                {[...Array(60).keys()].map((value) => (
                                    <Picker.Item label={`${value}`} value={`${value}`} key={value} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.containerButtonModal}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.containerButton, { backgroundColor: "#D5D6DA" }]}>
                                <Text style={[styles.textButtonModal, { color: "#111716" }]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAjoutReveil} style={[styles.containerButton, { backgroundColor: "black" }]}>
                                <Text style={[styles.textButtonModal, { color: "white" }]}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#D5D6DA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerBoutonReveil: {
        borderRadius: 10,
        height: 45,
        width: 270,
        backgroundColor: "#373C3F",
        shadowColor: '#373C3F',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textPrincipalBouton: {
        color: "white",
        fontFamily: "inter-extraBold",
        fontSize: 18,
    },
    containerHorizontal: {
        width: 270,
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    containerVertical: {
        height: 130,
        flex: 0,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    containerScrollView: {
        width: "100%",
        maxHeight: 330,
    },
    scrollViewContentContainer: {
        alignItems: "center"
    },
    boutonSwitchGris: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: "#373C3F",
        shadowColor: '#373C3F',
        shadowOffset: { width: -5, height: 5 },
        shadowOpacity: 0.1,
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
    boxButton: {
        width: 130,
        height: 130,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 7,
        display: "flex",
        justifyContent: "space-between"
    },
    textPrincipalDark: {
        color: "black",
        fontFamily: "inter-extraBold",
        fontSize: 22,
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],  // Modifie la taille du Switch
    },
    containterTopSwitch: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    // modal
    blurViewContainer: {
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
    pickerItem: {
        height: 60,  // Pour simuler l'effet de cylindre, ajustez la hauteur des items
        fontSize: 24,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: 135,
    },
    containerPickers: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 30,
    },
    textPicker: {
        fontFamily: "inter-extraBold",
        fontSize: 22,
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 70,
        marginTop: 10,
        marginLeft: -20,
        borderRadius: 10,
        margin: 5,
    },
    deleteText: {
        color: 'white',
        fontSize: 8,
        paddingLeft: 20,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: 40,
        height: 40
    }
})