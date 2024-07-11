const express = require('express' );
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

dotenv.config();

const dbService = require('./dbService')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//create

app.post('/insertUser', async (request, response) =>{
    const {nombre, email, contra } = request.body;
    const db = dbService.getDbServiceInstance();
    let encriptada = await bcryptjs.hash(contra, 8)
    const result = db.insertUser(nombre,email,encriptada)

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
});

app.post('/insert', (request, response) =>{
    const {nombre } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewUser(nombre)

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
});
//read
app.get('/getAll', async (request, response) => {
    try {
      const db = dbService.getDbServiceInstance();
  
      const data = await db.getAllData();
  
      response.json({ data: data });
    } catch (err) {
      console.log(err);
      response.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getPromedio', async (request, response) => {
    try {
      const db = dbService.getDbServiceInstance();
  
      const data = await db.getPromedio();
  
      response.json({ data: data });
    } catch (err) {
      console.log(err);
      response.status(500).json({ error: 'Internal Server Error' });
    }
});
  
app.get('/estadisticas-iti', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.EstadisticaEstudianteITI();
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.get('/estadisticas-agro', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.estadisticasAgro();
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.get('/estadisticas-ig', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.estadisticasIg();
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.get('/estadisticas-gec', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.estadisticasGEC();
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.post('/obtenerUser', (request, response) =>{
    const { email} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.obtenerUsuario(email);
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});

app.post('/getUserIti', (request, response) =>{
    const { email} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.getUserIti(email);
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.post('/getUserAgro', (request, response) =>{
    const { email} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.getUserAgro(email);
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.post('/getUserExt', (request, response) =>{
    const { email} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.getUserExt(email);
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});

app.post('/getUserGec', (request, response) =>{
    const { email} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.getUserGec(email);
    
    result
    .then(data => response.json({data}))
    .catch(err => console.log(err)); 
});
app.post('/validarUser', async (request, response) => {
    const { email, contra } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = await db.validarUser(email);

    if (result.length > 0) {
        const user = result[0];
        const compare = await bcryptjs.compare(contra, user.contra);

        if (compare) {
            response.json({ data: true });
        } else {
            response.json({ data: false });
        }
    } else {
        response.json({ data: false });
    }
});

//update
app.patch('/updatePLG', (request , response) => {
    const {puntuacion_logico, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNamePLG(puntuacion_logico,email);



    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})
app.patch('/updatePMT', (request , response) => {
    const {puntuacion_matematico, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNamePMT(puntuacion_matematico,email);
    


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})
app.patch('/updatePIM', (request , response) => {
    const {puntuacion_idioma, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNamePIM(puntuacion_idioma,email);
    


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})
app.patch('/updatePPG', (request , response) => {
    const {puntuacion_progra, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNamePPG(puntuacion_progra,email);
    


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})
app.patch('/updateAPAR', (request , response) => {
    const {agro_puntuacion_ar, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNameAPAR(agro_puntuacion_ar,email);
    


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})
app.patch('/updateAPCI', (request , response) => {
    const {agro_puntuacion_ci, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNameAPCI(agro_puntuacion_ci,email);
    


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})

app.patch('/updateAPIG', (request , response) => {
    const {agro_puntuacion_ig, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNameAPIG(agro_puntuacion_ig,email);



    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})

app.patch('/updateAPMT', (request , response) => {
    const {agro_puntuacion_mt, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNameAPMT(agro_puntuacion_mt,email);

    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})

app.patch('/updateEXPI', (request , response) => {
    const {ext_puntuacion_lg, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNameEXPI(ext_puntuacion_lg,email);
    email


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})

app.patch('/updateGCPA', (request , response) => {
    const {gec_puntuacion_at, email} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateByNameGCPA(gec_puntuacion_at,email);
  


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})
app.patch('/updateEstadisticas', (request , response) => {
    const {carrera, estudiantes,graduados,insercion} =request.body
    const db = dbService.getDbServiceInstance();
    const result = db.updateEstadistica(carrera, estudiantes,graduados,insercion);
    console.log(carrera)
    console.log(estudiantes)
    console.log(graduados)
    console.log(insercions)


    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err))
})

//delete

app.listen(process.env.PORT, () => console.log("app is running"))