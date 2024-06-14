import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, FlatList, StyleSheet } from 'react-native';

const PermissaoAndroid = ({ setPermissao }) => {
    useEffect(() => {
      const pedindoPermissao = async () => {
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
      };
    }, [setPermissao]); 

    return null;
  
};

export default PermissaoAndroid;
