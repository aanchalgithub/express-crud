const express=require('express')
const getConnect = require('./src/utils/dbConnect')
const userRoute=require('./src/Routes/userRoutes')
const bodyParser=require('body-parser')
const app=express()
getConnect()
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))
app.use('/user',userRoute)
app.all('*', async (req, res) => {
    try {
        console.log(req.url);
        return res.status(400).json({success : false, message : `${req.url} :Invalid Api request Method change it`})

    } catch (error) {
        
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
app.listen(3000,()=>{
    console.log('Server is connected on 3000')
})