import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import WifiManager from 'react-native-wifi-reborn'; 
import { PermissaoContext } from '../../context/PermissaoContext.js'; 
import RedeController from '../../controllers/redeController.js';
import Rede from '../../models/rede.js'

const GerarListaWifi = ({navigation}) => {
  const [wifiList, setWifiList] = useState([]);
  const { permissao } = useContext(PermissaoContext);
  const redeController = new RedeController;

  useEffect(() => {
    getWifiList();
  }, []);

  const getWifiList = async () => {
    if (permissao) {
      try {
        const wifiArray = await WifiManager.loadWifiList();
        setWifiList(wifiArray);
      } catch (error) {
        console.log('Error fetching WiFi list!', error);
        setWifiList([]);
      }
    } else {
      console.log('Permissão de localização não concedida');
    }
  };

  const redeSalva = (BSSID) => {
    const rede = redeController.obterRede(BSSID);
    console.log(rede);
    if(rede != null){
        console.log("True");
        return true;
    }
    else{
        console.log("False");
        return false;
    }
  }

  const verRede = (BSSID) => {
    navigation.navigate('InformacoesRede', { BSSID });
  }

  const salvarRede = (BSSID, SSID) => {
    const redeController = new RedeController();
    const rede = new Rede(nome= SSID, bssid= BSSID);
    redeController.criarRede(rede);
  }

  const renderItem = ({ item }) => ( // Especificando o tipo WifiEntry para o item
    <View style={styles.row}>
      <Text style={styles.cell}>{item.SSID}</Text>
      <Text style={styles.cell}>{item.BSSID}</Text>
      {redeSalva(item.BSSID)?
        <Button title="Ver" onPress={verRede(item.BSSID)} />
      :
        <Button title="Salvar" onPress={salvarRede(item.BSSID, item.SSID)} />
      }
    </View>
  );

  return (
    <View>
      <FlatList
        data={wifiList}
        renderItem={renderItem}
        keyExtractor={(item) => item.BSSID}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}> Nome </Text>
            <Text style={styles.headerCell}> RSSI </Text>
            <Text style={styles.headerCell}> Status </Text>
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
