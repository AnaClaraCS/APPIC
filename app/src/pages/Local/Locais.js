import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Locais = ({ navigation }) => {
  
  const [locais, setLocais] = useState([]); // Store fetched local data

  const getLocais = async () => { // Use async/await for cleaner error handling
    try {
      const response = await fetch('http://10.0.2.2:3000/api/locais');
      const json = await response.json();
      setLocais(json);
    } catch (error) {
      console.error(error); // Log the error for debugging
      // Handle the error gracefully (e.g., display an error message to the user)
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Novo local"
        onPress={() => navigation.navigate('NovoLocal')}
      />

      <Text> Lista de locais</Text>
      <Button
        title="Listar locais"
        onPress={getLocais}
      />
      {locais.length > 0 && ( // Conditionally render local descriptions if fetched
        <View>
          {locais.map((local) => (
            <Text key={local.idLocal}>{local.descricao}</Text>
          ))}
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default Locais;
