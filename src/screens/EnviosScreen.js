import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from './supabase';

export default function EnviosScreen({ onVolver }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar los pedidos asignados desde Supabase al abrir la pantalla
  useEffect(() => {
    cargarPedidosAsignados();
  }, []);

  const cargarPedidosAsignados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*');

      if (error) {
        console.log('🔴 ERROR DE SUPABASE:', error.message, error.details);
      } else {
        console.log('🟢 DATOS RECIBIDOS:', data);
        setPedidos(data || []);
      }
    } catch (err) {
      console.log('🔴 EXCEPCIÓN:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.enviosContainer}>
      <StatusBar style="light" />

      {/* Título de la sección */}
      <Text style={styles.enviosHeaderTitle}>MIS PEDIDOS ASIGNADOS</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00f2fe" />
          <Text style={styles.loadingText}>Sincronizando con la nube...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Cabecera de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, { flex: 1.2 }]}>ID Pedido</Text>
            <Text style={[styles.thText, { flex: 2.2 }]}>Cliente</Text>
            <Text style={[styles.thText, { flex: 1.2 }]}>Estado</Text>
            <Text style={[styles.thText, { flex: 1.2, textAlign: 'right' }]}>Hora</Text>
          </View>

          {/* Si no hay pedidos en la base de datos */}
          {pedidos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No hay pedidos asignados en este momento.</Text>
            </View>
          ) : (
            pedidos.map((item, index) => (
              <View key={index} style={styles.tableRowActive}>
                <Text style={[styles.tdText, { flex: 1.2, color: '#fff', fontWeight: 'bold' }]}>{item.id}</Text>
                <Text style={[styles.tdText, { flex: 2.2, color: '#ddd' }]} numberOfLines={1}>{item.cliente}</Text>
                <View style={{ flex: 1.2 }}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.estado}</Text>
                  </View>
                </View>
                <Text style={[styles.tdText, { flex: 1.2, textAlign: 'right', color: '#aaa' }]}>{item.hora_entrega}</Text>
              </View>
            ))
          )}

          {/* Tarjeta de detalles / Mapa compacto */}
          {pedidos.length > 0 && (
            <View style={styles.detailsCard}>
              <View style={styles.mapContainer}>
                <View style={styles.mapGridLineH1} />
                <View style={styles.mapGridLineV1} />
                <View style={styles.mapRouteLine} />
                <View style={styles.mapStartPoint} />
                <View style={styles.mapEndPoint}>
                  <View style={styles.mapPinCenter} />
                </View>
              </View>

              <View style={styles.infoPanel}>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Pedido Activo</Text><Text style={styles.infoVal}>{pedidos[0]?.id}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Cliente</Text><Text style={styles.infoVal}>{pedidos[0]?.cliente}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Destino</Text><Text style={styles.infoVal}>{pedidos[0]?.destino}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Entrega estimada</Text><Text style={styles.infoVal}>{pedidos[0]?.hora_entrega}</Text></View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity style={styles.btnRoute}>
                    <Text style={styles.btnRouteText}>VER RUTA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnHistory}>
                    <Text style={styles.btnHistoryText}>HISTORIAL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Botón para regresar */}
      <TouchableOpacity style={styles.backButtonEnvios} onPress={onVolver}>
        <Text style={styles.backButtonText}>← Volver al Menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  enviosContainer: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 40, paddingHorizontal: 12 },
  enviosHeaderTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 15 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 10, fontSize: 12 },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 8, marginBottom: 6 },
  thText: { color: '#737373', fontSize: 11, fontWeight: '600' },
  tableRowActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', borderWidth: 1, borderColor: '#222', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 8, marginBottom: 8 },
  tdText: { fontSize: 12 },
  statusBadge: { backgroundColor: 'rgba(212, 163, 115, 0.15)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(212, 163, 115, 0.3)' },
  statusText: { color: '#d4a373', fontSize: 10, fontWeight: 'bold' },
  emptyCard: { padding: 20, backgroundColor: '#141414', borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  emptyText: { color: '#777', fontSize: 12 },
  detailsCard: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#222', borderRadius: 8, padding: 10, marginTop: 10, gap: 10 },
  mapContainer: { width: '100%', height: 120, backgroundColor: '#0d131a', borderRadius: 6, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#1e293b' },
  mapGridLineH1: { position: 'absolute', top: '60%', width: '100%', height: 1, backgroundColor: '#1e293b' },
  mapGridLineV1: { position: 'absolute', left: '30%', height: '100%', width: 1, backgroundColor: '#1e293b' },
  mapRouteLine: { position: 'absolute', top: '75%', left: '25%', width: '45%', height: 2, backgroundColor: '#00f2fe', transform: [{ rotate: '-35deg' }] },
  mapStartPoint: { position: 'absolute', bottom: 20, left: '22%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#00f2fe' },
  mapEndPoint: { position: 'absolute', top: 25, left: '65%', width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(0, 242, 254, 0.3)', justifyContent: 'center', alignItems: 'center' },
  mapPinCenter: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00f2fe' },
  infoPanel: { width: '100%' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#181818' },
  infoLabel: { color: '#888888', fontSize: 11 },
  infoVal: { color: '#ffffff', fontSize: 11, fontWeight: '500' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 8 },
  btnRoute: { flex: 1, borderWidth: 1, borderColor: '#ffffff', borderRadius: 6, paddingVertical: 8, alignItems: 'center' },
  btnRouteText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  btnHistory: { flex: 1, backgroundColor: '#ffffff', borderRadius: 6, paddingVertical: 8, alignItems: 'center' },
  btnHistoryText: { color: '#000000', fontSize: 10, fontWeight: 'bold' },
  backButtonEnvios: { marginTop: 10, backgroundColor: '#1f1f1f', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 15 },
  backButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
});