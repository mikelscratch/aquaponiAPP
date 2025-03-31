import { View, Text, StyleSheet, Dimensions, Animated,ScrollView,TouchableOpacity,Alert,PanResponder } from 'react-native';
import React, { useState, useEffect, useRef,useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import ChatGPT from './Chatgpt';
import { GlobalContext } from './GlobalContext';
import { SafeAreaView } from 'react-native-safe-area-context';



const { width } = Dimensions.get('window'); // Ancho de la pantalla


const DashboardHortalizas = () => {
  const [arrayHortaliza, setArrayHortaliza] = useState([]);
  const [iconos, setIconos] = useState([]);
  const { setHuertoData } = useContext(GlobalContext);
  const [currentState, setCurrentState] = useState(0);

  const pan = useRef(new Animated.Value(0)).current;

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(-width)).current;


  const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          pan.setValue(gestureState.dx);
        },
        onPanResponderRelease: (evt, gestureState) => {
          let newState = currentState; // Usamos una variable temporal para evitar errores de sincronización
        
          if (gestureState.dx > 50) {
            // Deslizar a la derecha
            newState = Math.max(currentState - 1, 0); // Nunca permitir un estado menor que 0
          } else if (gestureState.dx < -50) {
            // Deslizar a la izquierda
            newState = Math.min(currentState + 1, 2); // Nunca permitir un estado mayor que 2
          }
        
          // Asegúrate de actualizar el estado
          setCurrentState(newState);
        
          // Animar el desplazamiento al nuevo estado
          Animated.spring(pan, {
            toValue: -newState * width,
            useNativeDriver: true,
          }).start();
        }
        
        , 
      })
    ).current;


  


  const route = useRoute();
  const { itemresponse } = route.params || {};

  const actualizarCosecha = async () =>{
        const url = `https://oyster-app-g3sar.ondigitalocean.app/api/Huerto/ActualizarFechaCosecha/${itemresponse.huertoId}`;
    
        try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            Alert.alert('Éxito', 'Huerto actualizado correctamente');
          } else {
            const data = await response.json();
            Alert.alert('Error', `Código ${response.status}: ${data.message || 'Ocurrió un error'}`);
            console.error('Error en la solicitud:', data);
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo conectar al servidor');
          console.error('Error de red:', error);
        }
  };


  const EliminarHuerto = async () =>{
    
        const url = `https://oyster-app-g3sar.ondigitalocean.app/api/Huerto/EliminarHuerto/${itemresponse.huertoId}`;
    
        try {
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            Alert.alert('Éxito', 'Huerto eliminado correctamente');
            console.log('Huerto eliminado correctamente');
            navigation.navigate('Home', {
              reload: true, // Pasar un parámetro para indicar que debe recargar
            });
          } else {
            const data = await response.json();
            Alert.alert('Error', `Código ${response.status}: ${data.message || 'Ocurrió un error'}`);
            console.error('Error en la solicitud:', data);
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo conectar al servidor');
          console.error('Error de red:', error);
        }
};

  
    const CosecharHortaliza = () => {
      Alert.alert('Cosechar hortaliza', '¿Quieres cosechar nuevamente esta hortaliza o eliminarla?', [
        {
          text: 'Cancelar',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Eliminar',
          onPress: () => Alert.alert('PRECAUCIÓN ⚠️','¿Deseas eliminar este huerto? (esta acción no se puede deshacer)',[
            {
              text:'Cancelar',
              onPress: () => console.log('Cancelado')
            },{
              text:'Si, eliminar',
              onPress: () => EliminarHuerto(),  
            }
          ]),
          style: 'cancel',
        },
        {text: 'Cosechar', onPress: () => actualizarCosecha()},
      ]);
  
    }
  useEffect(() => {
    
    setHuertoData(itemresponse);
    console.log(itemresponse)
  }, [itemresponse]);



  
  
  // Ref para FlatList y Scroll
  const scrollX = useRef(new Animated.Value(0)).current; // Valor para el desplazamiento horizontal

  useEffect(() => {
    const obtenerHortalizaPorId = async () => {
      try {
        const response = await fetch(
          `https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Horalizas/ObtenerHortalizaPorId/${itemresponse.hortaliaId}`
        );
        const objetoHortaliza = await response.json();
        setArrayHortaliza(objetoHortaliza.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    obtenerHortalizaPorId();
  }, [itemresponse.hortaliaId]);


  useEffect(() => {
    const resultados = devolverIcons(arrayHortaliza, itemresponse);
    setIconos(resultados);
  }, [arrayHortaliza, itemresponse]);

  const devolverIcons = (itemsHortaliza, itemsDashboard) => {
    const resultados = [];

    if (itemsDashboard.temperatura_Huerto < itemsHortaliza.tempSueloMin) {
      resultados.push({
        id: '1',
        mensaje: 'Temperatura de suelo es fría',
        icono: '❄️',
      });
    } else if (itemsDashboard.temperatura_Huerto > itemsHortaliza.tempSueloMax) {
      resultados.push({
        id: '2',
        mensaje: 'Temperatura de suelo es caliente',
        icono: '🔥',
      });
    } else {
      resultados.push({
        id: '3',
        mensaje: 'Temperatura de suelo regulada',
        icono: '🌱',
      });
    }

    if (itemsDashboard.sensorUV_Huerto < itemsHortaliza.nivelUVIdeal - 2) {
      resultados.push({
        id: '4',
        mensaje: 'Nivel UV bajo',
        icono: '☀️',
      });
    } else if (itemsDashboard.sensorUV_Huerto > itemsHortaliza.nivelUVIdeal + 2) {
      resultados.push({
        id: '5',
        mensaje: 'Nivel UV alto',
        icono: '🌞',
      });
    } else {
      resultados.push({
        id: '6',
        mensaje: 'Nivel UV adecuado', 
        icono: '🌤️',
      });
    }

    if (itemsDashboard.temperatura_Pecera < itemsHortaliza.temperaturaAguaMin) {
      resultados.push({
        id: '7',
        mensaje: 'Temperatura del agua es fría',
        icono: '💧',
      });
    } else if (itemsDashboard.temperatura_Pecera > itemsHortaliza.temperaturaAguaMax) {
      resultados.push({
        id: '8',
        mensaje: 'Temperatura del agua es caliente',
        icono: '🌡️',
      });
    } else {
      resultados.push({
        id: '9',
        mensaje: 'Temperatura del agua adecuada',
        icono: '🌊',
      });
    }

    return resultados;
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (width * 0.6), // Anterior al item
      index * (width * 0.6), // Item actual
      (index + 1) * (width * 0.6), // Posterior al item
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1], // El ítem seleccionado se hace 1.5 veces más grande
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.item, { transform: [{ scale }] }]}
      >
        <View style={styles.itemContent}>
          <Text style={styles.icon}>{item.icono}</Text>
          <Text>{item.mensaje}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView>
      <Animated.View
              style={{
                flexDirection: "row",
                width: width * 2, // Suponiendo 3 diapositivas
                transform: [{ translateX: pan }],
              }}
              {...panResponder.panHandlers}
            >
        <View style={styles.scrollviewContainterHuerto}>
        <Text style={styles.TextTitleHortaliza}>{itemresponse.nombre} 🌱</Text>
        <View style={styles.ViewContainer}>
        <Text style={styles.TextSubtitleHuerto}>Temperatura: </Text>
        <Text style={{color:'#99D98C',fontWeight:'600',fontSize:24}}>{itemresponse.temperatura_Huerto}°C</Text>
        </View>
        <View style={styles.ViewContainer}>
        <Text style={styles.TextSubtitleHuerto}>Humedad de la tierra: </Text>
        <Text style={{color:'#99D98C',fontWeight:'600',fontSize:25}}>{itemresponse.humedad_Tierra_Huerto}</Text>
        </View>
        <View style={styles.ViewContainer}>
        <Text style={styles.TextSubtitleHuerto} >Nivel UV: </Text>
        <Text style={{color:'#99D98C',fontWeight:'600',fontSize:25}}>{itemresponse.sensorUV_Huerto}</Text>
        </View>
        </View>

        <View style={styles.scrollviewContainterPez}>
      <Text style={styles.TextTitlePez}>{itemresponse.nombreComun} 🐟</Text>
      <View style={styles.ViewContainer}>
      <Text style={styles.TextSubtitlePez}>Temperatura pecera: </Text>
      <Text style={{color:'#184E77',fontWeight:'600',fontSize:24}}>{itemresponse.temperatura_Pecera}°C</Text>
      </View>
      <View style={styles.ViewContainer}>
      <Text style={styles.TextSubtitlePez}>Nivel del agua: </Text>
      <Text style={{color:'#184E77',fontWeight:'600',fontSize:24}}>{itemresponse.nivelAgua_Pecera}</Text>
      </View>
      </View>
      </Animated.View>
      
      
      <Animated.FlatList
          data={iconos}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={width * 0.6} // Ancho del item
          contentContainerStyle={styles.flatListContent}
        />
       
      <Text style={styles.TextTitle}>Recomendaciones</Text>
      <ChatGPT prompt={`Que recomendaciones y consejos me das para mi huerto acuaponico si tengo los siguientes parametros, en mi huerto de ${itemresponse.nombre} tengo la siguiente temperatura de huerto ${itemresponse.temperatura_Huerto}
       la humedad de la tierra del huerto es ${itemresponse.humedad_Tierra_Huerto} la cantidad de UV es en el huerto${itemresponse.sensorUV_Huerto} 
       mientras que en la pecera tengo la siguiente especie ${itemresponse.nombreComun} en la cual la temperatura de la pecera es ${itemresponse.temperatura_Pecera}, el siguiente nivel del agua de la pecera es ${itemresponse.nivelAgua_Pecera} donde
       se mide de 0 a 16, donde 16 es la pecera vacia y 0 es la pecera llena,
        el ph del suelo es el siguiente ${itemresponse.phSuelo}, el oxigen disuelto del agua en la pecera es ${itemresponse.oxigenoDisuelto} ppm, 
        el ph del agua es el siguiente ${itemresponse.phAgua}, dame tus recomendaciones en un JSON de la siguiente forma
       {"consejos": [{"cuidado": "Riego adecuado", "descripcion": "En el caso de los tomates de uso doméstico, se debe regar profundamente pero con poca frecuencia, permitiendo que la tierra se seque entre riegos. En acuaponía, el sistema de riego automático se encargará de mantener un nivel adecuado de humedad.", 
       "tip": "Evitar el riego por encima de la cabeza para prevenir enfermedades fúngicas."}}`}/>
      <View style={styles.touchableCosechar}>
      <TouchableOpacity  onPress={CosecharHortaliza}>
        <Text style={{fontWeight:'bold',color:'white',alignItems:'center',alignContent:'center'}}>Cosechar</Text>
      </TouchableOpacity>
      </View>

      </ScrollView>
  );
}


