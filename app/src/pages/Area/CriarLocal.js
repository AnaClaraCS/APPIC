import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Button, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AreaController from '../../controllers/areaController';

const CriarLocal = ({ route, navigation }) => {
  const { IdArea } = route.params;
  const [area, setArea] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [zoom, setZoom] = useState(1);  // Adicionado zoom
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [posicaoMira, setPosicaoMira] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [larguraReal, setLarguraReal] = useState(0);
  const [tamMira, setTamMira] = useState(20);
  
  // Refs para gerenciar o intervalo de movimento
  const moveImageIntervalRef = useRef(null);
  const moveMiraIntervalRef = useRef(null);
  
  useEffect(() => {
    const carregarArea = async () => {
      try {
        const areaController = new AreaController();
        const area = await areaController.obterArea(IdArea);
        if (area) {
          setArea(area);
          setImagem(area.imagem);
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
    setOffset({ x: 0, y: 0 });
  }, [imagem]);

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

  const criarNovoLocal = () => {
    const { coordX, coordY } = calculaPosicaoMira();
    navigation.navigate('NovoLocal', {
        idArea: IdArea,
        x: coordX ,
        y: coordY
    });
  }

  const calculaPosicaoMira = () => {
    const proporcao = larguraReal / imageSize.width ;
    const { x, y } = posicaoMira;
    console.log(`Tamanho da mira na tela: x: ${x}, y: ${y}`);
    const { x: offsetX, y: offsetY } = offset;
    console.log(`Tamanho do offset na tela: x: ${offsetX}, y: ${offsetY}`);
    const coordX = (x + tamMira/2 - offsetX) * proporcao; 
    const coordY = (y + tamMira/2  - offsetY) * proporcao;
    console.log(`Coord da mira: x: ${coordX}, y: ${coordY}`);
    return { coordX,  coordY}
  }

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(prevZoom + 0.1, 3);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(prevZoom - 0.1, 1);
      return newZoom;
    });
  };

  const startMoving = (moveFunc, dx, dy) => {
    moveFunc(dx, dy);
    moveImageIntervalRef.current = setInterval(() => moveFunc(dx, dy), 100); // Mover a cada 100 ms
  };

  const stopMoving = () => {
    clearInterval(moveImageIntervalRef.current);
    moveImageIntervalRef.current = null;
  };

  const startMovingMira = (dx, dy) => {
    startMoving(moveMira, dx, dy);
  };

  const startMovingImagem = (dx, dy) => {
    startMoving(moveImagem, dx, dy);
  };

  const moveMira = (dx, dy) => {
    setPosicaoMira((prev) => ({
      x: Math.max(0, Math.min(prev.x + dx, containerSize.width - tamMira/2)),
      y: Math.max(0, Math.min(prev.y + dy, containerSize.height - tamMira/2))
    }));
  };

  const moveImagem = (dx, dy) => {
    setOffset((prevOffset) => ({
      x: Math.max(Math.min(prevOffset.x + dx, 0), containerSize.width - imageSize.width * zoom),
      y: Math.max(Math.min(prevOffset.y + dy, 0), containerSize.height - imageSize.height * zoom),
    }));
  };

  const onImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    setImageSize({ width, height });
    setLarguraReal(width);
    console.log(`Tamanho real da imagem: Largura: ${width}, Altura: ${height}`);
  };

  const onImageLayout = (event) => {
    const { layout } = event.nativeEvent;
    const { x, y, width, height } = layout;
    console.log(`Imagem - x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
    console.log(`Tamanho da imagem na tela: Largura: ${width}, Altura: ${height}`);
  };

  const onContainerLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {area && (
          <Text style={styles.description}>Descrição: {area.descricao} - Andar: {area.andar}</Text>
        )}
      </View>
      <View style={styles.imageContainer} onLayout={onContainerLayout}>
        {imagem && (
          <Image
            source={{ uri: imagem }}
            style={[
              styles.image,
              {
                width: imageSize.width * zoom,
                height: imageSize.height * zoom,
                transform: [
                  { scale: zoom }, 
                  { translateX: offset.x }, 
                  { translateY: offset.y }
                ],
              },
            ]}
            resizeMode="cover"
            onLoad={onImageLoad}
            onLayout={onImageLayout}
          />
        )}
        <Image
          source={require('../../assets/mira.png')}
          style={[styles.crosshair, { left: posicaoMira.x, top: posicaoMira.y, width: tamMira, height: tamMira }]}
        />
      </View>
      <View style={styles.controls}>
        <View style={styles.directionButtons}>
          <TouchableOpacity
            onPressIn={() => startMovingMira(0, -10)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Cima</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() => startMovingMira(0, 10)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Baixo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() => startMovingMira(-10, 0)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Esquerda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() => startMovingMira(10, 0)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Direita</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.directionButtons}>
          <TouchableOpacity
            onPressIn={() => startMovingImagem(0, 10)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Cima</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() => startMovingImagem(0, -10)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Baixo</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPressIn={() => startMovingImagem(10, 0)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Esquerda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={() => startMovingImagem(-10, 0)}
            onPressOut={stopMoving}
            style={styles.button}
          >
            <Text>Direita</Text>
          </TouchableOpacity> */}
        </View>

        {/* <View style={styles.zoomButtons}>
          <Button title="+" onPress={handleZoomIn} />
          <Button title="-" onPress={handleZoomOut} /> 
        </View>  */}

      </View>
      <Button title="Novo local" onPress={() => criarNovoLocal()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  description: {
    textAlign: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'red',
    overflow: 'hidden', 
  },
  image: {
    position: 'absolute',
    width: 100,
  },
  crosshair: {
    width: 20,
    height: 20,
    position: 'absolute',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  directionButtons: {
    flexDirection: 'column',
  },
  zoomButtons: {
    flexDirection: 'column',
  },
  button: {
    padding: 10,
    backgroundColor: '#ccc',
    marginBottom: 5,
    alignItems: 'center',
  },
});

export default CriarLocal;
