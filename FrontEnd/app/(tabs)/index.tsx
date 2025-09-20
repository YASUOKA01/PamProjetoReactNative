import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../../services/api";

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
  const [formData, setFormData] = useState({ Nome: "", Idade: "", UF: "" });

  // id do cliente que estamos pedindo confirmação para excluir
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const carregarClientes = () => {
    api
      .get<Cliente[]>("/clientes")
      .then((res) => {
        console.log("GET /clientes ->", res.data);
        setClientes(res.data);
      })
      .catch((err) => console.log("Erro ao carregar clientes:", err));
  };

  const abrirModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingClient(cliente);
      setFormData({
        Nome: cliente.Nome,
        Idade: cliente.Idade.toString(),
        UF: cliente.UF,
      });
    } else {
      setEditingClient(null);
      setFormData({ Nome: "", Idade: "", UF: "" });
    }
    setModalVisible(true);
  };

  const validarForm = () => {
    if (!formData.Nome.trim() || !/^[A-Za-z\s]+$/.test(formData.Nome)) {
      Alert.alert("Erro", "Nome deve conter apenas letras");
      return false;
    }
    const idade = parseInt(formData.Idade);
    if (isNaN(idade) || idade <= 0) {
      Alert.alert("Erro", "Idade inválida");
      return false;
    }
    if (!formData.UF || !/^[A-Z]{2}$/.test(formData.UF)) {
      Alert.alert("Erro", "UF inválido. Deve conter 2 letras maiúsculas.");
      return false;
    }
    return true;
  };

  const salvarCliente = () => {
    if (!validarForm()) return;

    const clienteDados = {
      Nome: formData.Nome.trim(),
      Idade: parseInt(formData.Idade),
      UF: formData.UF.toUpperCase(),
    };

    if (editingClient) {
      // Atualizar cliente
      api
        .put(`/clientes/${editingClient.ID}`, clienteDados)
        .then((res) => {
          console.log("PUT /clientes/:id ->", res.data);
          carregarClientes();
          setModalVisible(false);
          Alert.alert("Sucesso", "Cliente atualizado!");
        })
        .catch((err) => {
          console.log("Erro ao atualizar cliente:", err);
          Alert.alert("Erro", "Erro ao atualizar cliente");
        });
    } else {
      // Criar cliente
      api
        .post("/clientes", clienteDados)
        .then((res) => {
          console.log("POST /clientes ->", res.data);
          carregarClientes();
          setModalVisible(false);
          Alert.alert("Sucesso", "Cliente adicionado!");
        })
        .catch((err) => {
          console.log("Erro ao adicionar cliente:", err);
          Alert.alert("Erro", "Erro ao adicionar cliente");
        });
    }
  };

  const excluirCliente = async (id: number) => {
    console.log("Tentando excluir cliente ID:", id);
    try {
      const res = await api.delete(`/clientes/${id}`);
      console.log("DELETE /clientes/:id ->", res.status, res.data);
      carregarClientes();
      Alert.alert("Sucesso", "Cliente excluído!");
    } catch (err) {
      console.log("Erro ao excluir cliente:", err);
      Alert.alert("Erro", "Não foi possível excluir o cliente.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  // Abre o modal de confirmação (não usa Alert.alert do sistema)
  const pedirConfirmacaoExclusao = (id: number) => {
    setConfirmDeleteId(id);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Clientes
      </Text>
      <Button title="Adicionar Cliente" onPress={() => abrirModal()} />
      <FlatList
        style={{ marginTop: 20 }}
        data={clientes}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>
              ID: {item.ID} - {item.Nome} - {item.Idade} anos ({item.UF})
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Button title="Editar" onPress={() => abrirModal(item)} />
              <View style={{ width: 10 }} />
              {/* botão chama o nosso modal de confirmação */
              }
              <Button
                title="Excluir"
                color="red"
                onPress={() => pedirConfirmacaoExclusao(item.ID)}
              />
            </View>
          </View>
        )}
      />

      {/* Modal de adicionar/editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingClient ? "Editar Cliente" : "Adicionar Cliente"}
            </Text>
            <Text>Nome:</Text>
            <TextInput
              value={formData.Nome}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  Nome: text.replace(/[^A-Za-z\s]/g, ""),
                })
              }
              style={styles.input}
            />
            <Text>Idade:</Text>
            <TextInput
              value={formData.Idade}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  Idade: text.replace(/[^0-9]/g, ""),
                })
              }
              keyboardType="numeric"
              style={styles.input}
            />
            <Text>UF:</Text>
            <TextInput
              value={formData.UF}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  UF: text.replace(/[^A-Za-z]/g, "").toUpperCase(),
                })
              }
              maxLength={2}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={salvarCliente} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação (nosso próprio, confiável) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteId !== null}
        onRequestClose={() => setConfirmDeleteId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxWidth: 320 }]}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
              Confirmar exclusão
            </Text>
            <Text style={{ marginBottom: 20 }}>
              Deseja realmente excluir o cliente ID: {confirmDeleteId}?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button title="Cancelar" onPress={() => setConfirmDeleteId(null)} />
              <Button
                title="Excluir"
                color="red"
                onPress={() => {
                  if (confirmDeleteId !== null) excluirCliente(confirmDeleteId);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
  },
});
