import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function AddScreen({ navigation }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const addProduto = async () => {
    if (!nomeProduto || !quantidade) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const db = await SQLite.openDatabaseAsync('estoqueDB');
    await db.runAsync('INSERT INTO estoque (produto_nome, quantidade) VALUES (?, ?)', [nomeProduto, quantidade]);
    Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Produto</Text>
      
      <Text style={styles.titulo_input}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        value={nomeProduto}
        onChangeText={setNomeProduto}
        placeholder="Digite o nome do produto"
      />

      <Text style={styles.titulo_input}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        placeholder="Digite a quantidade"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={addProduto}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  titulo_input: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
