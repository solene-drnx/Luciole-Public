import { ScrollView } from "react-native-gesture-handler";
import Reveil from "../Reveil/Reveil";

// Ca sert à rien ca mais flemme de supprimer lol
export default function ContainerReveils(){
    return(
        <ScrollView style={{height: "400px"}}>   
            <Reveil heure={7} minute={23}/>
            <Reveil heure={7} minute={23}/>
            <Reveil heure={7} minute={23}/>
            <Reveil heure={7} minute={23}/>
            <Reveil heure={7} minute={23}/>
            <Reveil heure={7} minute={23}/>
        </ScrollView>
    );
}