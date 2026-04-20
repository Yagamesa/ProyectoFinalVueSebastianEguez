# EduApp — Proyecto Final Vue 3

Aplicación web de gestión académica desarrollada con **Vue 3 + Vite**, con autenticación, CRUD completo, relaciones entre entidades y diseño responsivo.

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Vue 3 (Composition API) | Framework principal |
| Vue Router | Navegación y rutas protegidas |
| Axios | Consumo de API REST |
| JSON Server + JSON Server Auth | Backend simulado con autenticación |
| Vite | Bundler y entorno de desarrollo |
| CSS Scoped | Estilos por componente |

---

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Yagamesa/ProyectoFinalVueSebastianEguez
cd <nombre-del-proyecto>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar el backend (JSON Server Auth)

En una terminal separada, ejecutar:

```bash
npx json-server-auth db.json --port 3000
```

> El archivo `db.json` ya está incluido en el proyecto con datos de ejemplo.

### 5. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## Estructura del proyecto

```
src/
├── components/
│    └── menu.vue            # Navbar principal
├── views/
│    ├── LoginView.vue        # Inicio de sesión
│    ├── RegisterView.vue     # Registro de usuario
│    ├── HomeView.vue         # Dashboard principal
│    ├── note/
│    │    └── NoteList.vue    # CRUD de notas
│    ├── user/
│    │    ├── UserList.vue    # CRUD de usuarios
│    │    └── UserNote.vue    # Notas por usuario
│    ├── docente/
│    │    ├── DocentesView.vue    # CRUD de docentes
│    │    └── DocenteDetail.vue  # Detalle (ruta dinámica)
│    └── materia/
│         └── MateriasView.vue   # CRUD de materias
├── router/
│    └── index.js            # Rutas y protección
├── services/
│    └── authService.js      # Lógica de autenticación
└── App.vue
```

---

## Funcionalidades implementadas

### Autenticación
- Registro de nuevo usuario
- Inicio de sesión con token JWT
- Cierre de sesión
- Protección de rutas privadas (redirige a `/login` si no hay token)

### CRUD completo
Todas las entidades tienen Crear, Leer, Actualizar y Eliminar:

- **Usuarios** — gestión de cuentas
- **Notas** — notas/tareas por usuario
- **Docentes** — cuerpo docente con estado activo/inactivo
- **Materias** — asignaturas con relación a docentes

### Relaciones entre entidades
- Cada **materia** pertenece a un **docente** (campo `docenteId`)
- Al crear/editar una materia se selecciona el docente desde un `<select>`
- En el detalle del docente se listan todas sus materias asignadas

### Rutas dinámicas
- `/docentes/:id` — vista de detalle de un docente con sus materias

### Filtros y buscadores
- Buscador por nombre en Docentes y Materias
- Filtro por docente asignado en Materias

### Variables de entorno
- URL del backend configurada en `.env` como `VITE_API_URL`

---

## Entidades (db.json)

### users
```json
{
  "id": 1,
  "nombre": "Admin",
  "email": "admin@test.com",
  "password": "admin123"
}
```

### docentes
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "especialidad": "Matemáticas",
  "email": "jperez@edu.com",
  "telefono": "70000001",
  "activo": true
}
```

### materias
```json
{
  "id": 1,
  "nombre": "Álgebra Lineal",
  "codigo": "MAT-201",
  "creditos": 4,
  "descripcion": "Vectores, matrices y transformaciones lineales.",
  "docenteId": 1
}
```

### notes
```json
{
  "id": 1,
  "title": "Tarea pendiente",
  "content": "Revisar parcial",
  "userId": 1
}
```

---

## Credenciales de prueba

Una vez iniciado el servidor, podés registrarte directamente desde la app o usar las credenciales del `db.json` de ejemplo.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Previsualiza la build generada |
