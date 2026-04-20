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
        <h2 class="left-title">Gestión académica simple y eficiente</h2>
        <p class="left-desc">Administrá docentes, materias y notas desde un solo lugar.</p>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>CRUD completo de entidades</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>Relación entre docentes y materias</span>
          </div>
          <div class="feature-item">
            <div class="feature-dot"></div>
            <span>Acceso seguro con autenticación</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel (formulario) -->
    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Iniciar sesión</h1>
          <p class="auth-subtitle">Ingresá tus credenciales para continuar</p>
        </div>

        <div class="alert-error" v-if="error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <div class="form-body">
          <div class="form-field">
            <label class="field-label">Correo electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input v-model="email" type="email" class="field-input" placeholder="tu@email.com" @keyup.enter="login" />
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="password" type="password" class="field-input" placeholder="••••••••" @keyup.enter="login" />
            </div>
          </div>

          <button class="btn-submit" @click="login" :disabled="cargando">
            <span v-if="cargando" class="spinner"></span>
            <span v-else>Ingresar</span>
          </button>
        </div>

        <p class="auth-footer">
          ¿No tenés cuenta?
          <router-link to="/register" class="auth-link">Registrate</router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router   = useRouter()
const email    = ref('')
const password = ref('')
const error    = ref('')
const cargando = ref(false)

async function login() {
  error.value    = ''
  cargando.value = true
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email: email.value,
      password: password.value,
    })
    localStorage.setItem('token', res.data.accessToken)
    router.push('/')
  } catch {
    error.value = 'Credenciales incorrectas. Verificá tu email y contraseña.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Layout dividido */
.auth-layout {
  min-height: 100vh;
  display: flex;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Panel izquierdo */
.auth-left {
  flex: 1;
  background: #4f46e5;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-icon {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}
.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 380px;
}
.left-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.875rem;
  line-height: 1.3;
}
.left-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.75);
  margin: 0 0 2rem;
  line-height: 1.6;
}
.feature-list { display: flex; flex-direction: column; gap: 0.875rem; }
.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  color: rgba(255,255,255,0.85);
}
.feature-dot {
  width: 8px; height: 8px;
  background: #a5b4fc;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Panel derecho */
.auth-right {
  width: 480px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.auth-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  padding: 2.25rem 2rem;
}
.auth-header { margin-bottom: 1.75rem; }
.auth-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem;
}
.auth-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Error alert */
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff0f0;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  color: #dc2626;
  margin-bottom: 1.25rem;
}

/* Form */
.form-body { display: flex; flex-direction: column; gap: 1.125rem; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}
.input-wrapper { position: relative; }
.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}
.field-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  color: #111827;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129,140,248,0.15);
}

/* Submit */
.btn-submit {
  width: 100%;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 0.6875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.25rem;
  transition: background 0.15s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

/* Footer */
.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin: 1.375rem 0 0;
}
.auth-link {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 720px) {
  .auth-layout { flex-direction: column; }
  .auth-left {
    padding: 1.75rem 1.5rem;
    flex: none;
  }
  .left-content { display: none; }
  .auth-right { width: 100%; padding: 1.5rem 1rem; }
  .auth-card { padding: 1.75rem 1.5rem; }
}
</style>