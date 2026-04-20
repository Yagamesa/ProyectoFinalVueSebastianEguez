<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Docentes</h1>
          <p class="page-subtitle">Gestión del cuerpo docente</p>
        </div>
      </div>
      <button class="btn-primary" @click="mostrarFormulario = !mostrarFormulario">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo docente
      </button>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-number">{{ docentes.length }}</span>
        <span class="stat-label">Total docentes</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-number">{{ docentes.filter(d => d.activo).length }}</span>
        <span class="stat-label">Activos</span>
      </div>
    </div>

    <!-- Form panel -->
    <Transition name="slide">
      <div v-if="mostrarFormulario" class="form-panel">
        <div class="form-panel-header">
          <h2 class="form-panel-title">{{ editando ? 'Editar docente' : 'Registrar nuevo docente' }}</h2>
          <button class="btn-close" @click="cancelar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label class="field-label">Nombre completo</label>
            <input v-model="form.nombre" type="text" class="field-input" placeholder="Ej: Juan Pérez" />
          </div>
          <div class="form-field">
            <label class="field-label">Especialidad</label>
            <input v-model="form.especialidad" type="text" class="field-input" placeholder="Ej: Matemáticas" />
          </div>
          <div class="form-field">
            <label class="field-label">Email</label>
            <input v-model="form.email" type="email" class="field-input" placeholder="docente@universidad.edu" />
          </div>
          <div class="form-field">
            <label class="field-label">Teléfono</label>
            <input v-model="form.telefono" type="text" class="field-input" placeholder="Ej: 7X000000" />
          </div>
        </div>

        <div class="form-check-row">
          <label class="check-label">
            <input v-model="form.activo" type="checkbox" class="check-input" />
            <span class="check-text">Docente activo</span>
          </label>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="cancelar">Cancelar</button>
          <button class="btn-primary" @click="guardar">
            {{ editando ? 'Actualizar' : 'Registrar' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Search -->
    <div class="search-bar">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input v-model="busqueda" type="text" class="search-input" placeholder="Buscar docente por nombre o especialidad..." />
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="data-table" v-if="docentesFiltrados.length > 0">
        <thead>
          <tr>
            <th>Docente</th>
            <th>Especialidad</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="docente in docentesFiltrados" :key="docente.id" class="table-row">
            <td>
              <div class="docente-cell">
                <div class="avatar">{{ iniciales(docente.nombre) }}</div>
                <span class="docente-nombre">{{ docente.nombre }}</span>
              </div>
            </td>
            <td>
              <span class="tag">{{ docente.especialidad || '—' }}</span>
            </td>
            <td class="text-muted">{{ docente.email || '—' }}</td>
            <td>
              <span :class="['status-badge', docente.activo ? 'status-active' : 'status-inactive']">
                {{ docente.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <router-link :to="`/docentes/${docente.id}`" class="btn-icon btn-view" title="Ver detalle">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Ver
                </router-link>
                <button class="btn-icon btn-edit" @click="editar(docente)" title="Editar">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar
                </button>
                <button class="btn-icon btn-delete" @click="eliminar(docente.id)" title="Eliminar">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p class="empty-title">No se encontraron docentes</p>
        <p class="empty-subtitle">{{ busqueda ? 'Intenta con otro término de búsqueda' : 'Registra el primer docente para comenzar' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// ─── LÓGICA ORIGINAL (sin cambios) ───────────────────────────────────────────

const docentes = ref([])
const mostrarFormulario = ref(false)
const editando = ref(false)
const busqueda = ref('')

const form = ref({
  nombre: '',
  especialidad: '',
  email: '',
  telefono: '',
  activo: true,
})

const docentesFiltrados = computed(() => {
  if (!busqueda.value) return docentes.value
  const q = busqueda.value.toLowerCase()
  return docentes.value.filter(d =>
    d.nombre?.toLowerCase().includes(q) ||
    d.especialidad?.toLowerCase().includes(q)
  )
})

async function cargarDocentes() {
  const token = localStorage.getItem('token')
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/docentes`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  docentes.value = res.data
}

async function guardar() {
  const token = localStorage.getItem('token')
  if (editando.value) {
    await axios.put(`${import.meta.env.VITE_API_URL}/docentes/${form.value.id}`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } else {
    await axios.post(`${import.meta.env.VITE_API_URL}/docentes`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }
  cancelar()
  await cargarDocentes()
}

async function eliminar(id) {
  if (!confirm('¿Deseas eliminar este docente?')) return
  const token = localStorage.getItem('token')
  await axios.delete(`${import.meta.env.VITE_API_URL}/docentes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  await cargarDocentes()
}

function editar(docente) {
  form.value = { ...docente }
  editando.value = true
  mostrarFormulario.value = true
}

function cancelar() {
  form.value = { nombre: '', especialidad: '', email: '', telefono: '', activo: true }
  editando.value = false
  mostrarFormulario.value = false
}

// ─── HELPERS UI ──────────────────────────────────────────────────────────────

function iniciales(nombre) {
  if (!nombre) return '?'
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase()
}

onMounted(cargarDocentes)
</script>

<style scoped>
/* ─── Layout ──────────────────────────────────────────────────────────────── */
.page-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ─── Header ──────────────────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}
.header-icon {
  width: 44px;
  height: 44px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.page-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}
.page-subtitle {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

/* ─── Stats bar ───────────────────────────────────────────────────────────── */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  margin-bottom: 1.5rem;
}
.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-number {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}
.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
}
.stat-divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover { background: #4338ca; }
.btn-primary:active { transform: scale(0.98); }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-secondary:hover { background: #f3f4f6; }

.btn-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}
.btn-close:hover { background: #f3f4f6; color: #374151; }

/* ─── Form panel ──────────────────────────────────────────────────────────── */
.form-panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.form-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.form-panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}
.field-input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;
}
.field-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129,140,248,0.15);
}
.form-check-row {
  margin-top: 0.875rem;
}
.check-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.check-input {
  width: 16px;
  height: 16px;
  accent-color: #4f46e5;
  cursor: pointer;
}
.check-text {
  font-size: 0.875rem;
  color: #374151;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f3f4f6;
}

/* ─── Search ──────────────────────────────────────────────────────────────── */
.search-bar {
  position: relative;
  margin-bottom: 1rem;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;
  font-size: 0.875rem;
  color: #111827;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129,140,248,0.1);
}

/* ─── Table ───────────────────────────────────────────────────────────────── */
.table-wrapper {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table thead {
  background: #f9fafb;
}
.data-table th {
  padding: 0.75rem 1.125rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e5e7eb;
}
.data-table td {
  padding: 0.875rem 1.125rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}
.table-row:last-child td { border-bottom: none; }
.table-row:hover { background: #fafafa; }

.docente-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.avatar {
  width: 34px;
  height: 34px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}
.docente-nombre {
  font-weight: 500;
  color: #111827;
}
.text-muted { color: #9ca3af; }

.tag {
  background: #f3f4f6;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
}
.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}
.status-active  { background: #dcfce7; color: #16a34a; }
.status-inactive { background: #fee2e2; color: #dc2626; }

/* ─── Action buttons ──────────────────────────────────────────────────────── */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  text-decoration: none;
}
.btn-view    { background: #f0fdf4; color: #16a34a; border-color: #dcfce7; }
.btn-view:hover { background: #dcfce7; }
.btn-edit    { background: #eef2ff; color: #4f46e5; border-color: #e0e7ff; }
.btn-edit:hover { background: #e0e7ff; }
.btn-delete  { background: #fff0f0; color: #dc2626; border-color: #fee2e2; }
.btn-delete:hover { background: #fee2e2; }

/* ─── Empty state ─────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 1rem;
  gap: 0.5rem;
}
.empty-icon { color: #d1d5db; margin-bottom: 0.5rem; }
.empty-title { font-size: 0.9375rem; font-weight: 600; color: #374151; margin: 0; }
.empty-subtitle { font-size: 0.8125rem; color: #9ca3af; margin: 0; }

/* ─── Transition ──────────────────────────────────────────────────────────── */
.slide-enter-active,
.slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from,
.slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* ─── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .data-table th:nth-child(3),
  .data-table td:nth-child(3) { display: none; }
  .page-title { font-size: 1.125rem; }
  .btn-icon span { display: none; }
}
</style>