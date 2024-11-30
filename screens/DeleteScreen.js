import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function DeleteScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  const getProdutos = async () => {
    const db = await SQLite.openDatabaseAsync('estoqueDB');
    const rows = await db.getAllAsync('SELECT * FROM estoque');
    setProdutos(rows);
  };

  const excluirProduto = async (id) => {
    setIsLoading(true); 
    const db = await SQLite.openDatabaseAsync('estoqueDB');
    await db.runAsync('DELETE FROM estoque WHERE id = ?', [id]);
    getProdutos();
    setIsLoading(false); 
    Alert.alert("Produto excluído com sucesso!");
  };

  const confirmExclusao = (id, nome) => {
    Alert.alert(
      "Excluir Produto",
      `Você tem certeza que deseja excluir o produto ${nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { text: "Excluir", onPress: () => excluirProduto(id) }
      ]
    );
  };

  useEffect(() => {
    async function setup() {
      const db = await SQLite.openDatabaseAsync('estoqueDB');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS estoque (id INTEGER PRIMARY KEY NOT NULL, produto_nome TEXT NOT NULL, quantidade INTEGER NOT NULL);
      `);
      getProdutos();
    }
    setup();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Excluir Produto</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.produto_nome} - Quantidade: {item.quantidade}</Text>
              <Button
                title="Excluir"
                onPress={() => confirmExclusao(item.id, item.produto_nome)}
                color="#e74c3c" 
              />
            </View>
          )}
        />
      )}
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Voltar para a lista</Text>
            </TouchableOpacity>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,  
  },
  itemText: {
    fontSize: 18,
    color: '#34495e',
  },
  loader: {
    marginTop: 20,
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
