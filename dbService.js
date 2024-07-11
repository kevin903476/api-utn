const mysql = require('mysql');
let instance = null;
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    console.log('db '+ connection.state)
})

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM carrera_iti";
        connection.query(query, async (err, results) => {
          if (err) reject(new Error(err.message));

          
          //Agarrar el campo email
          for (let i = 0; i < results.length; i++) {
            
            const usuarioQuery = `SELECT email FROM usuarios WHERE nombre = '${results[i].nombre}'`;
            const usuarioResult = await new Promise((resolve, reject) => {
              connection.query(usuarioQuery, (err, userResult) => {
                if (err) reject(new Error(err.message));
                resolve(userResult[0]?.email);
              });
            });

            //Agarrar el campo carrera
            const estadisticasQuery = `SELECT carrera FROM estadisticas WHERE id = '${results[i].id_estadistica}'`;
            const estadisticasResult = await new Promise((resolve, reject) => {
              connection.query(estadisticasQuery, (err, statsResult) => {
                if (err) reject(new Error(err.message));
                resolve(statsResult[0]?.nombre_carrera);
              });
            });

        
            results[i].email = usuarioResult;
            results[i].carrera = estadisticasResult;
          }

          resolve(results);
        });
      });

      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
async getPromedio() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT email, carrera, promedio, DATE_FORMAT(fecha, '%d-%m-%Y') as fecha_formateada FROM promedios ORDER BY promedio DESC";
        connection.query(query, async (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
    async EstadisticaEstudianteITI(){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_iti'"
                connection.query(query, (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async estadisticasGEC(){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_gec'"
                connection.query(query, (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async estadisticasIg(){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_ig'"
                connection.query(query, (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async estadisticasAgro(){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT estudiantes,graduados,insercion FROM estadisticas WHERE carrera= 'carrera_agro'"
                connection.query(query, (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    
    async  validarUser(email) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM usuarios WHERE email = ?";
                connection.query(query, [email], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async obtenerUsuario(email){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT * FROM usuarios WHERE email = ? ";
                connection.query(query,[email], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async getUserIti(email){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT * FROM carrera_iti WHERE email = ? ";
                connection.query(query,[email], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    async getUserAgro(email){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT * FROM carrera_agro WHERE email = ? ";
                connection.query(query,[email], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async getUserExt(email){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT * FROM carrera_ext WHERE email = ? ";
                connection.query(query,[email], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
    async getUserGec(email){
        try {
            const response = await new Promise((resolve, reject)=>{
                const query = "SELECT * FROM carrera_gec WHERE email = ? ";
                connection.query(query,[email], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results);
                }) 
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    async insertUser(name,email,contra){
        try {
            const insertUser = await new Promise((resolve, reject)=>{
                const query = "INSERT INTO usuarios (nombre,email,contra) VALUES (?,?,?)";
                connection.query(query,[name,email,contra], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results.insertUser);
                }) 
            });

            return {
                nombre : name,
                email : email,
                contra : contra

            };
        } catch (error) {
            console.log(error)
        }
    }

    async insertNewUser(name,fecha){
        try {
            const insertUser = await new Promise((resolve, reject)=>{
                const query = "INSERT INTO carrera_iti (nombre,Fecha) VALUES (?,?)";
                connection.query(query,[name], (err , results)=>{
                    if (err) reject(new Error(err.message));
                    resolve(results.insertUser);
                }) 
            });

            return {
                nombre : name,
                fecha  : fecha
            };
        } catch (error) {
            console.log(error)
        }
    }

    async updateByNamePLG(puntuacion_logico, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_iti SET puntuacion_logico = ? WHERE email = ?";
                connection.query(query, [puntuacion_logico, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    async updateByNamePMT(puntuacion_matematico, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_iti SET puntuacion_matematico = ? WHERE email = ?"
                connection.query(query, [puntuacion_matematico, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    async updateByNamePIM(puntuacion_idioma, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_iti SET puntuacion_idioma = ? WHERE email = ?"
                connection.query(query, [puntuacion_idioma, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    async updateByNamePPG(puntuacion_idioma, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_iti SET puntuacion_progra = ? WHERE email = ?"
                connection.query(query, [puntuacion_idioma, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    async updateByNameAPAR(puntuacion_ar, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_agro SET puntuacion_agro = ? WHERE email = ?"
                connection.query(query, [puntuacion_ar, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async updateByNameAPCI(puntuacion_ci, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_agro SET puntuacion_ciencias = ? WHERE email = ?"
                connection.query(query, [puntuacion_ci, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async updateByNameAPIG(puntuacion_ig, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_agro SET puntuacion_ingles = ? WHERE email = ?"
                connection.query(query, [puntuacion_ig, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async updateByNameAPMT(puntuacion_mt, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_agro SET puntuacion_mate =  ? WHERE email = ?"
                connection.query(query, [puntuacion_mt, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async updateByNameEXPI(puntuacion_ig, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_ext SET puntuacion_idioma = ? WHERE email = ?"
                connection.query(query, [puntuacion_ig, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async updateByNameGCPA(puntuacion_at, email){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE carrera_gec SET puntuacion_act = ? WHERE email = ?"
                connection.query(query, [puntuacion_at, email],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
            //return response;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
    async updateEstadistica(carrera, estudiantes,graduados,insercion){
        try {
            
            const response = await new Promise((resolve, reject)=>{
                const query = "UPDATE estadisticas SET estudiantes = ?, graduados = ?, insercion = ? WHERE carrera = ?"
                connection.query(query, [ estudiantes,graduados,insercion, carrera],(err , result)=>{
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }) 
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}

module.exports = DbService;