import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AreaController from '../../controllers/areaController';

const VerArea = ({ route, navigation }) => {
  const { IdArea } = route.params;
  const [area, setArea] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [locais, setLocais] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [larguraReal, setLarguraReal] = useState(0);

  useEffect(() => {
    const carregarArea = async () => {
      try {
        const areaController = new AreaController();
        const area = await areaController.obterArea(IdArea);
        if (area) {
          setArea(area);
          setImagem(area.imagem);

          // Obter os locais da área
          const locais = await areaController.obterLocais(IdArea);
          setLocais(locais);
        } else {
          Alert.alert('Erro', 'Área não encontrada');
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Erro ao carregar informações da área');
        navigation.goBack();
      }
    };

    carregarArea();
  }, [IdArea, navigation]);

  useEffect(() => {
    if (containerSize.width > 0 && imageSize.width > 0) {
      const proporcao = imageSize.width / containerSize.width;
      const novaAltura = imageSize.height / proporcao;
      setImageSize({
        width: containerSize.width,
        height: novaAltura,
      });
    }
  }, [containerSize, imageSize.width]);

  const onImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    setImageSize({ width, height });
    setLarguraReal(width);
  };

  const onContainerLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const handleLocalClick = (idLocal) => {
    console.log(idLocal);
    navigation.navigate('InformacoesLocal', { idLocal });
  };

  const renderLocalPoints = () => {
    if (!imagem || imageSize.width === 0 || imageSize.height === 0) {
      return null;
    }

    return locais.map((local, index) => {
      const proporcao = larguraReal / imageSize.width;
      const x = local.x / proporcao - 10; 
      const y = local.y / proporcao - 10;
      console.log(local);
      console.log(x+" - "+y);

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.point,
            { left: x, top: y }
          ]}
          onPress={() => handleLocalClick(local.idLocal)}
        >
          <Text style={styles.pointText}>{index}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        {area && (
          <>
            <Text style={styles.description}>Nome: {area.descricao}</Text>
            <Text style={styles.description}>Andar: {area.andar}</Text>
          </>
        )}
      </View>
      <View style={styles.imageContainer} onLayout={onContainerLayout}>
        {imagem && (
          <Image
            source={{ uri: imagem }}
            style={[
              styles.image,
              {
                width: imageSize.width,
                height: imageSize.height
              },
            ]}
            resizeMode="contain"
            onLoad={onImageLoad}
          />
        )}
        {renderLocalPoints()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  infoContainer: {
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  point: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VerArea;
