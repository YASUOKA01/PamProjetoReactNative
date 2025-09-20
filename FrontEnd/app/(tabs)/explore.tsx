import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ExploreItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

const exploreData: ExploreItem[] = [
  {
    id: '1',
    title: 'React Native',
    description: 'Framework para desenvolvimento mobile',
    icon: 'atom',
    category: 'Tecnologia'
  },
  {
    id: '2',
    title: 'Expo Router',
    description: 'Sistema de navegação baseado em arquivos',
    icon: 'map',
    category: 'Navegação'
  },
  {
    id: '3',
    title: 'TypeScript',
    description: 'JavaScript com tipagem estática',
    icon: 'text.cursor',
    category: 'Linguagem'
  },
  {
    id: '4',
    title: 'Componentes',
    description: 'Elementos reutilizáveis da interface',
    icon: 'square.stack.3d.up',
    category: 'UI/UX'
  },
  {
    id: '5',
    title: 'Hooks',
    description: 'Lógica de estado e efeitos em componentes',
    icon: 'link',
    category: 'React'
  },
  {
    id: '6',
    title: 'Styling',
    description: 'StyleSheet e design responsivo',
    icon: 'paintbrush',
    category: 'Design'
  },
];

const categories = ['Todos', 'Tecnologia', 'Navegação', 'Linguagem', 'UI/UX', 'React', 'Design'];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredData = exploreData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Explorar
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Descubra recursos e funcionalidades
        </ThemedText>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchSection}>
        <ThemedView style={[styles.searchBar, { 
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: Colors[colorScheme ?? 'light'].text + '20'
        }]}>
          <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme ?? 'light'].text + '60'} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Pesquisar..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '60'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>
      </ThemedView>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : Colors[colorScheme ?? 'light'].tint + '20'
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <ThemedText style={[
              styles.categoryText,
              {
                color: selectedCategory === category 
                  ? 'white' 
                  : Colors[colorScheme ?? 'light'].tint
              }
            ]}>
              {category}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ThemedView style={styles.resultsSection}>
        <ThemedText style={styles.resultsCount}>
          {filteredData.length} {filteredData.length === 1 ? 'resultado' : 'resultados'}
        </ThemedText>
        
        {filteredData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.exploreItem, { 
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderColor: Colors[colorScheme ?? 'light'].text + '10'
            }]}
          >
            <ThemedView style={[styles.iconContainer, { 
              backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' 
            }]}>
              <IconSymbol name={item.icon as any} size={24} color={Colors[colorScheme ?? 'light'].tint} />
            </ThemedView>
            
            <ThemedView style={styles.itemContent}>
              <ThemedView style={styles.itemHeader}>
                <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                <ThemedView style={[styles.categoryBadge, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].tint + '15' 
                }]}>
                  <ThemedText style={[styles.categoryBadgeText, { 
                    color: Colors[colorScheme ?? 'light'].tint 
                  }]}>
                    {item.category}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
            </ThemedView>
            
            <IconSymbol name="chevron.right" size={16} color={Colors[colorScheme ?? 'light'].text + '60'} />
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="magnifyingglass" size={48} color={Colors[colorScheme ?? 'light'].text + '40'} />
          <ThemedText style={styles.emptyStateText}>
            Nenhum resultado encontrado
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            Tente ajustar sua pesquisa ou filtro
          </ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  categoryScrollView: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  exploreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
});