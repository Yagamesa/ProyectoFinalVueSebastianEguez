<script setup>
import { isLogin } from '@/services/authService';

const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">

      <router-link to="/" class="navbar-brand">TODO</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <!-- MENÚ PRINCIPAL -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <li class="nav-item">
            <router-link to="/usuarios" class="nav-link">Usuarios</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/notes" class="nav-link">Notas</router-link>
          </li>

          <!-- 🔥 NUEVO -->
          <li class="nav-item">
            <router-link to="/docentes" class="nav-link">Docentes</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/materias" class="nav-link">Materias</router-link>
          </li>

        </ul>

        <!-- LOGIN / LOGOUT -->
        <div>
          <div v-if="isLogin()">
            <span class="me-2">Usuario</span>
            <button class="btn btn-outline-danger btn-sm" @click="logout">
              Cerrar sesión
            </button>
          </div>

          <div v-else>
            <router-link to="/login" class="nav-link">
              Iniciar sesión
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </nav>
</template>