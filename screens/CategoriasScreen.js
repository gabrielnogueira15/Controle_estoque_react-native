import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function CategoriasScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');

  // Função para carregar as categorias
  const getCategorias = async () => {
    const db = await SQLite.openDatabaseAsync('estoqueDB');
    const result = await db.getAllAsync('SELECT * FROM categorias');
    setCategorias(result);
  };

  // Função para adicionar uma nova categoria
  const adicionarCategoria = async () => {
    if (novaCategoria) {
      const db = await SQLite.openDatabaseAsync('estoqueDB');
      await db.runAsync('INSERT INTO categorias (nome) VALUES (?)', [novaCategoria]);
      setNovaCategoria('');
      getCategorias(); // Recarrega as categorias
      alert('Categoria adicionada com sucesso!');
    } else {
      alert('Digite o nome da categoria');
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      
      {/* Campo de input para nova categoria */}
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da nova categoria"
        value={novaCategoria}
        onChangeText={setNovaCategoria}
      />
      <Button title="Adicionar Categoria" onPress={adicionarCategoria} />
      
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.nome}</Text>
          </View>
        )}
      />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
  },
});
