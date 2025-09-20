import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';

interface Cliente {
  id: number;
  Nome: string;
  Idade: number;
  UF: string;
}

const API_BASE_URL = 'http://localhost:3000';

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showUfPicker, setShowUfPicker] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    Nome: '',
    Idade: '',
    UF: '',
  });

  // Carregar clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clientes`);
      if (response.ok) {
        const data = await response.json();
        setClientes(Array.isArray(data) ? data : []);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os clientes');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClientes();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Criar cliente
  const createCliente = async () => {
    try {
      console.log('Criando cliente:', formData);
      
      const clienteData = {
        Nome: formData.Nome.trim(),
        Idade: parseInt(formData.Idade),
        UF: formData.UF,
      };
      
      console.log('Dados para enviar:', clienteData);
      console.log('URL:', `${API_BASE_URL}/clientes`);
      
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });

      console.log('Status da resposta:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Cliente criado:', result);
        Alert.alert('Sucesso', 'Cliente criado com sucesso!');
        setModalVisible(false);
        resetForm();
        fetchClientes();
      } else {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        Alert.alert('Erro', `Erro ao criar cliente: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor');
    }
  };

  // Atualizar cliente
  const updateCliente = async () => {
    if (!editingClient) return;

    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nome: formData.Nome,
          Idade: parseInt(formData.Idade),
          UF: formData.UF,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
        setModalVisible(false);
        setEditingClient(null);
        resetForm();
        fetchClientes();
      } else {
        Alert.alert('Erro', 'Erro ao atualizar cliente');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão');
      console.error('Erro:', error);
    }
  };

  // Deletar cliente
  const deleteCliente = (id: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
                fetchClientes();
              } else {
                Alert.alert('Erro', 'Erro ao excluir cliente');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro de conexão');
              console.error('Erro:', error);
            }
          },
        },
      ]
    );
  };

  // Abrir modal para criar
  const openCreateModal = () => {
    setEditingClient(null);
    resetForm();
    setModalVisible(true);
  };

  // Abrir modal para editar
  const openEditModal = (client: Cliente) => {
    setEditingClient(client);
    setFormData({
      Nome: client.Nome,
      Idade: client.Idade.toString(),
      UF: client.UF,
    });
    setModalVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ Nome: '', Idade: '', UF: '' });
  };

  // Submit form
  const handleSubmit = () => {
    console.log('Form data:', formData);
    
    if (!formData.Nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (!formData.Idade.trim()) {
      Alert.alert('Erro', 'Idade é obrigatória');
      return;
    }

    if (!formData.UF) {
      Alert.alert('Erro', 'Estado é obrigatório');
      return;
    }

    const idade = parseInt(formData.Idade);
    if (isNaN(idade) || idade <= 0) {
      Alert.alert('Erro', 'Idade deve ser um número válido maior que 0');
      return;
    }

    console.log('Dados válidos, enviando...');
    
    if (editingClient) {
      updateCliente();
    } else {
      createCliente();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👥 Clientes</Text>
          <Text style={styles.subtitle}>Gerencie sua base de clientes</Text>
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Text style={styles.addButtonText}>+ Novo Cliente</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Carregando clientes...</Text>
          </View>
        )}

        {/* Lista de Clientes */}
        {!loading && clientes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Nenhum cliente encontrado</Text>
            <Text style={styles.emptySubtitle}>Comece adicionando seu primeiro cliente</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openCreateModal}>
              <Text style={styles.emptyButtonText}>Adicionar Cliente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.clientesContainer}>
            {clientes.map((cliente) => (
              <View key={cliente.id} style={styles.clientCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idBadgeText}>ID: {cliente.id}</Text>
                  </View>
                  <View style={styles.ufBadge}>
                    <Text style={styles.ufBadgeText}>{cliente.UF}</Text>
                  </View>
                </View>

                <Text style={styles.clientName}>{cliente.Nome}</Text>
                <Text style={styles.clientAge}>🎂 {cliente.Idade} anos</Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(cliente)}
                  >
                    <Text style={styles.editButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteCliente(cliente.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Estatísticas */}
        {clientes.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{clientes.length}</Text>
              <Text style={styles.statLabel}>Total de Clientes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(clientes.reduce((acc, c) => acc + c.Idade, 0) / clientes.length)}
              </Text>
              <Text style={styles.statLabel}>Idade Média</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Set(clientes.map(c => c.UF)).size}
              </Text>
              <Text style={styles.statLabel}>Estados</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingClient ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>👤 Nome</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.Nome}
                  onChangeText={(text) => setFormData({ ...formData, Nome: text })}
                  placeholder="Digite o nome completo"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>🎂 Idade</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.Idade}
                  onChangeText={(text) => setFormData({ ...formData, Idade: text })}
                  placeholder="Digite a idade"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>📍 Estado (UF)</Text>
                <TouchableOpacity 
                  style={styles.ufSelector}
                  onPress={() => {
                    console.log('Abrindo seletor de UF');
                    setShowUfPicker(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.ufSelectorText, { color: formData.UF ? '#111827' : '#9CA3AF' }]}>
                    {formData.UF || 'Toque para selecionar o estado'}
                  </Text>
                  <Text style={styles.ufSelectorArrow}>▼</Text>
                </TouchableOpacity>
                {formData.UF && (
                  <TouchableOpacity
                    style={styles.clearUfButton}
                    onPress={() => {
                      console.log('Limpando UF');
                      setFormData({ ...formData, UF: '' });
                    }}
                  >
                    <Text style={styles.clearUfText}>✕ Limpar seleção</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>
                    {editingClient ? '💾 Atualizar' : '➕ Criar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  clientesContainer: {
    padding: 16,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  idBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1D4ED8',
  },
  ufBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ufBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  clientAge: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  editButtonText: {
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  clearUfButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearUfText: {
    fontSize: 14,
    color: '#EF4444',
  },
  ufSelector: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  ufSelectorText: {
    fontSize: 16,
  },
  ufSelectorArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  ufPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ufPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ufPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  ufList: {
    maxHeight: 300,
  },
  ufOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ufOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ufOptionCheck: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});