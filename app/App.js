import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';

import PermissaoAndroid from './src/pages/Permissao/PermissaoAndroid';
import Home from './src/pages/home';
import Locais from './src/pages/Local/Locais';
import NovoLocal from './src/pages/Local/NovoLocal';
import InformacoesLocal from './src/pages/Local/InformacoesLocal';
import Redes from './src/pages/Rede/Redes';
import NovaRede from './src/pages/Rede/NovaRede';
import InformacoesRede from './src/pages/Rede/InformacoesRede';
import Leituras from './src/pages/Leitura/Leituras';
import NovaLeitura from './src/pages/Leitura/NovaLeitura';
import InformacoesLeitura from './src/pages/Leitura/InformacoesLeitura';
import GeraListaWifi from './src/pages/GeraListaWifi';

const Stack = createStackNavigator();

export default function App() {
  const [permissao, setPermissao] = useState(false);

  if (!permissao) {
    if (Platform.OS === 'android') {
      return <PermissaoAndroid setPermissao={setPermissao} />;
    } else if (Platform.OS === 'ios') {
      setPermissao(true);
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        
        {/* Rede */}
        <Stack.Screen name="Redes" component={Redes} options={{ title: 'Redes' }} />
        <Stack.Screen name="NovaRede" component={NovaRede} options={{ title: 'Nova Rede' }} />
        <Stack.Screen name="InformacoesRede" component={InformacoesRede} options={{ title: 'Informações da Rede' }} />
        
        {/* Local */}
        <Stack.Screen name="Locais" component={Locais} options={{ title: 'Locais' }} />
        <Stack.Screen name="NovoLocal" component={NovoLocal} options={{ title: 'Novo Local' }} />
        <Stack.Screen name="InformacoesLocal" component={InformacoesLocal} options={{ title: 'Informações do Lugar' }} />
        
        {/* Leitura */}
        <Stack.Screen name="Leituras" component={Leituras} options={{ title: 'Leituras' }} />
        <Stack.Screen name="NovaLeitura" component={NovaLeitura} options={{ title: 'Nova Leitura' }} />
        <Stack.Screen name="InformacoesLeitura" component={InformacoesLeitura} options={{ title: 'Informações da Leitura' }} />
        
        <Stack.Screen name="GeraListaWifi" component={GeraListaWifi} options={{ title: 'GeraListaWifi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
