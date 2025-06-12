import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, Modal, TextInput, Button } from 'react-native';
import { style } from "./Reveil_style";
import { Switch } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ESP32_IP} from "../../config/config";

export default function Reveil({heure, minute, heureReveil, setHeureReveil}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [response, setResponse] = useState('');

    // Fonction pour enregistrer un réveil dans la mémoire long terme de l'esp32
    const enregisrerHeureFichier = async (heure) => {
        try {
            await AsyncStorage.setItem('heureReveil', heure);
            console.log('Heure de réveil sauvegardée dans AsyncStorage:', heure);
            recupereHeureFichier();
        } catch (e) {
            console.log('Erreur lors de la sauvegarde dans AsyncStorage', e);
        }
    };

    // Fonction pour récupérer les réveils de la mémoire long terme
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

    // Fonction pour créer un nouveau réveil
    const handleReveilAjoute = (heure, minute) => {
        const nouvelleHeure = `${heure}:${minute}`;
        if (nouvelleHeure !== heureReveil) {
            setHeureReveil(nouvelleHeure);
            enregisrerHeureFichier(nouvelleHeure);
            envoyerHeureSwitch(heure, minute);
        }
    };

    // Fonction qui envoie un message à l'esP32
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

    // Préparation du message pour sélectionner un réveil
    function envoyerHeureSwitch(heure, minute){
        let message = "alarm";
        message += `${heure}:${minute}`;
        envoyerMessageESP32(message);
    }

    function formaterNombre(number) {
        return number < 10 ? `0${number}` : `${number}`;
    }

    useEffect(() => {
        if (`${heure}:${minute}` === heureReveil) {
            setIsEnabled(true);
        } else {
            setIsEnabled(false);
        }
    }, [heure, minute, heureReveil]);

    return (
        <View style={style.boiteText}>
            {(heure === "27") && (minute === "27") ? (<Text style={style.textHeure}>Dodo</Text>) : (<Text style={style.textHeure}>{formaterNombre(heure)}:{formaterNombre(minute)}</Text>)}
            <Switch
                trackColor={{ false: '#D5D6DA', true: 'black' }}
                thumbColor="white"
                ios_backgroundColor="#D5D6DA"
                onValueChange={(value) => {
                    setIsEnabled(value);
                    handleReveilAjoute(heure, minute);
                }}
                value={isEnabled}
                style={style.switch}
            />
        </View>
    );
}