import react from "react";

import { StyleSheet, Text, View,TextInput, Dimensions,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


export default function ButtonGradient (){
    return(
        <TouchableOpacity>
            <LinearGradient
        // Button Linear Gradient
            colors={['#168aad', '#1a759f', '#76c893']}
            style={styles.button}>
            <Text style={styles.text}>Iniciar sesion</Text>
        
        </LinearGradient>

        </TouchableOpacity>
    );
    
}
const styles = StyleSheet.create({
    text:{
      fontSize:20,
      fontWeight: "bold",
      padding: 10,
      color: 'white',
      borderRadius: 25,
    },

  });