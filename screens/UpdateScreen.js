import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function UpdateScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);

  const getProdutos = async () => {
    const db = await SQLite.openDatabaseAsync('estoqueDB');
    const rows = await db.getAllAsync('SELECT * FROM estoque');
    setProdutos(rows);
  };

  const updateQuantidades = async () => {
    const db = await SQLite.openDatabaseAsync('estoqueDB');
    for (const produto of produtos) {
      if (produto.novaQuantidade !== undefined && produto.novaQuantidade !== '') {
        await db.runAsync(
          'UPDATE estoque SET quantidade = ? WHERE id = ?',
          [produto.novaQuantidade, produto.id]
        );
      }
    }

    getProdutos();
    alert("Quantidades atualizadas com sucesso!");
    navigation.goBack();
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.productName}>{item.produto_nome}</Text>
      <TextInput
        style={styles.input}
        value={item.novaQuantidade !== undefined ? item.novaQuantidade.toString() : item.quantidade.toString()}
        onChangeText={(text) => {
          const newProdutos = produtos.map((produto) =>
            produto.id === item.id ? { ...produto, novaQuantidade: text } : produto
          );
          setProdutos(newProdutos);
        }}
        keyboardType="numeric"
        clearButtonMode="while-editing" 
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Atualizar Quantidades de Produtos</Text>
          <FlatList
            data={produtos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={updateQuantidades}>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 40,
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
