import React from 'react';
import { View, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View >
      <Button title="Areas"
        onPress={() => navigation.navigate('Areas')}
      />

      <Button title="Nova área"
        onPress={() => navigation.navigate('NovaArea')}
      />

      <Button title="Locais"
        onPress={() => navigation.navigate('Locais')}
      />
      <Button title="Criar um local"
        onPress={() => navigation.navigate('EscolherArea')}
      />

      <Button title="Gerenciar redes"
        onPress={() => navigation.navigate('GerenciarRedes')}
      />

      <Button title="Gerar leituras"
        onPress={() => navigation.navigate('GeraListaWifi')}
      />

      <Button title="Calculando"
        onPress={() => navigation.navigate('Calculando')}
      />

      <Button title="Mapa"
        onPress={() => navigation.navigate('Mapa')}
      />

      <Button title="Outros"
        onPress={() => navigation.navigate('Outros')}
      />
    </View>
  );
};

export default Home;