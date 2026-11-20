import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function FinanzasScreen({ onVolver }) {
  const [busqueda, setBusqueda] = useState('');
  const [pestanaActiva, setPestanaActiva] = useState('cotizaciones');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Título Principal */}
      <Text style={styles.headerTitle}>COTIZACIÓN Y FINANZAS</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          placeholder="BUSCAR COTIZACIÓN O REGISTRO FINANCIERO POR ID (COTIZACIÓN, PAGO, GASTO)" 
          placeholderTextColor="#666"
          style={styles.searchInput}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Pestañas de navegación superiores */}
      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => setPestanaActiva('cotizaciones')}>
          <Text style={[styles.tabText, pestanaActiva === 'cotizaciones' && styles.tabTextActive]}>Cotizaciones</Text>
          {pestanaActiva === 'cotizaciones' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPestanaActiva('pagos')}>
          <Text style={[styles.tabText, pestanaActiva === 'pagos' && styles.tabTextActive]}>Pagos</Text>
          {pestanaActiva === 'pagos' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPestanaActiva('gastos')}>
          <Text style={[styles.tabText, pestanaActiva === 'gastos' && styles.tabTextActive]}>Gastos</Text>
          {pestanaActiva === 'gastos' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Cabecera de la tabla */}
        <View style={styles.tableHeader}>
          <Text style={[styles.thText, { flex: 1 }]}>ID</Text>
          <Text style={[styles.thText, { flex: 1.5 }]}>Tipo</Text>
          <Text style={[styles.thText, { flex: 1.5 }]}>Monto</Text>
          <Text style={[styles.thText, { flex: 1.2, textAlign: 'right' }]}>Estado</Text>
        </View>

        {/* Fila seleccionada en la tabla */}
        <View style={styles.tableRowActive}>
          <Text style={[styles.tdText, { flex: 1, color: '#fff' }]}>COT-021</Text>
          <Text style={[styles.tdText, { flex: 1.5, color: '#fff' }]}>Cotización</Text>
          <Text style={[styles.tdText, { flex: 1.5, color: '#fff' }]}>$1,450.00</Text>
          <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Aprobado</Text>
            </View>
          </View>
        </View>

        {/* Tarjeta de detalles (panel derecho de la referencia) */}
        <View style={styles.detailsCard}>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Cotización</Text><Text style={styles.infoVal}>ID-021</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Cotización</Text><Text style={styles.infoVal}>ID-021</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Cliente</Text><Text style={styles.infoVal}>Juan Pérez</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Monto</Text><Text style={styles.infoVal}>$1,450.00</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Estado</Text><Text style={[styles.infoVal, {color: '#84cc16'}]}>Aprobado</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Tipo</Text><Text style={styles.infoVal}>Cotización</Text></View>

          {/* Botones inferiores */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.btnAction}>
              <Text style={styles.btnText}>VER DETALLES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAction}>
              <Text style={styles.btnText}>DESCARGAR PDF</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnFinanzasFull}>
            <Text style={styles.btnText}>VER FINANZAS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botón para regresar */}
      <TouchableOpacity style={styles.backButton} onPress={onVolver}>
        <Text style={styles.backButtonText}>← Volver al Menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 14,
  },
  searchInput: {
    color: '#ffffff',
    fontSize: 10,
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    marginBottom: 20,
    paddingBottom: 8,
  },
  tabText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  thText: {
    color: '#737373',
    fontSize: 12,
    fontWeight: '600',
  },
  tableRowActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  tdText: {
    fontSize: 13,
  },
  statusBadge: {
    backgroundColor: 'rgba(132, 204, 22, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.4)',
  },
  statusText: {
    color: '#84cc16',
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  infoLabel: {
    color: '#888888',
    fontSize: 13,
  },
  infoVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  btnAction: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnFinanzasFull: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: '#222222',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});