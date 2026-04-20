<script setup>
import appMemory from '@/services/appMemory'
</script>

<template>
  <div class="home-wrapper">

    <!-- Header -->
    <div class="home-header">
      <h1 class="home-title">Bienvenido, {{ appMemory.get('userName') || 'Usuario' }}</h1>
      <p class="home-subtitle">Panel de gestión académica</p>
    </div>

    <!-- Cards principales -->
    <div class="cards-grid">

      <router-link to="/usuarios" class="home-card card-blue">
        <div class="card-icon">
          👤
        </div>
        <h2>Usuarios</h2>
        <p>Administrar usuarios del sistema</p>
      </router-link>

      <router-link to="/notes" class="home-card card-purple">
        <div class="card-icon">
          📝
        </div>
        <h2>Notas</h2>
        <p>Gestionar tareas o apuntes</p>
      </router-link>

      <router-link to="/docentes" class="home-card card-indigo">
        <div class="card-icon">
          🎓
        </div>
        <h2>Docentes</h2>
        <p>Gestión del personal docente</p>
      </router-link>

      <router-link to="/materias" class="home-card card-green">
        <div class="card-icon">
          📚
        </div>
        <h2>Materias</h2>
        <p>Administrar materias académicas</p>
      </router-link>

    </div>

    <!-- Info adicional -->
    <div class="home-info">
      <h3>Resumen del sistema</h3>
      <p>
        Este sistema permite gestionar usuarios, notas, docentes y materias.
        Incluye autenticación, relaciones entre entidades y funcionalidades CRUD completas.
      </p>
    </div>

  </div>
</template>

<style scoped>

/* Layout */
.home-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Header */
.home-header {
  margin-bottom: 2rem;
}
.home-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.home-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

/* Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

/* Cards */
.home-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border-radius: 12px;
  text-decoration: none;
  color: #111827;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: transform 0.15s, box-shadow 0.15s;
}
.home-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

/* Icon */
.card-icon {
  font-size: 1.5rem;
}

/* Colores */
.card-blue    { border-left: 4px solid #3b82f6; }
.card-purple  { border-left: 4px solid #8b5cf6; }
.card-indigo  { border-left: 4px solid #4f46e5; }
.card-green   { border-left: 4px solid #10b981; }

/* Info box */
.home-info {
  margin-top: 2rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
}
.home-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
.home-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .home-title {
    font-size: 1.25rem;
  }
}

</style>