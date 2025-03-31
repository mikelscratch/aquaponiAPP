import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator,ScrollView } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import ChatGPT from './Chatgpt';

export default function App() {
  const route = useRoute(); // Accede a la ruta actual
  const { huertoid } = route.params || {}; // Obtén los parámetros enviados
  const [dataHortaliza, setDataHortaliza] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [arrayHortaliza, setArrayHortaliza] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Se ejecuta cada vez que la pantalla gana foco
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Horalizas/ObtenerHortalizaPorId/${huertoid}`
          );
          const objetoHortaliza = await response.json();
          setDataHortaliza(objetoHortaliza);
          setIsLoading(false);
          setArrayHortaliza(objetoHortaliza.data || {});
          console.log(objetoHortaliza.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [huertoid]) // Dependencia para que se actualice al cambiar el parámetro `huertoid`
  );

  return (
    <View style={styles.container}>
      <ScrollView >
      {isLoading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
        <>
        <View style={styles.scrollviewHortaliza}>
          <View style={styles.ContainerHortaliza} >
          <Text style={styles.TextTitleHortaliza}>{arrayHortaliza.nombre}</Text>
          <Image
            style={styles.imagenHortaliza}
            source={{ uri: "data:image/jpeg;base64,"+ arrayHortaliza.foto }}
          />
          </View>
          
          <Text style={styles.textComun}>{arrayHortaliza.tipo}</Text>

          <Text style={styles.text}>
            Ciclo de vida: {arrayHortaliza.cicloVida}
          </Text>
          <Text style={styles.text}>
            Clima ideal: {arrayHortaliza.climaIdeal}
          </Text>
          <Text style={styles.text}>
            Temperatura del suelo: {arrayHortaliza.tempSueloMin}° -{' '}
            {arrayHortaliza.tempSueloMax}°
          </Text>
          <Text style={styles.text}>
            Temperatura ambiente: {arrayHortaliza.tempAmbMin}° -{' '}
            {arrayHortaliza.tempAmbMax}°
          </Text>
          <Text style={styles.text}>
            Nivel uv ideal: {arrayHortaliza.nivelUVIdeal}
          </Text>
          </View>
          <Text>
            
            <ChatGPT
              prompt={`Dame cuidados y consejos para ${arrayHortaliza.nombre}, se tienen de uso domestico y con huerto acuaponico
              dame tus recomendaciones en un JSON de la siguiente forma
       {"consejos": [{"cuidado": "Riego adecuado", "descripcion": "En el caso de los tomates de uso doméstico, se debe regar profundamente pero con poca frecuencia, permitiendo que la tierra se seque entre riegos. En acuaponía, el sistema de riego automático se encargará de mantener un nivel adecuado de humedad.", 
       "tip": "Evitar el riego por encima de la cabeza para prevenir enfermedades fúngicas."}}
       `}
            />
          </Text>
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  TextTitleHortaliza: {
    color: '#99D98C',
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop:20,
    
  },
  textComun: {
    fontSize: 18,
    color: 'white',
    fontWeight:'300',
    fontStyle:'italic',
  },
  scrollviewHortaliza:{
    paddingTop:30,
    paddingLeft:50,
    paddingRight:60,
    backgroundColor:'#1A759F',
    paddingBottom:75,
  },
  ContainerHortaliza:{
    flexDirection: 'row',
    alignSelf:'flex-start',
    alignItems:'center',
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
