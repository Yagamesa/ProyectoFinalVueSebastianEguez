<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Materias</h1>
          <p class="page-subtitle">Gestión de asignaturas</p>
        </div>
      </div>
      <button class="btn-primary" @click="mostrarFormulario = !mostrarFormulario">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nueva materia
      </button>
    </div>

    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-number">{{ materias.length }}</span>
        <span class="stat-label">Total materias</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-number">{{ docentes.length }}</span>
        <span class="stat-label">Docentes asignados</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-number">{{ materiasConDocente }}</span>
        <span class="stat-label">Con docente asignado</span>
      </div>
    </div>

    <!-- Form panel -->
    <Transition name="slide">
      <div v-if="mostrarFormulario" class="form-panel">
        <div class="form-panel-header">
          <h2 class="form-panel-title">{{ editando ? 'Editar materia' : 'Registrar nueva materia' }}</h2>
          <button class="btn-close" @click="cancelar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label class="field-label">Nombre de la materia</label>
            <input v-model="form.nombre" type="text" class="field-input" placeholder="Ej: Álgebra Lineal" />
          </div>

          <div class="form-field">
            <label class="field-label">Código</label>
            <input v-model="form.codigo" type="text" class="field-input" placeholder="Ej: MAT-201" />
          </div>

          <div class="form-field">
            <label class="field-label">Créditos</label>
            <input v-model="form.creditos" type="number" min="1" max="10" class="field-input" placeholder="Ej: 4" />
          </div>

          <div class="form-field">
            <label class="field-label">Docente asignado</label>
            <select v-model="form.docenteId" class="field-select">
              <option value="">— Sin asignar —</option>
              <option v-for="doc in docentes" :key="doc.id" :value="doc.id">
                {{ doc.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-field full-width" style="margin-top: 1rem;">
          <label class="field-label">Descripción</label>
          <textarea v-model="form.descripcion" class="field-textarea" rows="3" placeholder="Breve descripción de la materia..."></textarea>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="cancelar">Cancelar</button>
          <button class="btn-primary" @click="guardar">
            {{ editando ? 'Actualizar' : 'Registrar' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Filters -->
    <div class="filters-row">
      <div class="search-bar">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="busqueda" type="text" class="search-input" placeholder="Buscar materia..." />
      </div>

      <select v-model="filtroDocente" class="filter-select">
        <option value="">Todos los docentes</option>
        <option v-for="doc in docentes" :key="doc.id" :value="doc.id">{{ doc.nombre }}</option>
      </select>
    </div>

    <!-- Cards grid -->
    <div v-if="materiasFiltradas.length > 0" class="cards-grid">
      <div
        v-for="materia in materiasFiltradas"
        :key="materia.id"
        class="materia-card"
      >
        <div class="card-top">
          <div class="card-header-row">
            <div class="materia-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div class="card-badges">
              <span v-if="materia.codigo" class="badge-code">{{ materia.codigo }}</span>
              <span v-if="materia.creditos" class="badge-credits">{{ materia.creditos }} cr.</span>
            </div>
          </div>

          <h3 class="materia-nombre">{{ materia.nombre }}</h3>

          <p v-if="materia.descripcion" class="materia-desc">{{ materia.descripcion }}</p>
        </div>

        <div class="card-footer">
          <div class="docente-info">
            <template v-if="getDocente(materia.docenteId)">
              <div class="avatar-sm">{{ iniciales(getDocente(materia.docenteId)?.nombre) }}</div>
              <span class="docente-name">{{ getDocente(materia.docenteId)?.nombre }}</span>
            </template>
            <template v-else>
              <span class="no-docente">Sin docente asignado</span>
            </template>
          </div>

          <div class="card-actions">
            <button class="btn-icon btn-edit" @click="editar(materia)" title="Editar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon btn-delete" @click="eliminar(materia.id)" title="Eliminar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      <p class="empty-title">No se encontraron materias</p>
      <p class="empty-subtitle">{{ busqueda ? 'Intenta con otro término' : 'Registra la primera materia para comenzar' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// ─── LÓGICA ORIGINAL (sin cambios) ───────────────────────────────────────────

const materias = ref([])
const docentes = ref([])
const mostrarFormulario = ref(false)
const editando = ref(false)
const busqueda = ref('')
const filtroDocente = ref('')

const form = ref({
  nombre: '',
  codigo: '',
  creditos: '',
  descripcion: '',
  docenteId: '',
})

const materiasFiltradas = computed(() => {
  return materias.value.filter(m => {
    const q = busqueda.value.toLowerCase()
    const matchBusqueda = !q || m.nombre?.toLowerCase().includes(q) || m.codigo?.toLowerCase().includes(q)
    const matchDocente = !filtroDocente.value || m.docenteId == filtroDocente.value
    return matchBusqueda && matchDocente
  })
})

const materiasConDocente = computed(() =>
  materias.value.filter(m => m.docenteId).length
)

async function cargarMaterias() {
  const token = localStorage.getItem('token')
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/materias`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  materias.value = res.data
}

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
    await axios.put(`${import.meta.env.VITE_API_URL}/materias/${form.value.id}`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } else {
    await axios.post(`${import.meta.env.VITE_API_URL}/materias`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }
  cancelar()
  await cargarMaterias()
}

async function eliminar(id) {
  if (!confirm('¿Deseas eliminar esta materia?')) return
  const token = localStorage.getItem('token')
  await axios.delete(`${import.meta.env.VITE_API_URL}/materias/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  await cargarMaterias()
}

function editar(materia) {
  form.value = { ...materia }
  editando.value = true
  mostrarFormulario.value = true
}

function cancelar() {
  form.value = { nombre: '', codigo: '', creditos: '', descripcion: '', docenteId: '' }
  editando.value = false
  mostrarFormulario.value = false
}

function getDocente(id) {
  return docentes.value.find(d => d.id == id)
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

onMounted(async () => {
  await cargarDocentes()
  await cargarMaterias()
})
</script>

<style scoped>
/* ─── Layout ──────────────────────────────────────────────────────────────── */
.page-wrapper {
  max-width: 1060px;
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
  background: #ecfdf5;
  color: #059669;
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
  flex-wrap: wrap;
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
  background: #059669;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover { background: #047857; }
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
.field-input,
.field-select,
.field-textarea {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
}
.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  border-color: #6ee7b7;
  box-shadow: 0 0 0 3px rgba(52,211,153,0.15);
}
.field-textarea { resize: vertical; min-height: 80px; }
.field-select { appearance: auto; }
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f3f4f6;
}

/* ─── Filters ─────────────────────────────────────────────────────────────── */
.filters-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.search-bar {
  position: relative;
  flex: 1;
  min-width: 200px;
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
  border-color: #6ee7b7;
  box-shadow: 0 0 0 3px rgba(52,211,153,0.1);
}
.filter-select {
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #374151;
  background: #fff;
  outline: none;
  cursor: pointer;
  min-width: 180px;
  transition: border-color 0.15s;
}
.filter-select:focus { border-color: #6ee7b7; }

/* ─── Cards grid ──────────────────────────────────────────────────────────── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.materia-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
}
.materia-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  transform: translateY(-2px);
}
.card-top {
  padding: 1.125rem 1.125rem 0.875rem;
  flex: 1;
}
.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.materia-icon {
  width: 36px;
  height: 36px;
  background: #ecfdf5;
  color: #059669;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-badges {
  display: flex;
  gap: 6px;
  align-items: center;
}
.badge-code {
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.badge-credits {
  background: #fef9c3;
  color: #854d0e;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}
.materia-nombre {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.375rem;
  line-height: 1.3;
}
.materia-desc {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── Card footer ─────────────────────────────────────────────────────────── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.125rem;
  border-top: 1px solid #f3f4f6;
  background: #fafafa;
  gap: 0.5rem;
}
.docente-info {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.avatar-sm {
  width: 26px;
  height: 26px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  flex-shrink: 0;
}
.docente-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.no-docente {
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}
.card-actions {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 7px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
}
.btn-edit { background: #eef2ff; color: #4f46e5; border-color: #e0e7ff; }
.btn-edit:hover { background: #e0e7ff; }
.btn-delete { background: #fff0f0; color: #dc2626; border-color: #fee2e2; }
.btn-delete:hover { background: #fee2e2; }

/* ─── Empty state ─────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 1rem;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
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
  .cards-grid { grid-template-columns: 1fr; }
  .filters-row { flex-direction: column; }
  .filter-select { width: 100%; }
}
</style>