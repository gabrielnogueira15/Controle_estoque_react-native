import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';

export default function ListScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);

  // Função para carregar todos os produtos
  const getProdutos = async () => {
    const db = await SQLite.openDatabaseAsync('estoqueDB');
    const rows = await db.getAllAsync('SELECT * FROM estoque');
    setProdutos(rows);
  };

  useFocusEffect(() => {
    getProdutos(); // Carrega os produtos sempre que a tela é focada
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.produto_nome}</Text>
            <Text style={styles.itemText}>Quantidade: {item.quantidade}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Atualizar')}>
          <Text style={styles.buttonText}>Atualizar Quantidades</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Adicionar')}>
          <Text style={styles.buttonText}>Adicionar Novo Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Excluir')}>
          <Text style={styles.buttonText}>Excluir Produto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Para efeito de sombra no Android
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
