const express=require('express')
const getConnect = require('./src/utils/dbConnect')
const userRoute=require('./src/Routes/userRoutes')
const Todoroutes = require('./src/Routes/ToDoRoutes')


const bodyParser=require('body-parser')

const app=express()
const cors = require('cors')
getConnect()

app.use(cors())
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))
const whiteList = ['http://localhost:3000/', 'http://localhost:3000','http://localhost:3001']
// const inableCors = {
//   origin: (origin, callback) => {
//     if (whiteList.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Request from unauthorized origin"));
//     }
//   },
// };

// app.use(cors(inableCors))
app.use('/user',userRoute)
app.use('/api',Todoroutes);
// app.all('*', async (req, res) => {
//     try {
//         console.log(req.url);
//         return res.status(400).json({success : false, message : `${req.url} :Invalid Api request Method change it`})

//     } catch (error) {
        
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
app.get('/',async(req,res)=>{
res.send('Hello')
})
// const encoder = bosyParser.urlencoded()
// const MailAdress = "vaanchal05@gmail.com"
// const transporter = nodeMailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     tls: true,
//     auth:{
//     user:"vaanchal05@gmail.com",
//     pass:"wxhe szef alcb tghv"
//     }
// })
app.listen(3000,()=>{
    console.log('Server is connected on 3000')
   
})