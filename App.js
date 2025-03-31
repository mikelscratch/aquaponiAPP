import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity,Alert,KeyboardAvoidingView,Platform } from 'react-native';
import SvgAquaponia from './Resources/SvgAqua';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './Resources/Dashboard';
import CentroDeConocimiento from './Resources/CentroDeConocimiento';
import CentroDeConocimientoHortaliza from './Resources/CentroDeConcoimientoHortaliza';
import EspeciesPez from './Resources/EspeciesPez';
import DashboardHortalizas from './Resources/DashboardHortalizas';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import NuevoHuerto from './Resources/NuevoHuerto';
import ConfigHuerto from './Resources/ConfigHuerto';
import { GlobalProvider } from './Resources/GlobalContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Inicializa Firebase solo una vez
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigation = useNavigation();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        navigation.navigate('Inicio');
      })
      .catch(error => {

        Alert.alert('Error',error.message),[
          {
            Text: 'Ok' 
          }
        ]
        console.log(error);
      });
  };

  return (
    <View style={styles.Maincontainer}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.ContainterSVG}>
        <SvgAquaponia />
      </View>
      
        <TextInput
          onChangeText={text => setEmail(text)}
          style={styles.TextInput}
          placeholder="jhon.doe@email.com"
        />
        <TextInput
          onChangeText={text => setPassword(text)}
          style={styles.TextInput}
          placeholder="Contraseña"
          secureTextEntry={true}
        />
        <View style={styles.BotonLogin}>
          <TouchableOpacity onPress={handleSignIn}>
            <LinearGradient
              style={styles.opacityLogin}
              colors={['#168aad', '#1a759f', '#76c893']}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Iniciar sesion</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </View>
  );
}

function NavigationScreen() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" options={{ title: 'Dashboard' }} component={Dashboard} />
        <Drawer.Screen name="Conocimiento" options={{ title: 'Base de conocimientos' }} component={CentroDeConocimiento} />
        <Drawer.Screen name="CentroHortaliza" options={{ title: 'Hortalizas', drawerItemStyle: { display: 'none' } }} component={CentroDeConocimientoHortaliza} />
        <Drawer.Screen name="CentroEspecie" options={{ title: 'Especies', drawerItemStyle: { display: 'none' } }} component={EspeciesPez} />
        <Drawer.Screen name="ConfiguracionHuerto" options={{ title: 'Ajustes', drawerItemStyle: { display: 'none' } }} component={ConfigHuerto} />
        <Drawer.Screen name="HuertoNuevo" options={{ title: 'Añadir Huerto' }} component={NuevoHuerto} />
        <Drawer.Screen
          name="DashHortaliza"
          component={DashboardHortalizas}
          options={({ navigation }) => ({
            title: 'Dash Hortaliza',
            drawerItemStyle: { display: 'none' },
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 16 }}
                onPress={() => navigation.navigate('ConfiguracionHuerto')}
              >
                <FontAwesome6 name="user-gear" size={24} color="#184e77" />
              </TouchableOpacity>
            ),
          })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function DrawerNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Inicio" component={NavigationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <DrawerNavigation />
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  Maincontainer: {
    backgroundColor: '#f5eeed',
    flex: 1,
  },
  opacityLogin: {
    padding: 10,
    borderRadius: 10,
  },
  BotonLogin: {
    marginTop: 30,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContainterSVG: {
    width: width,
    height: 300,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 75,
  },
  TextInput: {
    width: '60%',
    marginTop: 30,
    borderRadius: 30,
    height: 40,
    backgroundColor: 'white',
    paddingStart: 20,
  },
});
