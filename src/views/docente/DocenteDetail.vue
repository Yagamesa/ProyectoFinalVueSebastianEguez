<template>
  <div class="page-wrapper">

    <!-- Back button -->
    <button class="btn-back" @click="$router.push('/docentes')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
      </svg>
      Volver a Docentes
    </button>

    <!-- Loading state -->
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando información...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p class="error-title">No se encontró el docente</p>
      <p class="error-subtitle">El docente con ID {{ $route.params.id }} no existe.</p>
    </div>

    <!-- Content -->
    <div v-else-if="docente" class="detail-layout">

      <!-- Profile card -->
      <div class="profile-card">
        <div class="avatar-lg">{{ iniciales(docente.nombre) }}</div>
        <h1 class="profile-name">{{ docente.nombre }}</h1>
        <span :class="['status-badge', docente.activo ? 'status-active' : 'status-inactive']">
          {{ docente.activo ? 'Activo' : 'Inactivo' }}
        </span>
        <div class="profile-specialty">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          {{ docente.especialidad || 'Sin especialidad' }}
        </div>
      </div>

      <!-- Info + materias -->
      <div class="detail-right">

        <!-- Contact info -->
        <div class="info-card">
          <h2 class="card-title">Información de contacto</h2>
          <div class="info-list">
            <div class="info-row">
              <div class="info-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <span class="info-label">Email</span>
                <span class="info-value">{{ docente.email || 'No registrado' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.49 2 2 0 0 1 3.6 2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
                </svg>
              </div>
              <div>
                <span class="info-label">Teléfono</span>
                <span class="info-value">{{ docente.telefono || 'No registrado' }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <span class="info-label">Especialidad</span>
                <span class="info-value">{{ docente.especialidad || 'No registrada' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Materias asignadas -->
        <div class="info-card">
          <div class="card-title-row">
            <h2 class="card-title">Materias asignadas</h2>
            <span class="count-badge">{{ materiasDelDocente.length }}</span>
          </div>

          <div v-if="materiasDelDocente.length > 0" class="materias-list">
            <div v-for="materia in materiasDelDocente" :key="materia.id" class="materia-item">
              <div class="materia-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div class="materia-info">
                <span class="materia-nombre">{{ materia.nombre }}</span>
                <div class="materia-meta">
                  <span v-if="materia.codigo" class="badge-code">{{ materia.codigo }}</span>
                  <span v-if="materia.creditos" class="badge-credits">{{ materia.creditos }} créditos</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-materias">
            <p>Este docente no tiene materias asignadas.</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const docente   = ref(null)
const materias  = ref([])
const cargando  = ref(true)
const error     = ref(false)

// Materias filtradas que pertenecen a este docente
const materiasDelDocente = computed(() =>
  materias.value.filter(m => m.docenteId == route.params.id)
)

async function cargarDatos() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const [resDocente, resMaterias] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/docentes/${route.params.id}`, { headers }),
      axios.get(`${import.meta.env.VITE_API_URL}/materias`, { headers }),
    ])
    docente.value  = resDocente.data
    materias.value = resMaterias.data
  } catch {
    error.value = true
  } finally {
    cargando.value = false
  }
}

function iniciales(nombre) {
  if (!nombre) return '?'
  return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

onMounted(cargarDatos)
</script>

<style scoped>
.page-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Back button */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  margin-bottom: 1.75rem;
  transition: background 0.15s;
}
.btn-back:hover { background: #f3f4f6; }

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: #9ca3af;
}
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 4rem 0;
  color: #9ca3af;
}
.error-title { font-size: 1rem; font-weight: 600; color: #374151; margin: 0; }
.error-subtitle { font-size: 0.875rem; margin: 0; }

/* Layout */
.detail-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.25rem;
  align-items: start;
}

/* Profile card */
.profile-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  text-align: center;
}
.avatar-lg {
  width: 72px; height: 72px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.profile-name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}
.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 20px;
}
.status-active  { background: #dcfce7; color: #16a34a; }
.status-inactive { background: #fee2e2; color: #dc2626; }

.profile-specialty {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 4px;
}

/* Info cards */
.detail-right {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.info-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.375rem 1.5rem;
}
.card-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.125rem;
}
.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1.125rem;
}
.card-title-row .card-title { margin-bottom: 0; }
.count-badge {
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 20px;
}

/* Info list */
.info-list { display: flex; flex-direction: column; gap: 0.875rem; }
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}
.info-icon {
  width: 32px; height: 32px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
  margin-top: 1px;
}
.info-label {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 1px;
}
.info-value {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

/* Materias list */
.materias-list { display: flex; flex-direction: column; gap: 0.625rem; }
.materia-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
}
.materia-icon {
  width: 32px; height: 32px;
  background: #ecfdf5;
  color: #059669;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.materia-info { display: flex; flex-direction: column; gap: 4px; }
.materia-nombre { font-size: 0.875rem; font-weight: 600; color: #111827; }
.materia-meta { display: flex; gap: 6px; align-items: center; }
.badge-code {
  background: #eff6ff; color: #2563eb;
  font-size: 0.6875rem; font-weight: 600;
  padding: 2px 8px; border-radius: 20px;
  text-transform: uppercase;
}
.badge-credits {
  background: #fef9c3; color: #854d0e;
  font-size: 0.6875rem; font-weight: 600;
  padding: 2px 8px; border-radius: 20px;
}
.empty-materias {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 660px) {
  .detail-layout { grid-template-columns: 1fr; }
  .profile-card { flex-direction: row; text-align: left; padding: 1.25rem; }
  .avatar-lg { width: 52px; height: 52px; font-size: 1rem; flex-shrink: 0; }
}
</style>