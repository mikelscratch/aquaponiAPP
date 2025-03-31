import {Text,TextInput,View,Button,TouchableOpacity,FlatList,ScrollView,SafeAreaView,StyleSheet,ActivityIndicator,Image} from 'react-native'
import React, { Component, useEffect } from 'react';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomSwitch from 'react-native-custom-switch-new';
import { Switch } from 'react-native-gesture-handler';


export default function App(){


  const [dataHortaliza, setDataHortaliza] = useState();
  const [isLoading,setIsLoading]=useState(true);
  const [arrayHortaliza,setArrayHortaliza]=useState([]);

  const [dataEspecie, setDataEspecie] = useState();
  const [arrayEspecie,setArrayEspecie]=useState([]);

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const navigation = useNavigation();


  useEffect(()=>{
    if(isLoading){
      fetch("https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Hortalizas/ObtenerHortalizasIdNombreImagen")
      .then((response)=>response.json())
      .then((objetoHortaliza)=>{
        setDataHortaliza(objetoHortaliza);
        setArrayHortaliza(objetoHortaliza.data)
        console.log(objetoHortaliza.data)
      })
    }

  },[arrayEspecie]);

  useEffect(()=>{
    if(isLoading){
      fetch("https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/Hortalizas/ObtenerEspecieIdNombreImagen")
      .then((response)=>response.json())
      .then((objetoEspecie)=>{
        setDataEspecie(objetoEspecie);
        setIsLoading(false)
        setArrayEspecie(objetoEspecie.data)
        console.log(objetoEspecie.data)

      },[arrayEspecie])
    }

  },[arrayHortaliza]);



  if(isLoading==false){
    return(
      
      <View>
        <View style={styles.container}>
            <Text style={styles.TextTitleHortaliza}>Base de conocimientos</Text>
        <View style={styles.ContainerSwitch}>
          <Text style={styles.textSwitch}>Peces</Text>
        <CustomSwitch 
  buttonColor={'#168aad'}
  onSwitchBackgroundColor={'#76c893'}
  buttonBorderColor={'#D4EDE1'}
  buttonBorderWidthbuttonBorderWidth={10}
  animationSpeed={50}	
  
  switchBackgroundColor={'#76c893'}
  onSwitch={() => setIsSwitchOn(!isSwitchOn)}
  
  onSwitchReverse={() => setIsSwitchOn(!isSwitchOn)}
  buttonWidth={40}


/>
      
      <Text style={styles.textSwitch2}>Hortalizas</Text>
        </View>
           
      {isSwitchOn ? (
                      <FlatList
                      data={arrayHortaliza}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <View >
                          <TouchableOpacity style={styles.ContainerHortaliza} onPress={()=>{
                            navigation.navigate('CentroHortaliza', {
                              huertoid: item.id,
                              nombreHortaliza: item.nombre
                          });
                          }}>
                          <Image style={styles.imagenHortaliza} source={{uri:"data:image/jpeg;base64,"+item.foto}}/>
                          <Text style={styles.TextNombreHortaliza}>{item.nombre}</Text>
                          </TouchableOpacity>
                          
                        </View>
                      )}
                    />
        ) : (
          <FlatList
          data={arrayEspecie}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View >
              <TouchableOpacity style={styles.ContainerHortaliza} onPress={()=>{
                navigation.navigate('CentroEspecie', {
                  especieid: item.id,
                  nombrePez: item.nombre
              });
              }}>
              <Image style={styles.imagenHortaliza} source={{uri:"data:image/jpeg;base64,"+item.foto}}/>
              <Text style={styles.TextNombreHortaliza}>{item.nombre}</Text>
              </TouchableOpacity>
              
            </View>
          )}
        />
        )}

        </View>
      </View>
    );
  }
return(
  <ActivityIndicator/>
)


}
const styles = StyleSheet.create({
  buttonCustomization:{
    marginTop: 20,
    backgroundColor: '#1A759F',
    fontSize:20,
    fontWeight: "bold",
    padding: 10,
    color: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  TextButton:{
    color: 'white',
  },
  textSwitch:{
    fontSize:24,
    fontWeight:500,
    paddingRight:25,
    color: '#184e77'
  },
  textSwitch2:{
    fontSize:24,
    fontWeight:500,
    paddingLeft:25,
    color: '#184e77'
  },
  ContainerSwitch:{
    flexDirection: 'row',
    marginTop: 50,
    alignSelf:'center',
    alignItems:'center',
    
  },
  ContainerHortaliza:{
    flexDirection: 'row',
    marginTop: 50,
    alignSelf:'flex-start',
    alignItems:'center',
    
  },
  imagenHortaliza:{
    width: 100, 
    height: 100, 
    borderWidth: 5, 
    borderColor: '#184e77',
    borderRadius: 50,
    marginRight:50, 
  },
  viewDescripcionHortaliza:{
    flexDirection:'row', 
    alignItems:'center',

  },
  TextNombreHortaliza:{
    color: '#34a0a4',
    fontSize: 30,
    fontWeight: "bold",
    fontFamily:'Robo',
  },

  TextTitleHortaliza:{
    color: '#34a0a4',
    paddingTop:20,
    fontSize: 30,
    fontWeight: "bold",
    fontFamily:'Robo'
  },

  TextInput:{
    width: '80%',
    marginTop: 10,
    borderRadius: 30,
    height: 40,
    backgroundColor: 'white',
    paddingStart: 20,
    
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})