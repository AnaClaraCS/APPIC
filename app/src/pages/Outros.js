import React from 'react';
import { View, Button, Text } from 'react-native';

const Outros = ({ navigation }) => {
  return (
    <View >

    <Text>Áreas</Text>
      <Button title="Areas" onPress={() => navigation.navigate('Areas')}/>
      <Button title="Nova área" onPress={() => navigation.navigate('NovaArea')}/>

      <Text>Locais</Text>
      <Button title="Locais" onPress={() => navigation.navigate('Locais')}/>
      <Button title="Novo local" onPress={() => navigation.navigate('NovoLocal')}/>

      <Text>Redes</Text>
      <Button title="Redes" onPress={() => navigation.navigate('Redes')}/>
      <Button title="Nova rede" onPress={() => navigation.navigate('NovaRede')}/>
      <Button title="Gerenciar redes" onPress={() => navigation.navigate('GerenciarRedes')}/>
      <Button title="Redes por perto" onPress={() => navigation.navigate('RedesPerto')}/>

      <Text>Leituras</Text>
      <Button title="Leituras" onPress={() => navigation.navigate('Leituras')}/>
      <Button title="Nova leitura" onPress={() => navigation.navigate('NovaLeitura')}/> 

      <Text>Ler valores RSSI</Text>
      <Button title="Gerar leituras" onPress={() => navigation.navigate('GeraListaWifi')}/>

      <Text>Teste de Calculo</Text>
      <Button title="Calculando" onPress={() => navigation.navigate('Calculando')}/>

      <Text>Teste de mapa</Text>
      <Button title="Mapa" onPress={() => navigation.navigate('Mapa')}/>
    </View>
  );
};

export default Outros;