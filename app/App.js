import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { PermissaoProvider } from './src/context/PermissaoContext';

import Home from './src/pages/home';

import Locais from './src/pages/Local/Locais';
import NovoLocal from './src/pages/Local/NovoLocal';
import InformacoesLocal from './src/pages/Local/InformacoesLocal';

import Redes from './src/pages/Rede/Redes';
import NovaRede from './src/pages/Rede/NovaRede';
import InformacoesRede from './src/pages/Rede/InformacoesRede';
import GerenciarRedes from './src/pages/Rede/GerenciarRedes';
import RedesPerto from './src/pages/Rede/RedesPerto';

import Leituras from './src/pages/Leitura/Leituras';
import NovaLeitura from './src/pages/Leitura/NovaLeitura';
import InformacoesLeitura from './src/pages/Leitura/InformacoesLeitura';
import GeraListaWifi from './src/pages/GeraListaWifi';

import Calculando from './src/pages/Calculo/Calculando';

import Mapa from './src/pages/Mapa/Mapa';

import Outros from './src/pages/Outros'

import Areas from './src/pages/Area/Areas';
import NovaArea from './src/pages/Area/NovaArea';
import InformacoesArea from './src/pages/Area/InformacoesArea';
import VerArea from './src/pages/Area/VerArea';

const Stack = createStackNavigator();

export default function App() {
 

  return (
    <PermissaoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
          
          {/* Rede */}
          <Stack.Screen name="Redes" component={Redes} options={{ title: 'Redes' }} />
          <Stack.Screen name="NovaRede" component={NovaRede} options={{ title: 'Nova Rede' }} />
          <Stack.Screen name="InformacoesRede" component={InformacoesRede} options={{ title: 'Informações da Rede' }} />
          <Stack.Screen name="GerenciarRedes" component={GerenciarRedes} options={{ title: 'Gerenciar redes' }} />
          <Stack.Screen name="RedesPerto" component={RedesPerto} options={{ title: 'Redes por perto' }} />
          
          {/* Local */}
          <Stack.Screen name="Locais" component={Locais} options={{ title: 'Locais' }} />
          <Stack.Screen name="NovoLocal" component={NovoLocal} options={{ title: 'Novo Local' }} />
          <Stack.Screen name="InformacoesLocal" component={InformacoesLocal} options={{ title: 'Informações do Lugar' }} />

          {/* Area */}
          <Stack.Screen name="Areas" component={Areas} options={{ title: 'Areas' }} />
          <Stack.Screen name="NovaArea" component={NovaArea} options={{ title: 'Nova Area' }} />
          <Stack.Screen name="VerArea" component={VerArea} options={{ title: 'Ver Area' }} />
          <Stack.Screen name="InformacoesArea" component={InformacoesArea} options={{ title: 'Informações da Área' }} />
          
          {/* Leitura */}
          <Stack.Screen name="Leituras" component={Leituras} options={{ title: 'Leituras' }} />
          <Stack.Screen name="NovaLeitura" component={NovaLeitura} options={{ title: 'Nova Leitura' }} />
          <Stack.Screen name="InformacoesLeitura" component={InformacoesLeitura} options={{ title: 'Informações da Leitura' }} />
          
          <Stack.Screen name="GeraListaWifi" component={GeraListaWifi} options={{ title: 'GeraListaWifi' }} />
          <Stack.Screen name="Calculando" component={Calculando} options={{ title: 'Calculando' }} />

          <Stack.Screen name="Mapa" component={Mapa} options={{ title: 'Mapa' }} />

          <Stack.Screen name="Outros" component={Outros} options={{ title: 'Outros' }} />

        </Stack.Navigator>
      </NavigationContainer>
    </PermissaoProvider>
  );
}
