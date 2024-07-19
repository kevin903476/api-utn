const express = require('express' );
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');




dotenv.config();

const dbService = require('./dbService')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(bodyParser.json());

async function sendEmail(email, message){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
          user: "utnestudiantes8@gmail.com",
          pass: "kddeucuzewldghry",
        },
    });
    try {
        const info = await transporter.sendMail({
            from: '"Herramienta UTN" <utnestudiantes8@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Promedio de Ejercicios", // Subject line
            
            html: message, // html body
        });
        console.log("Mesaje enviado: " + info.messageId)
    } catch (error) {
        console.log(error)
        throw error;
    }

}
function htmlMessage(promedio, carrera){
    let htmlContent = `
    
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Promedio de Ejercicios</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { background-color: #fff; margin: 50px auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 600px; text-align: center; }
            .title { color: #333; font-size: 24px; margin-bottom: 10px; }
            .subtitle { color: #555; font-size: 18px; margin-bottom: 20px; }
            .average { font-size: 36px; color: #ff6f61; font-weight: bold; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">¡Gracias por completar nuestros ejercicios!</h1>
            <h2 class="subtitle">A continuación, te presentamos el promedio de tus ejercicios en la carrera de ${carrera}:</h2>
            <div class="average"> ${promedio}</div>
        </div>
    </body>
    </html>
    
    `;

    return htmlContent;


}

app.post('/send-email-iti', async (request, response) => {
    const { email } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = await db.getPromedioByEmail(email, 'TECNOLOGÍAS DE INFORMACIÓN');
    console.log(email)
    try {
        if (result.length > 0) {
            const promedio = result[0];
            
            let htmlContent = htmlMessage(promedio.promedio, promedio.carrera)

            sendEmail(email,htmlContent);
            response.status(200).json({ message: 'Email enviado exitosamente' });
        }
        
        
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'Error al enviar el email' });
    }
   
   

    /* const { email } = request.body;
    const db = dbService.getDbServiceInstance();

    try {
         // Verificar si el usuario existe
      const email = await db.getUserByEmail(email);
      if (userResults.length === 0) {
        return response.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Obtener el promedio del usuario
      const promedioResults = await db.getPromedioByEmail(email);
      if (promedioResults.length === 0) {
        return response.status(404).json({ error: 'Promedio no encontrado para el usuario' });
      }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
              user: "utnestudiantes8@gmail.com",
              pass: "kddeucuzewldghry",
            },
        });
        transporter.verify().then(() =>{
            console.log('listo para enviar emails');
            
        });
        await transporter.sendMail({
            from: '"Herramienta UTN" <utnestudiantes8@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });
    } catch (error) {
        console.error(error);
    } */
});

app.post('/insertUser', async (request, response) => {
    const { nombre, email, contra } = request.body;
    const db = dbService.getDbServiceInstance();

    try {
        const userExists = await db.validarUser(email);
        if (userExists.length > 0) {
            return response.status(400).json({ error: 'El correo ya existe' });
        } else {
            let encriptada = await bcryptjs.hash(contra, 8);
            const result = await db.insertUser(nombre, email, encriptada);
            return response.json({ data: result });
        }
    } catch (error) {
        console.error('Error:', error);
        return response.status(500).json({ error: 'Error en el servidor' });
    }
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
app.post('/obtenerUser', (request, response) => {
    const { email } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.obtenerUsuario(email);
    
    result
    .then(data => response.json({ data }))
    .catch(err => {
        console.log(err);
        response.status(500).json({ error: 'Error al obtener usuario' });
    });
});

app.post('/obtenerUserPass', async (request, response) => {
    const { email, contra } = request.body;
    const db = dbService.getDbServiceInstance();
    
    try {
        const result = await db.obtenerUsuarioPass(email);

        if (result.length > 0) {
            const user = result[0];
            const compare = await bcryptjs.compare(contra, user.contra);

            if (compare) {
                response.json({ email: email, contra: user.contra });  // Devolvemos el correo y la contraseña encriptada
            } else {
                response.status(401).json({ error: 'Correo o contraseña incorrectos' });
            }
        } else {
            response.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: 'Error al obtener usuario desde la base de datos' });
    }
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


app.patch('/updatePassword', async (request, response) => {
    const { email, newPassword } = request.body;
    const db = dbService.getDbServiceInstance();

    try {
        const hashedPassword = await bcryptjs.hash(newPassword, 8); 

        const result = await db.updateByPassword(email, hashedPassword);

        if (result) {
            response.json({ success: true });
        } else {
            response.status(500).json({ error: 'No se pudo cambiar la contraseña en la base de datos' });
        }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        response.status(500).json({ error: 'Error interno al cambiar la contraseña' });
    }
});





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