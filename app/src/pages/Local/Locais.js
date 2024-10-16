import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Pressable } from 'react-native';
import LocalController from '../../controllers/localController';

const Locais = ({ navigation }) => {
  
  const [locais, setLocais] = useState([]);
  const localController = new LocalController();

  useEffect(() => {
    getLocais();
  }, []);

  const getLocais = async () => {
    try {
      const locais = await localController.obterLocais();
      setLocais(locais);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocalPress = (idLocal) => {
    navigation.navigate('InformacoesLocal', { idLocal });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Novo local"
        onPress={() => navigation.navigate('EscolherArea')}
      />
 
      <ScrollView>
        {locais.length > 0 ? ( 
          <View>
            {locais.map((local) => (
              <Pressable key={local.idLocal} onPress={() => handleLocalPress(local.idLocal)}>
                <Text>{local.descricao}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text>Nenhum local encontrado</Text>
        )}
      </ScrollView>
      
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
