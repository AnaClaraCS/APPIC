import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View >
      <Button
        title="Novo local"
        onPress={() => navigation.navigate('NovoLocal')}
      />

      <Button
        title="Nova rede"
        onPress={() => navigation.navigate('NovaRede')}
      />

      <Button
        title="Nova leitura"
        onPress={() => navigation.navigate('NovaLeitura')}
      />

      <Button
        title="Locais"
        onPress={() => navigation.navigate('Locais')}
      />

<Button
        title="Gerar leituras"
        onPress={() => navigation.navigate('GeraListaWifi')}
      />

    </View>
  );
};

export default Home;