import { View, Text,FlatList,StyleSheet,TouchableOpacity,Image, Dimensions } from 'react-native'
import React, { useEffect,useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation} from '@react-navigation/native';
import moment from 'moment';


  const formatearFecha = (fechaISO) => {
    return moment(fechaISO).format('DD/MM/YYYY');
  };



export default function ImageSlider() {
      const [dataImages, setDataImage] = useState();
      const [arrayImages,setArrayImages]=useState([])
      const navigation = useNavigation();
    useEffect(()=>{

        fetch(`https://oyster-app-g3sar.ondigitalocean.app/api/FotosEspeciesHortalizaHuerto/FotosHuerto/ObtenerFotosHuerto`)
        .then((response)=>response.json())
        .then((dataImages)=>{
          setDataImage(dataImages);
          setArrayImages(dataImages.data)
        })

  
    },[]);

  return (
    <View style={{flex:1}}>
        
        <FlatList
            data={arrayImages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <View style={styles.ContainerHortaliza} >
                                    <Image style={styles.imagenHortaliza} source={{uri:"data:image/jpeg;base64,"+item.foto}}/>
                                  <LinearGradient colors ={["transparent","rgba(0,0,0,0.3)"]}style={styles.BackgroundImage}>
                                  <View style={{alignItems:'center',paddingTop:225}}>
                                  <Text style={{color:'white',fontWeight:500,fontSize:18,fontStyle:'italic'}}>Fecha: {formatearFecha(item.fecha)}</Text>
                                  <Text style={{color:'white',fontWeight:500,fontSize:18,fontStyle:'italic'}}>Camara: {item.camaraId}</Text>
                                  </View>
                                 
                                  </LinearGradient>
                                  
                                 
                                  
                                </View>
                              )}
                              horizontal={true}     
                              showsHorizontalScrollIndicator={false}  />
    </View>
  )
}
const {width,height} = Dimensions.get('screen');
const styles = StyleSheet.create({
  ContainerHortaliza:{
    alignItems:"center",
    gap: 100,
    width:width,
    
  },
  BackgroundImage:{
    position:"absolute",
    height:280,
    width:375,
    borderRadius:40,
    alignContent:"space-around"

  },
  imagenHortaliza:{
    width: 375, 
    height: 280, 
    borderRadius:40,
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