import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Switch from 'react-native-switch-toggles';
export default function HuertoButtons() {
  const [BombaEncendida, setEstadoBomba] = useState(null);
  const [luzEncendida, setLuces] = useState(null);

  useEffect(() => {
    const obtenerEstadoBotones = async () => {
      try {
        const response = await fetch(`https://oyster-app-g3sar.ondigitalocean.app/api/Esp32/ObtenerEstadoBombaLed`);
        const data = await response.json();

        if (data?.data?.length > 0) {
          const { bomba, led } = data.data[0];
          setEstadoBomba(bomba);
          setLuces(led);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    obtenerEstadoBotones();
  }, []);


  const actualizarEstado = async (tipo, nuevoEstado) => {
    const url = "https://oyster-app-g3sar.ondigitalocean.app/api/Esp32/ActualizarBombaLeds";
    const payload = {
      bomba: tipo === 'bomba' ? nuevoEstado : BombaEncendida,
      led: tipo === 'led' ? nuevoEstado : luzEncendida,
      id: 1,
      command: "ActualizarEstado",
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Éxito', `El estado de ${tipo} se actualizó correctamente.`);
        tipo === 'bomba' ? setEstadoBomba(nuevoEstado) : setLuces(nuevoEstado);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', `Código ${response.status}: ${errorData.title || `Error al actualizar ${tipo}.`}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
      console.error('Error de red:', error);
    }
  };

  return (
    <View style={styles.viewAplicacion}>
      <View style={{ paddingBottom: 10 }}>
        <Text style={styles.titleHuerto}>Luz hortaliza</Text>
        <Switch
          size={50}
          value={luzEncendida}
          activeTrackColor="rgba(153, 217, 140, 1)"
          inactiveTrackColor="rgba(52, 160, 164, 1)"
          activeThumbColor="rgba(22, 138, 173, 1)"
          inactiveThumbColor="rgba(153, 217, 140, 1)"
          onChange={async (nuevoEstado) => {
            await actualizarEstado('led', nuevoEstado);
          }}
        />
      </View>

      <View>
        <Text style={styles.titleHuerto}>Bomba de agua</Text>
        <Switch
          size={50}
          value={BombaEncendida}
          activeTrackColor="rgba(153, 217, 140, 1)"
          inactiveTrackColor="rgba(52, 160, 164, 1)"
          activeThumbColor="rgba(22, 138, 173, 1)"
          inactiveThumbColor="rgba(153, 217, 140, 1)"
          onChange={async (nuevoEstado) => {
            await actualizarEstado('bomba', nuevoEstado);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleHuerto: {
    fontSize: 22,
    color: '#1A759F',
    paddingBottom: 10,
    fontWeight: '500',
    paddingRight: 30,
  },
  viewAplicacion: {
    marginLeft: 25,
    flexDirection: 'row',
    
  },
});
