import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator,ScrollView } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import ChatGPT from './Chatgpt';

export default function App() {
  const route = useRoute(); // Accede a la ruta actual
  const { especieid } = route.params || {}; // Obtén los parámetros enviados
  const [dataEspecie, setDataEspecie] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [arrayEspecie, setArrayEspecie] = useState([]);

  // useFocusEffect para recargar datos cada vez que se accede a la pantalla
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true); // Reinicia el estado de carga al entrar en la pantalla
      fetch(`https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Especies/ObtenerEspeciePorId/${especieid}`)
        .then((response) => response.json())
        .then((objetoEspecie) => {
          setDataEspecie(objetoEspecie);
          setArrayEspecie(objetoEspecie.data);
          setIsLoading(false); // Indica que la carga ha finalizado
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
          setIsLoading(false); // Finaliza el estado de carga incluso si ocurre un error
        });
    }, [especieid]) // La dependencia asegura que el efecto se actualice si cambia `especieid`
  );

  return (
    <View style={styles.container}>
      <ScrollView>
      {isLoading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
        <>
        <View style={styles.scrollviewContainterPez}>
          <View style={styles.ContainerPez} >
          <Text style={styles.TextTitlePez}>{arrayEspecie.nombreComun}</Text>
          <Image style={styles.imagenHortaliza} source={{ uri: "data:image/jpeg;base64,"+ arrayEspecie.foto }} />
          </View>
        
          <Text style={styles.textComun}>{arrayEspecie.nombreCientifico}</Text>
          
          <Text style={styles.text}>{arrayEspecie.habitat}</Text>
          <Text style={styles.text}>
            Temperatura del agua: {arrayEspecie.temperaturaAguaMin}° - {arrayEspecie.temperaturaAguaMax}°
          </Text>
          <Text style={styles.text}>
            Niveles de PH: {arrayEspecie.nivelPHMin} - {arrayEspecie.nivelPHMax}
          </Text>
        </View>
          
          <ChatGPT prompt={`Dame cuidados y consejos para este tipo de pez ${arrayEspecie.nombreComun} con nombre cientifico ${arrayEspecie.nombreCientifico}
          dame tus recomendaciones en un JSON de la siguiente forma
       {"consejos": [{"cuidado": "Riego adecuado", "descripcion": "En el caso de los tomates de uso doméstico, se debe regar profundamente pero con poca frecuencia, permitiendo que la tierra se seque entre riegos. En acuaponía, el sistema de riego automático se encargará de mantener un nivel adecuado de humedad.", 
       "tip": "Evitar el riego por encima de la cabeza para prevenir enfermedades fúngicas."}}
          `} />
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  TextTitlePez: {
    color: '#1A759F',
    fontSize: 60,
    fontWeight: 'bold',
    paddingTop:20,
    
  },
  ContainerPez:{
    flexDirection: 'row',
    alignSelf:'flex-start',
    alignItems:'center',
  },
  scrollviewContainterPez:{
    paddingTop:30,
    paddingLeft:50,
    paddingRight:60,
    backgroundColor:'#52B69A',
    paddingBottom:75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#184e77',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  textComun: {
    fontSize: 18,
    color: 'white',
    fontWeight:'300',
    fontStyle:'italic',
  },
  imagenHortaliza: {
    width: 100,
    height: 100,
    borderWidth: 5,
    borderColor: '#184e77',
    borderRadius: 50,
    marginLeft:30,
    margintop:10
  },
});