export default DashboardHortalizas;


const styles = StyleSheet.create({
  scrollviewContainterHuerto:{
    paddingTop:30,
    paddingLeft:50,
    paddingRight:47,
    backgroundColor:'#1A759F',
    paddingBottom:75,
  },
  toggleButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#168aad',
    borderRadius: 10,
    alignItems: 'center',
  },
  scrollviewContainterPez:{
    paddingTop:30,
    paddingLeft:50,
    paddingRight:60,
    backgroundColor:'#52B69A',
    paddingBottom:75,
  },
  touchableCosechar:{
    marginTop:30,
    padding:20,
    margin:60,
    borderRadius: 10,
    backgroundColor: '#168aad',
    marginBottom: 50,
    alignContent:'center',
    alignItems:'center'
  },
  ViewContainer:{
    flexDirection: 'row',
  },
  mainContainer: {

  },
  TextTitle: {
    color: '#34a0a4',
    fontSize: 40,
    fontWeight: 'bold',
    
    
  },
  
  TextTitleHortaliza: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    paddingTop:20,
  },
  TextTitlePez: {
    color: '#1A759F',
    fontSize: 60,
    fontWeight: 'bold',
    paddingTop:20,
    
  },
  TextSubtitleHuerto: {
    color: 'white',
    fontSize: 25,
    fontWeight:'500',
  },
  TextSubtitlePez: {
    color: 'white',
    fontSize: 23,
    fontWeight:'500',
  },
  flatListContent: {
    paddingHorizontal: 30,
    paddingBottom:60,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
    width: width * 0.6, // Ancho del item (60% de la pantalla)
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
})
;

