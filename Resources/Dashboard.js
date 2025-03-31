import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,SafeAreaView } from 'react-native';
import ImageSlider from './ImageSlider';
import moment from 'moment';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HuertoButtons from './HuertoButtons';
import UsePushNotifications from './UsePushNotifications';

export default function Dashboard() {
  const [dataDashboard, setDataDashboard] = useState();
  const [arrayDashboard, setArrayDashboard] = useState([]);
  const navigation = useNavigation();


  const fetchDatosDashboard = useCallback(() => {
    fetch(`https://oyster-app-g3sar.ondigitalocean.app/api/Dashboard/Dashbord/ObtenerDatos`)
      .then((response) => response.json())
      .then((dataDashboard) => {
        setDataDashboard(dataDashboard);
        setArrayDashboard(dataDashboard.data);
        console.log(dataDashboard.data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Recarga los datos al enfocar el componente
  useFocusEffect(
    useCallback(() => {
      fetchDatosDashboard();
    }, [fetchDatosDashboard])
  );

  const formatearFecha = (fechaISO) => {
    return moment(fechaISO).format('DD/MM/YYYY');
  };

  const obtenerColorTexto = (fechaCosecha) => {
    const fechaCosechaMoment = moment(fechaCosecha);
    const fechaActual = moment();
    const fechadiff = fechaCosechaMoment.diff(fechaActual, 'days');
    console.log(fechadiff);

    if (fechadiff <= 0 && fechadiff >= -10) {
      return 'green'; // Fecha ya en cosecha
    } else if (fechadiff <= 10 && fechadiff >= 0) {
      return 'orange'; // La fecha de cosecha se acerca
    } else if (fechadiff <= -10) {
      return 'black'; // ya se pasó la cosecha
    } else {
      return 'red'; // aún no se acerca la fecha de cosecha
    }
  };

  return (
    
    <View style={styles.mainContainer}>
      <View style={styles.flatListContainer}>
      <SafeAreaView>
        <FlatList
          data={arrayDashboard}
          keyExtractor={(item) => item.huertoId}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DashHortaliza', {
                    itemresponse: item,
                  });
                }}
              >
                <View>
                  <Text>Huerto: {item.huertoId}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.column}>
                    <Text style={styles.textTitle}>{item.nombre}</Text>
                    <Text>{item.temperatura_Huerto}°C</Text>
                    <Text>HMD: {item.humedad_Tierra_Huerto}</Text>
                    <Text>UV: {item.sensorUV_Huerto}</Text>
                    <Text>PH: {item.phSuelo}</Text>
                  </View>
                  <View style={[styles.column, styles.rightColumn]}>
                    <Text style={styles.textTitle}>{item.nombreComun}</Text>
                    <Text>{item.temperatura_Pecera}°C</Text>
                    <Text style={{ fontSize: 12 }}>NVL: {item.nivelAgua_Pecera}</Text>
                    <Text>OXY: {item.oxigenoDisuelto} </Text>
                    <Text>PHa: {item.phAgua}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.cosechaContainer}>
                <Text style={styles.cosechaTitle}>Fecha de cosecha:</Text>
                <Text
                  style={{
                    color: obtenerColorTexto(item.fechaCosecha),
                    fontWeight: 'bold',
                  }}
                >
                  {formatearFecha(item.fechaCosecha)}
                </Text>
              </View>
            </View>
          )}
        />
        </SafeAreaView>
      </View>
      
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', color: '#1A759F', fontSize: 28,paddingBottom:20 }}>
          Últimas fotos de hortalizas:
        </Text>
      </View>
      <ImageSlider />

        <HuertoButtons/>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  textTitle: {
    fontWeight: '600',
    color: '#1A759F',
    fontSize: 16,
  },
  flatListContainer: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  infoContainer: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingHorizontal: 15,
  },
  rightColumn: {
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  cosechaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cosechaTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
