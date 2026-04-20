<template>
  <div class="auth-layout">

    <!-- Left panel (decorativo) -->
    <div class="auth-left">
      <div class="brand">
        <div class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <span class="brand-name">EduApp</span>
      </div>
      <div class="left-content">
        <h2 class="left-title">Creá tu cuenta y empezá ahora</h2>
        <p class="left-desc">Registrate para acceder al sistema de gestión académica.</p>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>Acceso inmediato tras el registro</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>Panel de gestión completo</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>Tus datos siempre protegidos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel (formulario) -->
    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Crear cuenta</h1>
          <p class="auth-subtitle">Completá los datos para registrarte</p>
        </div>

        <div class="alert-error" v-if="error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <div class="alert-success" v-if="exito">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Cuenta creada correctamente. Redirigiendo...
        </div>

        <div class="form-body">
          <div class="form-field">
            <label class="field-label">Nombre completo</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input v-model="nombre" type="text" class="field-input" placeholder="Juan Pérez" />
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">Correo electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input v-model="email" type="email" class="field-input" placeholder="tu@email.com" />
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="password" type="password" class="field-input" placeholder="Mínimo 6 caracteres" @keyup.enter="registrar" />
            </div>
          </div>

          <!-- Password strength indicator -->
          <div class="password-strength" v-if="password.length > 0">
            <div class="strength-bar">
              <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPercent + '%' }"></div>
            </div>
            <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
          </div>

          <button class="btn-submit" @click="registrar" :disabled="cargando">
            <span v-if="cargando" class="spinner"></span>
            <span v-else>Crear cuenta</span>
          </button>
        </div>

        <p class="auth-footer">
          ¿Ya tenés cuenta?
          <router-link to="/login" class="auth-link">Iniciá sesión</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router   = useRouter()
const nombre   = ref('')
const email    = ref('')
const password = ref('')
const error    = ref('')
const exito    = ref(false)
const cargando = ref(false)

// Indicador de fuerza de contraseña
const strengthPercent = computed(() => {
  const p = password.value
  if (p.length === 0) return 0
  if (p.length < 4)   return 25
  if (p.length < 6)   return 50
  if (p.length < 10)  return 75
  return 100
})
const strengthLabel = computed(() => {
  const s = strengthPercent.value
  if (s <= 25)  return 'Muy débil'
  if (s <= 50)  return 'Débil'
  if (s <= 75)  return 'Aceptable'
  return 'Segura'
})
const strengthClass = computed(() => {
  const s = strengthPercent.value
  if (s <= 25)  return 'strength-low'
  if (s <= 50)  return 'strength-mid'
  if (s <= 75)  return 'strength-ok'
  return 'strength-high'
})

async function registrar() {
  error.value    = ''
  cargando.value = true
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
    })
    exito.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch {
    error.value = 'No se pudo completar el registro. El email ya puede estar en uso.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* ─── misma base que LoginView ─────────────────────────────────────────────── */
.auth-layout {
  min-height: 100vh;
  display: flex;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.auth-left {
  flex: 1;
  background: #4f46e5;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
}
.brand-name { font-size: 1.25rem; font-weight: 700; color: #fff; }
.left-content {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; max-width: 380px;
}
.left-title { font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 0.875rem; line-height: 1.3; }
.left-desc  { font-size: 1rem; color: rgba(255,255,255,0.75); margin: 0 0 2rem; line-height: 1.6; }
.feature-list { display: flex; flex-direction: column; gap: 0.875rem; }
.feature-item {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.9375rem; color: rgba(255,255,255,0.85);
}
.feature-dot { width: 8px; height: 8px; background: #a5b4fc; border-radius: 50%; flex-shrink: 0; }

.auth-right {
  width: 480px; background: #f9fafb;
  display: flex; align-items: center; justify-content: center; padding: 2rem;
}
.auth-card {
  width: 100%; max-width: 380px;
  background: #fff; border-radius: 16px;
  border: 1px solid #e5e7eb; padding: 2.25rem 2rem;
}
.auth-header { margin-bottom: 1.75rem; }
.auth-title { font-size: 1.375rem; font-weight: 700; color: #111827; margin: 0 0 0.375rem; }
.auth-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0; }

.alert-error {
  display: flex; align-items: center; gap: 8px;
  background: #fff0f0; border: 1px solid #fecaca;
  border-radius: 8px; padding: 0.625rem 0.875rem;
  font-size: 0.8125rem; color: #dc2626; margin-bottom: 1.25rem;
}
.alert-success {
  display: flex; align-items: center; gap: 8px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 8px; padding: 0.625rem 0.875rem;
  font-size: 0.8125rem; color: #16a34a; margin-bottom: 1.25rem;
}

.form-body  { display: flex; flex-direction: column; gap: 1.125rem; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 0.8125rem; font-weight: 500; color: #374151; }
.input-wrapper { position: relative; }
.input-icon {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%); color: #9ca3af; pointer-events: none;
}
.field-input {
  width: 100%; border: 1px solid #d1d5db; border-radius: 9px;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  font-size: 0.875rem; color: #111827; background: #fff;
  outline: none; box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129,140,248,0.15);
}

/* Password strength */
.password-strength {
  display: flex; align-items: center; gap: 10px; margin-top: -4px;
}
.strength-bar {
  flex: 1; height: 4px; background: #e5e7eb; border-radius: 4px; overflow: hidden;
}
.strength-fill {
  height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s;
}
.strength-label { font-size: 0.75rem; font-weight: 500; white-space: nowrap; }
.strength-low  { background: #ef4444; color: #ef4444; }
.strength-mid  { background: #f97316; color: #f97316; }
.strength-ok   { background: #eab308; color: #ca8a04; }
.strength-high { background: #22c55e; color: #16a34a; }

.btn-submit {
  width: 100%; background: #4f46e5; color: #fff;
  border: none; border-radius: 9px; padding: 0.6875rem;
  font-size: 0.9375rem; font-weight: 600; cursor: pointer;
  margin-top: 0.25rem;
  transition: background 0.15s, transform 0.1s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-submit:hover:not(:disabled) { background: #4338ca; }
.btn-submit:active:not(:disabled) { transform: scale(0.99); }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.auth-footer {
  text-align: center; font-size: 0.875rem; color: #6b7280; margin: 1.375rem 0 0;
}
.auth-link { color: #4f46e5; font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }

@media (max-width: 720px) {
  .auth-layout { flex-direction: column; }
  .auth-left { padding: 1.75rem 1.5rem; flex: none; }
  .left-content { display: none; }
  .auth-right { width: 100%; padding: 1.5rem 1rem; }
  .auth-card { padding: 1.75rem 1.5rem; }
}
</style>