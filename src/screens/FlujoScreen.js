import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { supabase } from './supabase';

export default function FlujoScreen({ onVolver }) {
  const [seccionActiva, setSeccionActiva] = useState('trabajadores'); // 'trabajadores' | 'flujo' | 'pedidos'
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados de listas con los nombres de tablas en minúscula
  const [flujosList, setFlujosList] = useState([]);
  const [trabajadoresList, setTrabajadoresList] = useState([]);
  const [pedidosList, setPedidosList] = useState([]);

  // Estados para modales de creación
  const [modalFlujoVisible, setModalFlujoVisible] = useState(false);
  const [modalTrabajadorVisible, setModalTrabajadorVisible] = useState(false);

  // Campos para nuevo flujo/equipo
  const [inputEquipoId, setInputEquipoId] = useState('');
  const [inputProcesoNombre, setInputProcesoNombre] = useState('');
  const [inputFaseActual, setInputFaseActual] = useState('');
  const [inputPrioridad, setInputPrioridad] = useState('Media');

  // Campos para nuevo trabajador
  const [inputTrabajadorId, setInputTrabajadorId] = useState('');
  const [inputTrabajadorNombre, setInputTrabajadorNombre] = useState('');
  const [inputTrabajadorRol, setInputTrabajadorRol] = useState('');
  const [inputTrabajadorCargo, setInputTrabajadorCargo] = useState('');
  const [inputTrabajadorArea, setInputTrabajadorArea] = useState('');
  const [inputTrabajadorContacto, setInputTrabajadorContacto] = useState('');

  useEffect(() => {
    cargarDatosSupabase();
  }, [seccionActiva]);

  const cargarDatosSupabase = async () => {
    setLoading(true);
    try {
      // 1. Cargar flujo_equipos
      const { data: flujos, error: errFlujo } = await supabase.from('flujo_equipos').select('*');
      if (errFlujo) console.log('Error en flujo_equipos:', errFlujo.message);
      else setFlujosList(flujos || []);

      // 2. Cargar trabajadores (tabla 'equipo')
      const { data: equipo, error: errEq } = await supabase.from('equipo').select('*');
      if (errEq) {
        console.log('Error cargando tabla equipo:', errEq.message);
      } else {
        setTrabajadoresList(equipo || []);
      }

      // 3. Cargar pedidos
      const { data: pedidos, error: errPed } = await supabase.from('pedidos').select('*');
      if (errPed) console.log('Error en pedidos:', errPed.message);
      else setPedidosList(pedidos || []);

    } catch (error) {
      console.error('Excepción general:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para autogenerar el siguiente ID de Trabajador (Ej: EQ-005)
  const generarSiguienteIdTrabajador = () => {
    if (!trabajadoresList || trabajadoresList.length === 0) return 'EQ-001';
    const numeros = trabajadoresList.map(item => {
      const match = (item.id || '').match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numeros, 0);
    const siguienteNum = maxNum + 1;
    return `EQ-${String(siguienteNum).padStart(3, '0')}`;
  };

  // Función auxiliar para autogenerar el siguiente ID de Flujo / Equipo (Ej: EQ-05)
  const generarSiguienteIdFlujo = () => {
    if (!flujosList || flujosList.length === 0) return 'EQ-01';
    const numeros = flujosList.map(item => {
      const match = (item.equipo_id || '').match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numeros, 0);
    const siguienteNum = maxNum + 1;
    return `EQ-${String(siguienteNum).padStart(2, '0')}`;
  };

  // Abrir modal de trabajador asignando ID automático
  const abrirModalTrabajador = () => {
    setInputTrabajadorId(generarSiguienteIdTrabajador());
    setModalTrabajadorVisible(true);
  };

  // Abrir modal de flujo asignando ID automático
  const abrirModalFlujo = () => {
    setInputEquipoId(generarSiguienteIdFlujo());
    setModalFlujoVisible(true);
  };

  // Crear nuevo flujo de equipo enviando todos los datos
  const handleCrearFlujo = async () => {
    if (!inputProcesoNombre.trim()) {
      Alert.alert('Aviso', 'El nombre del proceso es obligatorio.');
      return;
    }

    try {
      const { error } = await supabase.from('flujo_equipos').insert([
        { 
          equipo_id: inputEquipoId, 
          proceso_nombre: inputProcesoNombre, 
          fase_actual: inputFaseActual || 'Iniciado',
          avance_porcentaje: 0,
          horas_acumuladas: 0,
          prioridad: inputPrioridad || 'Media',
          estado_proceso: 'Activo'
        }
      ]);

      if (error) throw error;

      Alert.alert('Éxito', 'Flujo de equipo creado correctamente.');
      setModalFlujoVisible(false);
      setInputEquipoId('');
      setInputProcesoNombre('');
      setInputFaseActual('');
      cargarDatosSupabase();
    } catch (err) {
      Alert.alert('Error al guardar', err.message);
    }
  };

  // Crear nuevo trabajador en la tabla 'equipo' enviando todos los datos
  const handleCrearTrabajador = async () => {
    if (!inputTrabajadorNombre.trim()) {
      Alert.alert('Aviso', 'El nombre del trabajador es obligatorio.');
      return;
    }

    try {
      const { error } = await supabase.from('equipo').insert([
        { 
          id: inputTrabajadorId, 
          nombre: inputTrabajadorNombre, 
          rol: inputTrabajadorRol || 'Operario',
          cargo: inputTrabajadorCargo || 'General',
          área: inputTrabajadorArea || 'Logística',
          contacto: inputTrabajadorContacto || 'Sin contacto',
          estado: 'Activo'
        }
      ]);

      if (error) throw error;

      Alert.alert('Éxito', 'Trabajador registrado en la tabla "equipo".');
      setModalTrabajadorVisible(false);
      setInputTrabajadorId('');
      setInputTrabajadorNombre('');
      setInputTrabajadorRol('');
      setInputTrabajadorCargo('');
      setInputTrabajadorArea('');
      setInputTrabajadorContacto('');
      cargarDatosSupabase();
    } catch (err) {
      Alert.alert('Error al guardar trabajador', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Cabecera */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>PANEL OPERATIVO Y FLUJO</Text>
          <Text style={styles.headerSubtitle}>Sincronizado con Supabase</Text>
        </View>
        <TouchableOpacity style={styles.backButtonMini} onPress={onVolver}>
          <Text style={styles.backButtonMiniText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Pestañas de Navegación */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
        <TouchableOpacity style={[styles.tabItem, seccionActiva === 'trabajadores' && styles.tabItemActive]} onPress={() => setSeccionActiva('trabajadores')}>
          <Text style={[styles.tabText, seccionActiva === 'trabajadores' && styles.tabTextActive]}>👥 Trabajadores (equipo)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, seccionActiva === 'flujo' && styles.tabItemActive]} onPress={() => setSeccionActiva('flujo')}>
          <Text style={[styles.tabText, seccionActiva === 'flujo' && styles.tabTextActive]}>⚙️ Flujos (flujo_equipos)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, seccionActiva === 'pedidos' && styles.tabItemActive]} onPress={() => setSeccionActiva('pedidos')}>
          <Text style={[styles.tabText, seccionActiva === 'pedidos' && styles.tabTextActive]}>📦 Pedidos</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra de Búsqueda */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          placeholder="BUSCAR EN LA VISTA ACTUAL..." 
          placeholderTextColor="#555"
          style={styles.searchInput}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Sincronizando con Supabase...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SECCIÓN: TRABAJADORES (Tabla 'equipo') */}
          {seccionActiva === 'trabajadores' && (
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>PERSONAL (tabla: equipo)</Text>
                <TouchableOpacity style={styles.btnPrimaryMini} onPress={abrirModalTrabajador}>
                  <Text style={styles.btnPrimaryMiniText}>+ Nuevo Trabajador</Text>
                </TouchableOpacity>
              </View>

              {trabajadoresList.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>La tabla "equipo" no tiene registros.</Text>
                </View>
              ) : (
                trabajadoresList
                  .filter(item => 
                    (item.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || 
                    (item.id || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    (item.cargo || '').toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((item, index) => (
                    <View key={index} style={styles.teamCard}>
                      <View style={styles.teamHeaderRow}>
                        <Text style={styles.teamIdBadge}>ID: {item.id}</Text>
                        <Text style={styles.teamName}>{item.nombre}</Text>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>{item.estado || 'Activo'}</Text>
                        </View>
                      </View>
                      <Text style={styles.teamFunction}>Cargo: {item.cargo} | Área: {item.área}</Text>
                      <Text style={styles.memberRole}>Rol: {item.rol} — Contacto: {item.contacto}</Text>
                    </View>
                  ))
              )}
            </View>
          )}

          {/* SECCIÓN: FLUJO DE EQUIPOS */}
          {seccionActiva === 'flujo' && (
            <View>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>FLUJOS Y PROCESOS (tabla: flujo_equipos)</Text>
                <TouchableOpacity style={styles.btnPrimaryMini} onPress={abrirModalFlujo}>
                  <Text style={styles.btnPrimaryMiniText}>+ Crear Flujo</Text>
                </TouchableOpacity>
              </View>

              {flujosList.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No hay registros en "flujo_equipos".</Text>
                </View>
              ) : (
                flujosList
                  .filter(item => 
                    (item.proceso_nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                    (item.equipo_id || '').toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((item, index) => (
                    <View key={index} style={styles.teamCard}>
                      <View style={styles.teamHeaderRow}>
                        <Text style={styles.teamIdBadge}>Equipo: {item.equipo_id}</Text>
                        <Text style={styles.teamName}>{item.proceso_nombre}</Text>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>{item.avance_porcentaje}%</Text>
                        </View>
                      </View>
                      <Text style={styles.teamFunction}>Fase: {item.fase_actual} | Prioridad: {item.prioridad}</Text>
                      <Text style={styles.memberRole}>Horas acumuladas: {item.horas_acumuladas}h — Estado: {item.estado_proceso}</Text>
                    </View>
                  ))
              )}
            </View>
          )}

          {/* SECCIÓN: PEDIDOS */}
          {seccionActiva === 'pedidos' && (
            <View>
              <Text style={styles.sectionTitle}>LISTA DE PEDIDOS (tabla: pedidos)</Text>

              {pedidosList.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No hay pedidos registrados.</Text>
                </View>
              ) : (
                pedidosList
                  .filter(item => 
                    (item.cliente || '').toLowerCase().includes(busqueda.toLowerCase()) || 
                    (item.id || '').toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((item, index) => (
                    <View key={index} style={styles.teamCard}>
                      <View style={styles.teamHeaderRow}>
                        <Text style={styles.teamIdBadge}>ID: {item.id}</Text>
                        <Text style={styles.teamName}>{item.cliente}</Text>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>{item.estado}</Text>
                        </View>
                      </View>
                      <Text style={styles.teamFunction}>Destino: {item.destino}</Text>
                      <Text style={styles.memberRole}>Hora estimada: {item.hora_entrega}</Text>
                    </View>
                  ))
              )}
            </View>
          )}

        </ScrollView>
      )}

      {/* MODAL PARA CREAR TRABAJADOR */}
      <Modal visible={modalTrabajadorVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Nuevo Trabajador</Text>
            
            <TextInput 
              style={[styles.modalInput, { backgroundColor: '#111', color: '#888' }]} 
              placeholder="ID automático" 
              placeholderTextColor="#666" 
              value={inputTrabajadorId} 
              editable={false} 
            />
            <TextInput style={styles.modalInput} placeholder="Nombre completo" placeholderTextColor="#666" value={inputTrabajadorNombre} onChangeText={setInputTrabajadorNombre} />
            <TextInput style={styles.modalInput} placeholder="Rol (ej: Conductor)" placeholderTextColor="#666" value={inputTrabajadorRol} onChangeText={setInputTrabajadorRol} />
            <TextInput style={styles.modalInput} placeholder="Cargo (ej: Operario)" placeholderTextColor="#666" value={inputTrabajadorCargo} onChangeText={setInputTrabajadorCargo} />
            <TextInput style={styles.modalInput} placeholder="Área (ej: Logística)" placeholderTextColor="#666" value={inputTrabajadorArea} onChangeText={setInputTrabajadorArea} />
            <TextInput style={styles.modalInput} placeholder="Contacto (correo/teléfono)" placeholderTextColor="#666" value={inputTrabajadorContacto} onChangeText={setInputTrabajadorContacto} />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalTrabajadorVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSubmit} onPress={handleCrearTrabajador}>
                <Text style={styles.modalBtnSubmitText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA CREAR FLUJO */}
      <Modal visible={modalFlujoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Nuevo Flujo de Equipo</Text>
            
            <TextInput 
              style={[styles.modalInput, { backgroundColor: '#111', color: '#888' }]} 
              placeholder="ID de Equipo automático" 
              placeholderTextColor="#666" 
              value={inputEquipoId} 
              editable={false} 
            />
            <TextInput style={styles.modalInput} placeholder="Nombre del Proceso" placeholderTextColor="#666" value={inputProcesoNombre} onChangeText={setInputProcesoNombre} />
            <TextInput style={styles.modalInput} placeholder="Fase Actual" placeholderTextColor="#666" value={inputFaseActual} onChangeText={setInputFaseActual} />
            <TextInput style={styles.modalInput} placeholder="Prioridad (Alta / Media / Baja)" placeholderTextColor="#666" value={inputPrioridad} onChangeText={setInputPrioridad} />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalFlujoVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSubmit} onPress={handleCrearFlujo}>
                <Text style={styles.modalBtnSubmitText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={onVolver}>
        <Text style={styles.backButtonText}>← Volver al Menú Principal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070707', paddingTop: 35, paddingHorizontal: 14 },
  header: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#161616', paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSubtitle: { color: '#666', fontSize: 11, marginTop: 2 },
  backButtonMini: { width: 28, height: 28, backgroundColor: '#141414', borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  backButtonMiniText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  tabsContainer: { maxHeight: 38, marginBottom: 12 },
  tabsContent: { gap: 8, alignItems: 'center' },
  tabItem: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111', borderRadius: 6, borderWidth: 1, borderColor: '#1f1f1f' },
  tabItemActive: { backgroundColor: '#38bdf8', borderColor: '#38bdf8' },
  tabText: { color: '#888', fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: '#070707', fontSize: 11, fontWeight: 'bold' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d0d0d', borderWidth: 1, borderColor: '#1f1f1f', borderRadius: 6, paddingHorizontal: 10, height: 38, marginBottom: 12 },
  searchIcon: { marginRight: 8, fontSize: 11 },
  searchInput: { color: '#ffffff', fontSize: 11, flex: 1 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: '#888', marginTop: 8, fontSize: 11 },
  scrollContent: { paddingBottom: 25, gap: 12 },

  sectionTitle: { color: '#666', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  btnPrimaryMini: { backgroundColor: '#161616', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#38bdf8' },
  btnPrimaryMiniText: { color: '#38bdf8', fontSize: 9, fontWeight: 'bold' },

  teamCard: { backgroundColor: '#111111', borderWidth: 1, borderColor: '#1f1f1f', borderRadius: 10, padding: 12, marginBottom: 10 },
  teamHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  teamIdBadge: { backgroundColor: '#1a2936', color: '#38bdf8', fontSize: 10, fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#0369a1' },
  teamName: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1 },
  teamFunction: { color: '#888', fontSize: 11, marginBottom: 4, lineHeight: 15 },
  memberRole: { color: '#aaa', fontSize: 10, marginBottom: 2 },

  statusBadge: { backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.25)' },
  statusText: { color: '#38bdf8', fontSize: 9, fontWeight: 'bold' },

  emptyCard: { backgroundColor: '#111', padding: 20, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#1f1f1f' },
  emptyText: { color: '#aaa', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#111', width: '100%', maxWidth: 340, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#262626' },
  modalTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalInput: { backgroundColor: '#161616', color: '#fff', fontSize: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: '#262626', marginBottom: 12 },
  modalButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  modalBtnCancel: { flex: 1, backgroundColor: '#1a1a1a', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalBtnCancelText: { color: '#888', fontSize: 11, fontWeight: 'bold' },
  modalBtnSubmit: { flex: 1, backgroundColor: '#38bdf8', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalBtnSubmitText: { color: '#000', fontSize: 11, fontWeight: 'bold' },

  backButton: { backgroundColor: '#141414', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  backButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 }
});