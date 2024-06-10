import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'; // Importe TouchableOpacity
import LocalController from '../../controllers/localController';

const Locais = ({ navigation }) => {
  
  const [locais, setLocais] = useState([]); // Store fetched local data
  const localController = new LocalController();

  const getLocais = async () => {
    try {
      const locais = await localController.obterLocais();
      setLocais(locais);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocalPress = (localId) => {
    // Navegar para a página de informações do local, passando o ID do local como parâmetro
    navigation.navigate('InformacoesLocal', { localId });
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
            // Utilize TouchableOpacity para cada item da lista e adicione um onPress handler
            <TouchableOpacity key={local.idLocal} onPress={() => handleLocalPress(local.idLocal)}>
              <Text>{local.descricao}</Text>
            </TouchableOpacity>
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
