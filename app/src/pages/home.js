import React from 'react';
import { View, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View >
      <Button title="Locais"
        onPress={() => navigation.navigate('Locais')}
      />

      <Button title="Novo local"
        onPress={() => navigation.navigate('NovoLocal')}
      />

      <Button title="Redes"
        onPress={() => navigation.navigate('Redes')}
      />

      <Button title="Nova rede"
        onPress={() => navigation.navigate('NovaRede')}
      />

      <Button title="Leituras"
        onPress={() => navigation.navigate('Leituras')}
      />

      <Button title="Nova leitura"
        onPress={() => navigation.navigate('NovaLeitura')}
      />

      <Button title="Gerar leituras"
        onPress={() => navigation.navigate('GeraListaWifi')}
      />

    </View>
  );
};

export default Home;