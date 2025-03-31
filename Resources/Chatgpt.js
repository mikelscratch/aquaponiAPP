import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import * as GoogleGenerativeAI from "@google/generative-ai";
import React, { useState, useEffect } from 'react';

export default function ChatGPT({ prompt }) {
  const [responseGemini, setResponseGemini] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const API_KEY = 'placeholder';

  useEffect(() => {
    const startChat = async () => {
      if (prompt) {
        setIsLoading(true);
        try {
          const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const generationConfig = {
            response_mime_type: "application/json",
          };

          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig, // Pasamos la configuración
          });

          const responseText = await result.response.text(); // Obtener texto de la respuesta
          

          // Intentamos convertir la respuesta en JSON
          let responseJson;
          try {
            setResponseGemini(JSON.parse(responseText))
            
            console.log(responseGemini)
            
          } catch (error) {
            console.error("Error al convertir la respuesta a JSON:", error);
            responseJson = { error: "Formato inesperado en la respuesta" };
          }
        } catch (error) {
          console.error("Error al obtener la respuesta de Gemini:", error);
          setResponseGemini([{ title: "Error", description: "No se pudo obtener la respuesta" }]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    startChat();
  }, [prompt]);

  if (loading) {
    return <ActivityIndicator size="large" color="#1a759f" />;
  }

  return (
    <View>
      <View>
  <FlatList
    data={responseGemini["consejos"]}
    scrollEnabled={false}
    keyExtractor={(item, index) => index.toString()} // Usamos el índice como clave
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Text style={styles.title}>{item.cuidado}</Text>
        <Text style={styles.description}>{item.descripcion}</Text>
        <Text style={styles.tip}><Text style={{ fontWeight: 'bold' }}>Consejo:</Text> {item.tip}</Text>
      </View>
    )}
  />
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  tip: {
    fontSize: 14,
    color: "#1a759f",
  },
});
