const { contextBridge } = require('electron');
const Database = require('better-sqlite3');

// Crear base de datos (o abrir si existe)
const db = new Database('tareas.db');

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS asignaturas (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS secciones (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    asignatura_id INTEGER NOT NULL,
    FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id)
  );

  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    estado TEXT NOT NULL,
    fecha TEXT NOT NULL,
    importancia TEXT NOT NULL,
    seccion_id INTEGER NOT NULL,
    FOREIGN KEY (seccion_id) REFERENCES secciones(id)
  );
`);


contextBridge.exposeInMainWorld('api', {
  // Obtener todas las asignaturas
  obtenerAsignaturas: () => db.prepare('SELECT * FROM asignaturas ORDER BY nombre').all(),

  // Añadir asignatura
  añadirAsignatura: (nombre) => {
    const stmt = db.prepare('INSERT INTO asignaturas (nombre) VALUES (?)');
    return stmt.run(nombre).lastInsertRowid;
  },

  // Obtener secciones de una asignatura
  obtenerSecciones: (asignaturaId) => {
    const stmt = db.prepare('SELECT * FROM secciones WHERE asignatura_id = ? ORDER BY nombre');
    return stmt.all(asignaturaId);
  },

  // Añadir sección a una asignatura
  añadirSeccion: (nombre, asignaturaId) => {
    const stmt = db.prepare('INSERT INTO secciones (nombre, asignatura_id) VALUES (?, ?)');
    return stmt.run(nombre, asignaturaId).lastInsertRowid;
  },

  // Obtener tareas de una sección
  obtenerTareasDeSeccion: (seccionId) => {
    const stmt = db.prepare('SELECT * FROM tareas WHERE seccion_id = ? ORDER BY fecha');
    return stmt.all(seccionId);
  },

  // Añadir tarea a una sección
  añadirTarea: (nombre, estado, fecha, importancia, seccionId) => {
    const stmt = db.prepare(`
      INSERT INTO tareas (nombre, estado, fecha, importancia, seccion_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(nombre, estado, fecha, importancia, seccionId).lastInsertRowid;
  },

  // Obtener todas las tareas (opcional)
  obtenerTareas: () => {
    const stmt = db.prepare('SELECT * FROM tareas ORDER BY fecha');
    return stmt.all();
  }
});
