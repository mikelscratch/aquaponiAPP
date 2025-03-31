import React, { useContext, useState, useEffect, useRef } from 'react';
import { GlobalContext } from './GlobalContext';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import HuertoButtons from './HuertoButtons';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      alert('Project ID not found');
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      return pushTokenString;
    } catch (e) {
      alert(`Error getting push token: ${e}`);
    }
  } else {
    alert('Must use physical device for push notifications');
  }
}

export default function ConfigHuerto() {
  const { huertoData } = useContext(GlobalContext);
  const navigation = useNavigation();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [magico, setBotonMagico] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''),console.log(expoPushToken))
      .catch(error => console.error(error));
      
  }, []);

  const eliminarDatos = async () => {
    if (!huertoData || !huertoData.huertoId) {
      Alert.alert('Error', 'No se pudo obtener el ID del huerto.');
      return;
    }

    const url = `https://oyster-app-g3sar.ondigitalocean.app/api/Huerto/EliminarHuerto/${huertoData.huertoId}`;
    try {
      const response = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      if (response.ok) {
        Alert.alert('Éxito', 'Huerto eliminado correctamente');
        navigation.navigate('Home', { reload: true });
      } else {
        const data = await response.json();
        Alert.alert('Error', `Código ${response.status}: ${data.message || 'Ocurrió un error'}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };
  const botonMagico =  async () => {
    if(magico){
      setBotonMagico(false)
    }
    else{
      setBotonMagico(true)
    }
  }

  const enviarnotificacion = async () => {
    if (!expoPushToken || !expoPushToken.startsWith("ExponentPushToken")) {
      Alert.alert("Error", "Token de notificación no válido");
      console.error("Token inválido:", expoPushToken);
      return;
    }
  
    const url = 'https://oyster-app-g3sar.ondigitalocean.app/api/Notificaciones/enviar';
    const payload = {
      token: expoPushToken,
      title: "Hola 👋, soy una prueba :)",
      body: "¡Prueba mandada desde aplicación de forma exitosa!",
    };
  
    console.log("Enviando notificación con payload:", JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      let data;
      const responseText = await response.text(); // Leer respuesta como texto primero
  
      try {
        data = JSON.parse(responseText); // Intentar parsear como JSON
      } catch {
        data = responseText; // Si falla, dejar como texto
      }
  
      if (response.ok) {
        Alert.alert("Mensaje enviado con éxito");
        console.log("Respuesta del servidor:", data);
      } else {
        Alert.alert("Error", `Código ${response.status}: ${data}`);
        console.error("Error en la solicitud:", data);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor");
      console.error("Error de red:", error);
    }
  };
  
  

  return (
    <View style={styles.viewAplicacion}>
      <Text style={styles.titleApp}>Ajustes de hortaliza</Text>
      
      <HuertoButtons />
      <View style={styles.viewTouchable}>
        <TouchableOpacity style={styles.touchableStyle} onPress={() => Alert.alert('Confirmación', '¿Eliminar huerto?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', onPress: eliminarDatos }])}>
          <Text style={styles.textEliminar}>Eliminar Huerto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyleNotification} onPress={enviarnotificacion}>
          <Text style={styles.textEliminar}>Prueba de notificación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableStyleMagico} onPress={botonMagico}>

        </TouchableOpacity>
        { magico ? <Text selectable={true}>{expoPushToken}</Text> : null }
      </View>
      

    </View>
  );
}

const styles = StyleSheet.create({
  titleApp: { fontSize: 40, color: '#52B69A', paddingBottom: 5, fontWeight: '800', paddingTop: 25 },
  viewAplicacion: { marginLeft: 25 },
  touchableStyle: { backgroundColor: 'red', paddingVertical: 25, paddingHorizontal: 75, borderRadius: 50 },
  touchableStyleNotification: { marginTop: 50, backgroundColor: 'green', paddingVertical: 25, paddingHorizontal: 50, borderRadius: 50 },
  touchableStyleMagico: { marginTop: 50, paddingVertical: 25, paddingHorizontal: 100, borderRadius: 50 },
  viewTouchable: { alignItems: 'center', marginTop: 100 },
  textEliminar: { color: 'white', fontWeight: 'bold' }
});
