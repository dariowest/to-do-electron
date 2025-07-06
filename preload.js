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

  CREATE TABLE IF NOT EXISTS examenes (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    asignatura_id INTEGER NOT NULL,
    FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id)
  );

  CREATE TABLE IF NOT EXISTS practicas (
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
    examen_id INTEGER,
    practica_id INTEGER,
    FOREIGN KEY (examen_id) REFERENCES examenes(id),
    FOREIGN KEY (practica_id) REFERENCES practicas(id)
  );
`);

// Exponer API al renderer
contextBridge.exposeInMainWorld('api', {
  // Obtener todas las asignaturas
  obtenerAsignaturas: () => db.prepare('SELECT * FROM asignaturas').all(),

  // Añadir asignatura
  añadirAsignatura: (nombre) => {
    const stmt = db.prepare('INSERT INTO asignaturas (nombre) VALUES (?)');
    return stmt.run(nombre).lastInsertRowid;
  },

  // Obtener examenes de una asignatura
  obtenerExamenes: (asignaturaId) => {
    const stmt = db.prepare('SELECT * FROM examenes WHERE asignatura_id = ?');
    return stmt.all(asignaturaId);
  },

  // Obtener prácticas de una asignatura
  obtenerPracticas: (asignaturaId) => {
    const stmt = db.prepare('SELECT * FROM practicas WHERE asignatura_id = ?');
    return stmt.all(asignaturaId);
  },

  // Obtener tareas de un examen
  obtenerTareasDeExamen: (examenId) => {
    const stmt = db.prepare('SELECT * FROM tareas WHERE examen_id = ?');
    return stmt.all(examenId);
  },

  // Obtener tareas de una práctica
  obtenerTareasDePractica: (practicaId) => {
    const stmt = db.prepare('SELECT * FROM tareas WHERE practica_id = ?');
    return stmt.all(practicaId);
  },

  // Añadir tarea a examen
  añadirTareaExamen: (nombre, estado, fecha, importancia, examenId) => {
    const stmt = db.prepare(`
      INSERT INTO tareas (nombre, estado, fecha, importancia, examen_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(nombre, estado, fecha, importancia, examenId).lastInsertRowid;
  },

  // Añadir tarea a práctica
  añadirTareaPractica: (nombre, estado, fecha, importancia, practicaId) => {
    const stmt = db.prepare(`
      INSERT INTO tareas (nombre, estado, fecha, importancia, practica_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(nombre, estado, fecha, importancia, practicaId).lastInsertRowid;
  }
});
