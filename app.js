const express=require('express')
const getConnect = require('./src/utils/dbConnect')
const userRoute=require('./src/Routes/userRoutes')
const bodyParser=require('body-parser')
const app=express()
const cors = require('cors')
getConnect()
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
app.use(cors())
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
app.listen(3000,()=>{
    console.log('Server is connected on 3000')
})