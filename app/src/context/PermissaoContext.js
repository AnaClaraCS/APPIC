import React, { createContext, useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const PermissaoContext = createContext();

const PermissaoProvider = ({ children }) => {
  const [permissao, setPermissao] = useState(false);

  useEffect(() => {
    const pedindoPermissao = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Acesso a localização é necessária para identificar Wifis',
              message: 'Esse aplicativo precisa de acesso a localização para listar as redes wifi próximas.',
              buttonNegative: 'Não permitir',
              buttonPositive: 'Permitir',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setPermissao(true);
          } else {
            setPermissao(false);
          }
        } catch (err) {
          console.warn(err);
          setPermissao(false);
        }
      } else { //Não é android
        setPermissao(true);
      }
    };

    pedindoPermissao();
  }, []);

  return (
    <PermissaoContext.Provider value={{ permissao, setPermissao }}>
      {children}
    </PermissaoContext.Provider>
  );
};

export { PermissaoContext, PermissaoProvider };
