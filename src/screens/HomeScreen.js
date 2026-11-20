import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ onNavigate }) {
  const menuItems = [
    { id: 'envios', title: 'Envíos y Pedidos', desc: 'Control de rutas y entregas', icon: '🚚' },
    { id: 'equipo', title: 'Equipo', desc: 'Personal y colaboradores', icon: '👥' },
    { id: 'finanzas', title: 'Cotización y Finanzas', desc: 'Presupuestos y costos', icon: '📊' },
    { id: 'flujo', title: 'Flujo de Trabajo', desc: 'Procesos operativos', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Cabecera ultra limpia */}
      <View style={styles.header}>
        <Text style={styles.title}>Panel Central</Text>
        <Text style={styles.subtitle}>Selecciona un módulo</Text>
      </View>

      {/* Lista Minimalista */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            activeOpacity={0.7}
            style={styles.rowItem} 
            onNavigate={() => {}} // placeholder para evitar errores si no pasa
            onPress={() => onNavigate(item.id)}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.icon}>{item.icon}</Text>
              <View>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowDesc}>{item.desc}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000', 
    paddingTop: 70,
    paddingHorizontal: 20
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#121212'
  },
  title: { 
    color: '#ffffff', 
    fontSize: 22, 
    fontWeight: '600', 
    letterSpacing: -0.5,
    marginBottom: 4
  },
  subtitle: {
    color: '#666666',
    fontSize: 13
  },
  listContainer: { 
    gap: 12,
    paddingBottom: 40
  },
  rowItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#0a0a0a', 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#161616'
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1
  },
  icon: { 
    fontSize: 20 
  },
  rowTitle: { 
    color: '#ffffff', 
    fontSize: 14, 
    fontWeight: '500',
    marginBottom: 2
  },
  rowDesc: { 
    color: '#666666', 
    fontSize: 11
  },
  arrow: {
    color: '#444444',
    fontSize: 18,
    fontWeight: '300',
    paddingLeft: 10
  }
});