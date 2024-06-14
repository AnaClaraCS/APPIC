import React, { useState, useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import WifiManager from 'react-native-wifi-reborn'; 
import { PermissaoContext } from '../context/PermissaoContext.js'; 

const GerarListaWifi = () => {
  const [wifiList, setWifiList] = useState([]);
  const { permissao } = useContext(PermissaoContext);

  const getWifiList = async () => {
    if (permissao) {
      try {
        const wifiArray = await WifiManager.loadWifiList();
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

  const renderItem = ({ item }) => ( // Especificando o tipo WifiEntry para o item
    <View style={styles.row}>
      <Text style={styles.cell}>{item.SSID}</Text>
      <Text style={styles.cell}>{item.level}</Text>
    </View>
  );

  return (
    <View>
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

export default GerarListaWifi;
