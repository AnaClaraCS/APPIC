import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// @ts-ignore
import NovoLocal from './src/pages/Local/NovoLocal';
// @ts-ignore
import Locais from './src/pages/Local/Locais';
// @ts-ignore
import NovaRede from './src/pages/Rede/NovaRede';
// @ts-ignore
import NovaLeitura from './src/pages/Leitura/NovaLeitura';
// @ts-ignore
import Home from './src/pages/home';
// @ts-ignore
import GeraListaWifi from './src/pages/GeraListaWifi';
// @ts-ignore
import InformacoesLocal from './src/pages/Local/InformacoesLocal';

const Stack = createStackNavigator();

export default function App() {
  return (

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
          <Stack.Screen name="NovaRede" component={NovaRede} options={{ title: 'Nova Rede' }} />
          <Stack.Screen name="NovoLocal" component={NovoLocal} options={{ title: 'Novo Local' }} />
          <Stack.Screen name="NovaLeitura" component={NovaLeitura} options={{ title: 'Nova Leitura' }} />
          <Stack.Screen name="Locais" component={Locais} options={{ title: 'Locais' }} />
          <Stack.Screen name="InformacoesLocal" component={InformacoesLocal} options={{ title: 'InformacoesLocal' }} />
          <Stack.Screen name="GeraListaWifi" component={GeraListaWifi} options={{ title: 'GeraListaWifi' }} />
        </Stack.Navigator>
      </NavigationContainer>

    
  );
}
