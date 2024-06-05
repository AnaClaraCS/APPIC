import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, FlatList, StyleSheet } from 'react-native';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn'; // Importando o tipo WifiEntry

const App = () => {
  const [wifiList, setWifiList] = useState<any[]>([]);
  const [permissao, setPermissao] = useState(false);

  useEffect(() => {
    const pedindoPermissao = async () => {
      if (Platform.OS === 'android') { // Se for Android
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Acesso a localização é necessária para identificar Wifis',
              message: 'Esse aplicativo precisa de acesso a localização para listar as redes wifi próximas.',
              buttonNegative: 'Não permitir',
              buttonPositive: 'Permitir',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permitido");
            setPermissao(true);
          } else {
            console.log("Erro");
            setPermissao(false);
          }
        } catch (err) {
          console.warn(err);
          setPermissao(false);
        }
      } else { // Se for IOS nao precisa da localização (tem outro processo, mas não vou focar nisso agora)
        setPermissao(true);
      }
    };

    pedindoPermissao();
  }, []); // fechando o useEffect

  const getWifiList = async () => {
    if (permissao) {
      try {
        const wifiArray = await WifiManager.loadWifiList();
        //console.log('WiFi list:', wifiArray);
        const sortedWifiList = wifiArray.sort((a, b) => b.level - a.level); // Ordena por nível de sinal decrescente
        setWifiList(sortedWifiList);
      } catch (error) {
        console.log('Error fetching WiFi list!', error);
        setWifiList([]);
      }
    } else {
      console.log('Permissão de localização não concedida');
    }
  };

  const renderItem = ({ item }: { item: WifiEntry }) => ( // Especificando o tipo WifiEntry para o item
  <View style={styles.row}>
    <Text style={styles.cell}>{item.SSID}</Text>
    <Text style={styles.cell}>{item.level}</Text>
  </View>
);

  return (
    <View >
      <Button title="Gerar lista de wifi" onPress={getWifiList} />
      <FlatList
        data={wifiList}
        renderItem={renderItem}
        keyExtractor={(item) => item.BSSID}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Nome (SSID)</Text>
            <Text style={styles.headerCell}>RSSI (Level)</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({ // Definindo os estilos aqui
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default App;
