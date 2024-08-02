const mysql = require('mysql2');
const dotenv = require('dotenv');
const e = require('cors');

dotenv.config();

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 20, // El valor de las conexiones
    queueLimit: 0, // No limitar el número de solicitudes en espera
    acquireTimeout: 10000 // Tiempo de espera para obtener una conexión (en milisegundos)
});

// Promesas para facilitar el uso de async/await
const poolPromise = pool.promise();

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    constructor() {
        this.pool = poolPromise;
    }

    async query(query, params = []) {
        try {
            const [results] = await this.pool.query(query, params);
            return results;
        } catch (error) {
            console.error('Error en la consulta:', error);
            throw error;
        }
    }

    async getAllData() {
        try {
            const results = await this.query("SELECT * FROM carrera_iti");
            for (let i = 0; i < results.length; i++) {
                const usuarioResult = await this.query(`SELECT email FROM usuarios WHERE nombre = ?`, [results[i].nombre]);
                const estadisticasResult = await this.query(`SELECT carrera FROM estadisticas WHERE id = ?`, [results[i].id_estadistica]);

                results[i].email = usuarioResult[0]?.email;
                results[i].carrera = estadisticasResult[0]?.nombre_carrera;
            }
            return results;
        } catch (error) {
            console.error(error);
        }
    }
    async getPromedio() {
        try {
            const results = await this.query("SELECT email, carrera, promedio, DATE_FORMAT(fecha, '%d-%m-%Y') as fecha_formateada FROM promedios ORDER BY promedio DESC");
            return results;
        } catch (error) {
            console.error(error);
        }
    }  
    async getCarreraITI() {
        try {
            const results = await this.query(
                "SELECT c.email, c.puntuacion_logico, c.puntuacion_progra, c.puntuacion_idioma, c.puntuacion_matematico, p.promedio,DATE_FORMAT(p.fecha, '%d-%m-%Y') as fecha_formateada FROM  carrera_iti c INNER JOIN promedios p ON c.email = p.email WHERE p.carrera = 'TECNOLOGÍAS DE INFORMACIÓN' ORDER BY promedio DESC;"
            );
            return results;
        } catch (error) {
            console.error(error);
        }
    }
    async getCarreraAGRO() {
        try {
            const results = await this.query(
                "SELECT c.email, c.puntuacion_agro, c.puntuacion_ciencias, c.puntuacion_ingles, c.puntuacion_mate, p.promedio,DATE_FORMAT(p.fecha, '%d-%m-%Y') as fecha_formateada FROM  carrera_agro c INNER JOIN promedios p ON c.email = p.email WHERE p.carrera = 'AGRONOMÍA' ORDER BY promedio DESC;"
            );
            return results;
        } catch (error) {
            console.error(error);
        }
    }  
    async getCarreraILE() {
        try {
            const results = await this.query(
                "SELECT c.email, c.puntuacion_idioma, p.promedio,DATE_FORMAT(p.fecha, '%d-%m-%Y') as fecha_formateada FROM  carrera_ext c INNER JOIN promedios p ON c.email = p.email WHERE p.carrera = 'AGRONOMÍA' ORDER BY promedio DESC;"
            );
            return results;
        } catch (error) {
            console.error(error);
        }
    }    
    async getCarreraGEC() {
        try {
            const results = await this.query(
                "SELECT c.email, c.puntuacion_act, p.promedio,DATE_FORMAT(p.fecha, '%d-%m-%Y') as fecha_formateada FROM  carrera_gec c INNER JOIN promedios p ON c.email = p.email WHERE p.carrera = 'AGRONOMÍA' ORDER BY promedio DESC;"
            );
            return results;
        } catch (error) {
            console.error(error);
        }
    } 
    
      async getUserByEmail(email) {
        try {
            const results = await this.query("SELECT email FROM usuarios WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }
      async getPromedioByEmail(email, carrera){
        try{
            const results = await this.query("SELECT * FROM promedios WHERE email = ? AND carrera = ?", [email, carrera]);
            return results;
        }catch (error){
            console.error(error);
        }
      }
    async EstadisticaEstudianteITI() {
        try {
            const results = await this.query("SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_iti'");
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async estadisticasGEC() {
        try {
            const results = await this.query("SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_gec'");
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async estadisticasIg() {
        try {
            const results = await this.query("SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_ig'");
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async estadisticasAgro() {
        try {
            const results = await this.query("SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_agro'");
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async validarUser(email) {
        try {
            const results = await this.query("SELECT * FROM usuarios WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerUsuario(email) {
        try {
            const results = await this.query("SELECT * FROM usuarios WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerUsuarioPass(email) {
        try {
            const results = await this.query("SELECT contra FROM usuarios WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener usuario desde la base de datos');
        }
    }
    

    async getUserIti(email) {
        try {
            const results = await this.query("SELECT * FROM carrera_iti WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async getUserAgro(email) {
        try {
            const results = await this.query("SELECT * FROM carrera_agro WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async getUserExt(email) {
        try {
            const results = await this.query("SELECT * FROM carrera_ext WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async getUserGec(email) {
        try {
            const results = await this.query("SELECT * FROM carrera_gec WHERE email = ?", [email]);
            return results;
        } catch (error) {
            console.error(error);
        }
    }

    async insertUser(name, email, contra) {
        try {
            const results = await this.query("INSERT INTO usuarios (nombre, email, contra) VALUES (?, ?, ?)", [name, email, contra]);
            return {
                nombre: name,
                email: email,
                contra: contra
            };
        } catch (error) {
            console.error(error);
        }
    }

    async insertNewUser(name, fecha) {
        try {
            const results = await this.query("INSERT INTO carrera_iti (nombre, Fecha) VALUES (?, ?)", [name, fecha]);
            return {
                nombre: name,
                fecha: fecha
            };
        } catch (error) {
            console.error(error);
        }
    }

    async updateByNamePLG(puntuacion_logico, email) {
        try {
            const result = await this.query("UPDATE carrera_iti SET puntuacion_logico = ? WHERE email = ?", [puntuacion_logico, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNamePMT(puntuacion_matematico, email) {
        try {
            const result = await this.query("UPDATE carrera_iti SET puntuacion_matematico = ? WHERE email = ?", [puntuacion_matematico, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNamePIM(puntuacion_idioma, email) {
        try {
            const result = await this.query("UPDATE carrera_iti SET puntuacion_idioma = ? WHERE email = ?", [puntuacion_idioma, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNamePPG(puntuacion_progra, email) {
        try {
            const result = await this.query("UPDATE carrera_iti SET puntuacion_progra = ? WHERE email = ?", [puntuacion_progra, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNameAPAR(puntuacion_ar, email) {
        try {
            const result = await this.query("UPDATE carrera_agro SET puntuacion_agro = ? WHERE email = ?", [puntuacion_ar, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNameAPCI(puntuacion_ci, email) {
        try {
            const result = await this.query("UPDATE carrera_agro SET puntuacion_ciencias = ? WHERE email = ?", [puntuacion_ci, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNameAPIG(puntuacion_ig, email) {
        try {
            const result = await this.query("UPDATE carrera_agro SET puntuacion_ingles = ? WHERE email = ?", [puntuacion_ig, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNameAPMT(puntuacion_mt, email) {
        try {
            const result = await this.query("UPDATE carrera_agro SET puntuacion_mate = ? WHERE email = ?", [puntuacion_mt, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async updateByPassword(email, newPassword) {
        try {
            const result = await this.query("UPDATE usuarios SET contra = ? WHERE email = ?", [newPassword, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error('Error al actualizar contraseña en la base de datos:', error);
            throw error;
        }
    }
    async updateByNameEXPI(puntuacion_ig, email) {
        try {
            const result = await this.query("UPDATE carrera_ext SET puntuacion_idioma = ? WHERE email = ?", [puntuacion_ig, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateByNameGCPA(puntuacion_at, email) {
        try {
            const result = await this.query("UPDATE carrera_gec SET puntuacion_act = ? WHERE email = ?", [puntuacion_at, email]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async updateEstadistica(carrera, estudiantes, graduados, insercion) {
        try {
            const result = await this.query("UPDATE estadisticas SET estudiantes = ?, graduados = ?, insercion = ? WHERE carrera = ?", [estudiantes, graduados, insercion, carrera]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async updateUserRole(email, rol){
        try{
            const result= await this.query("UPDATE usuarios SET rol = ? WHERE email = ?",[ rol , email]);
            return result.affectedRows===1;
        }catch(error){
            console.error(error);
            return false;
        }
    }
}



let instance = null;

module.exports = DbService;
