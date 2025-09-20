import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../../services/api";
;

export default function NovoCliente() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [uf, setUf] = useState("");

  const salvar = () => {
    api.post("/clientes", {
      Nome: nome,
      Idade: parseInt(idade),
      UF: uf
    }).then(() => {
      Alert.alert("Sucesso", "Cliente cadastrado!");
      setNome("");
      setIdade("");
      setUf("");
    }).catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Idade" value={idade} onChangeText={setIdade} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="UF" value={uf} onChangeText={setUf} maxLength={2} />
      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 8, borderRadius: 5 }
});
