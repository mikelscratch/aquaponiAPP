import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

export default function NuevoHuerto() {
    const [arrayHuerto, setArrayHuerto] = useState([]);
    const [arrayPez, setArrayPez] = useState([]);
    const [idHuerto, setIdHuerto] = useState(null);
    const [idPez, setIdPez] = useState(null);
    const [fechaCreacion, setFechaCreacion] = useState(new Date().toISOString());
    const [fechaSiembra, setFechaSiembra] = useState(new Date().toISOString());
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [responseHuerto, responsePez] = await Promise.all([
            fetch(`https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Hortalizas/ObtenerHortalizasIdNombreImagen`),
            fetch(`https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Hortalizas/ObtenerEspecieIdNombreImagen`),
          ]);
  
          const objetoHuerto = await responseHuerto.json();
          const objetoPez = await responsePez.json();
  
          setArrayHuerto(objetoHuerto.data || []);
          setArrayPez(objetoPez.data || []);
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const enviarDatos = async () => {
      const url = 'https://oyster-app-g3sar.ondigitalocean.app/api/RegistroDiario/Huerto/CrearHuerto';
      const payload = {
        requestCrearHuertoDto: {
          fechaCreacion,
          hortalizaId: parseInt(idHuerto, 10),
          fechaSiembra,
          peceraId: parseInt(idPez, 10),
        },
      };
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Éxito', 'Huerto creado correctamente');
          console.log('Respuesta del servidor:', data);
        } else {
          Alert.alert('Error', `Código ${response.status}: ${data.message || 'Ocurrió un error'}`);
          console.error('Error en la solicitud:', data);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo conectar al servidor');
        console.error('Error de red:', error);
      }
    };
  
    return (
      <View>
        <Text>Selecciona el huerto a crear!</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={arrayHuerto}
          search
          maxHeight={300}
          labelField="nombre"
          valueField="id"
          placeholder="Selecciona tu huerto"
          searchPlaceholder="Busca tu huerto!"
          value={idHuerto}
          onChange={(item) => {
            setIdHuerto(item.id);
          }}
        />
        <Text>Selecciona tu Pez</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={arrayPez}
          search
          maxHeight={300}
          labelField="nombre"
          valueField="id"
          placeholder="Selecciona tu pez"
          searchPlaceholder="Busca tu pez!"
          value={idPez}
          onChange={(item) => {
            setIdPez(item.id);
          }}
        />
        <TouchableOpacity style={styles.button} onPress={enviarDatos}>
          <Text style={styles.buttonText}>Crear huerto acuaponico</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    dropdown: {
      margin: 16,
      height: 50,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 10,
      margin: 16,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });
  