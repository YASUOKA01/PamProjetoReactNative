import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity
} from "react-native";
import api from "../../services/api";

// Interface para Cliente
interface Cliente {
  ID: number;
  Nome: string;
  Idade: number;
  UF: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    Nome: '',
    Idade: '',
    UF: '',
  });

  const carregarClientes = () => {
    api.get<Cliente[]>("/clientes")
      .then(res => setClientes(res.data))
      .catch(err => console.log(err));
  };

  const deletarCliente = (id: number) => {
    api.delete(`/clientes/${id}`)
      .then(() => carregarClientes())
      .catch(err => console.log(err));
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setEditingClient(cliente);
    setFormData({
      Nome: cliente.Nome,
      Idade: cliente.Idade.toString(),
      UF: cliente.UF
    });
    setModalVisible(true);
  };

  const salvarEdicao = () => {
    if (!editingClient) return;

    const idade = parseInt(formData.Idade);
    if (isNaN(idade) || idade <= 0) {
      Alert.alert("Erro", "Idade inválida");
      return;
    }

    const clienteAtualizado = {
      Nome: formData.Nome.trim(),
      Idade: idade,
      UF: formData.UF
    };

    api.put(`/clientes/${editingClient.ID}`, clienteAtualizado)
      .then(() => {
        setModalVisible(false);
        setEditingClient(null);
        carregarClientes();
        Alert.alert("Sucesso", "Cliente atualizado!");
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Erro", "Erro ao atualizar cliente");
      });
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Clientes</Text>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
            }}
          >
            <Text>{item.Nome} - {item.Idade} anos ({item.UF})</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="Editar" onPress={() => abrirModalEditar(item)} />
              <View style={{ width: 10 }} />
              <Button title="Excluir" color="red" onPress={() => deletarCliente(item.ID)} />
            </View>
          </View>
        )}
      />

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 20,
        }}>
          <View style={{
            width: '100%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Editar Cliente
            </Text>

            <Text>Nome:</Text>
            <TextInput
              value={formData.Nome}
              onChangeText={(text) => setFormData({ ...formData, Nome: text })}
              style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
            />

            <Text>Idade:</Text>
            <TextInput
              value={formData.Idade}
              onChangeText={(text) => setFormData({ ...formData, Idade: text })}
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
            />

            <Text>UF:</Text>
            <TextInput
              value={formData.UF}
              onChangeText={(text) => setFormData({ ...formData, UF: text.toUpperCase() })}
              maxLength={2}
              style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 8 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={salvarEdicao} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
