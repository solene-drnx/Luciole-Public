import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, Button } from 'react-native';
import { style } from "./BentoBoxSwitch_style";
import { Input, Switch } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ESP32_IP } from "../../config/config";

export function BentoBoxSwitch({ titre, image }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [radioFrequence, setRadioFrequence] = useState(105.5);
    const [lampColor, setLampColor] = useState([255, 100, 0]);
    const [response, setResponse] = useState('');

    // Fonction de communication avec l'ESP32
    const envoyerMessageESP32 = async (message) => {
        try {
            const url = `http://${ESP32_IP}/?message=${encodeURIComponent(message)}`;
            console.log(url);
            const response = await fetch(url, {
                method: 'GET',
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                setResponse(JSON.stringify(jsonResponse));
                console.log('Réponse de l\'ESP32:', jsonResponse);
            } else {
                console.error('Erreur HTTP:', response.status);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message à l\'ESP32:', error);
        }
    };

    // Preparation message pour allumer/eteindre la radio ou la lampe
    function envoyerMessageSwitch(){
        let message;
        titre === "Lampe" ? message = "lampe" : message = "radio";
        isEnabled === false ? message += "on" : message += "of";

        envoyerMessageESP32(message);
    }

    // Préparation message pour changer la couleur de la lampe
    function envoyerCouleur(){
        let message = "color";
        message += lampColor;
        envoyerMessageESP32(message);
    }

    // Préparation message pour changer la fréquence de la lampe
    function envoyerFrequence(){
        let message = "frequ";
        message += radioFrequence;
        envoyerMessageESP32(message);
    }

    const onSelectColor = ({ hex }) => {
        setLampColor(hex);
        console.log(hex);
    };

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={style.boiteText}>
                    <View style={style.containerIconSwitch}>
                        <Image source={image} style={style.imageContainer} />
                        <Switch
                            trackColor={{ false: '#D5D6DA', true: 'black' }}
                            thumbColor="white"
                            ios_backgroundColor="#D5D6DA"
                            onValueChange={(value) => {
                                setIsEnabled(value);
                                envoyerMessageSwitch();
                            }}
                            value={isEnabled}
                            style={style.switch}
                        />
                    </View>
                    <View style={style.containerText}>
                        <Text style={style.textPrincipal}>{titre}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Modal pour régler la fréquence radio */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible && (titre === "Radio")}>
                <BlurView intensity={8} style={style.blurViewContainer}>
                    <View style={style.containerModal}>
                        <Text style={style.MainTextModal}>Fréquence Radio</Text>
                        <TextInput
                            style={style.input}
                            onChangeText={setRadioFrequence}
                            value={radioFrequence}
                            keyboardType="numeric"
                        />
                        <View style={style.containerButtonModal}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[style.containerButton, { backgroundColor: "#D5D6DA" }]}>
                                <Text style={[style.textButtonModal, { color: "#111716" }]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={envoyerFrequence} style={[style.containerButton, { backgroundColor: "black" }]}>
                                <Text style={[style.textButtonModal, { color: "white" }]}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>

            {/* Modal pour régler la couleur de la lampe */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible && (titre === "Lampe")}>
                <BlurView intensity={8} style={style.blurViewContainer}>
                    <View style={style.containerModal}>
                        <Text style={style.MainTextModal}>Couleur de la lampe</Text>
                        <GestureHandlerRootView style={{ height: 300 }}>
                            <ColorPicker style={{ marginHorizontal: 20 }} value="rgb(255, 100, 0)" onCompleteJS={onSelectColor}>
                                <Preview style={{ marginBottom: 10 }} />
                                <Panel1 style={{ marginBottom: 10 }} />
                                <HueSlider />
                            </ColorPicker>
                        </GestureHandlerRootView>
                        <View style={style.containerButtonModal}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[style.containerButton, { backgroundColor: "#D5D6DA" }]}>
                                <Text style={[style.textButtonModal, { color: "#111716" }]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={envoyerCouleur} style={[style.containerButton, { backgroundColor: "black" }]}>
                                <Text style={[style.textButtonModal, { color: "white" }]}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </>
    );
}