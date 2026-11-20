import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from './supabase';

export default function EquipoScreen({ onVolver }) {
  const [equipoList, setEquipoList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 5 Equipos de trabajo estructurados de la empresa con sus respectivos datos e integrantes
  const equiposTrabajo = [
    {
      idEq: 'EQ-01',
      nombreEquipo: 'Equipo Alfa - Logística Urbana',
      funcion: 'Reparto local y optimización de rutas en alta densidad.',
      integrantes: [
        { id: 'ID-101', nombre: 'Carlos Maya', rol: 'Lead Developer', estado: 'Activo' },
        { id: 'ID-102', nombre: 'Andrés Gómez', rol: 'Conductor / Repartidor', estado: 'En Ruta' }
      ]
    },
    {
      idEq: 'EQ-02',
      nombreEquipo: 'Equipo Beta - Carga Pesada',
      funcion: 'Transporte de mercancía industrial y volúmenes corporativos.',
      integrantes: [
        { id: 'ID-201', nombre: 'Karol Barriga', rol: 'Project Manager', estado: 'Activo' },
        { id: 'ID-202', nombre: 'Felipe Ruiz', rol: 'Operario de Carga', estado: 'Disponible' }
      ]
    },
    {
      idEq: 'EQ-03',
      nombreEquipo: 'Equipo Gamma - Envíos Express',
      funcion: 'Entregas prioritarias de última milla y documentos urgentes.',
      integrantes: [
        { id: 'ID-301', nombre: 'Edward Duarte', rol: 'Backend Dev', estado: 'En línea' },
        { id: 'ID-302', nombre: 'Sofía Castro', rol: 'Motorizada Express', estado: 'En Ruta' }
      ]
    },
    {
      idEq: 'EQ-04',
      nombreEquipo: 'Equipo Delta - Soporte Tecnológico',
      funcion: 'Mantenimiento de flota, dispositivos móviles y telemetría.',
      integrantes: [
        { id: 'ID-401', nombre: 'Nataly Marin', rol: 'QA Tester', estado: 'Ausente' },
        { id: 'ID-402', nombre: 'Mateo Vargas', rol: 'Soporte IT', estado: 'Activo' }
      ]
    },
    {
      idEq: 'EQ-05',
      nombreEquipo: 'Equipo Omega - Operaciones Especiales',
      funcion: 'Gestión de devoluciones, auditorías y entregas nocturnas.',
      integrantes: [
        { id: 'ID-501', nombre: 'Camila Torres', rol: 'Auditora Logística', estado: 'Activo' },
        { id: 'ID-502', nombre: 'Julián Pardo', rol: 'Logística Nocturna', estado: 'Descanso' }
      ]
    }
  ];

  useEffect(() => {
    // Simulamos carga limpia o conexión a Supabase
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ESTRUCTURA DE EQUIPOS</Text>
        <Text style={styles.headerSubtitle}>Gestión operativa y asignación de personal</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Cargando equipos...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {equiposTrabajo.map((eq, index) => (
            <View key={index} style={styles.teamCard}>
              
              {/* Info del Equipo */}
              <View style={styles.teamHeaderRow}>
                <Text style={styles.teamIdBadge}>{eq.idEq}</Text>
                <Text style={styles.teamName}>{eq.nombreEquipo}</Text>
              </View>
              <Text style={styles.teamFunction}>{eq.funcion}</Text>

              {/* Lista de Integrantes del Equipo */}
              <View style={styles.membersContainer}>
                <Text style={styles.membersTitle}>Integrantes Asignados:</Text>
                
                {eq.integrantes.map((member, idx) => (
                  <View key={idx} style={styles.memberRow}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberIdText}>{member.id}</Text>
                      <View>
                        <Text style={styles.memberName}>{member.name || member.nombre}</Text>
                        <Text style={styles.memberRole}>{member.rol}</Text>
                      </View>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{member.estado}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Botón de acción por equipo */}
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>GESTIONAR EQUIPO</Text>
              </TouchableOpacity>

            </View>
          ))}

        </ScrollView>
      )}

      {/* Botón Volver */}
      <TouchableOpacity style={styles.backButton} onPress={onVolver}>
        <Text style={styles.backButtonText}>← Volver al Menú Principal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070707', paddingTop: 35, paddingHorizontal: 14 },
  header: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#161616', paddingBottom: 8 },
  headerTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSubtitle: { color: '#666', fontSize: 11, marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 8, fontSize: 11 },
  scrollContent: { paddingBottom: 25, gap: 12 },

  // Tarjeta principal de cada equipo
  teamCard: { backgroundColor: '#111111', borderWidth: 1, borderColor: '#1f1f1f', borderRadius: 10, padding: 12 },
  teamHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  teamIdBadge: { backgroundColor: '#1a2936', color: '#38bdf8', fontSize: 10, fontWeight: 'bold', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: '#0369a1' },
  teamName: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', flex: 1 },
  teamFunction: { color: '#888', fontSize: 11, marginBottom: 10, lineHeight: 15 },

  // Sección de integrantes
  membersContainer: { backgroundColor: '#0c0c0c', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 10 },
  membersTitle: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#151515' },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  memberIdText: { color: '#777', fontSize: 10, fontFamily: 'monospace' },
  memberName: { color: '#fff', fontSize: 11, fontWeight: '600' },
  memberRole: { color: '#888', fontSize: 10 },

  // Estado del integrante
  statusBadge: { backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.25)' },
  statusText: { color: '#38bdf8', fontSize: 9, fontWeight: 'bold' },

  // Botón interno
  actionBtn: { backgroundColor: '#161616', borderWidth: 1, borderColor: '#262626', borderRadius: 6, paddingVertical: 7, alignItems: 'center' },
  actionBtnText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },

  // Botón Volver general
  backButton: { backgroundColor: '#141414', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  backButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 }
});