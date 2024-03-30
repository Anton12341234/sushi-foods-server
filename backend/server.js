import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import dotenv from 'dotenv'
import orderRouter from './routes/OrderRouter.js';
import path,{dirname} from 'path'
import { fileURLToPath } from 'url';
import multer from 'multer';
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ limit: '30mb', extended: true }))  // to parse body in json format (body parser)
app.use(express.urlencoded({limit: '30mb',extended:true}))
const PORT= process.env.PORT || 5000
const uri  = "mongodb+srv://antoxapopovich:0932304567@cluster0.kpeel0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri,
    err => {
        if(err) throw err;
        console.log('connected...')
    });

// Создание схемы и модели для изображений
const imageSchema = new mongoose.Schema({
    url: String,
  });
  
  const Image = mongoose.model('Image', imageSchema);
  
  // Настройка Multer для загрузки файлов
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'backend/uploads/'); // Папка для сохранения загруженных файлов
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Разрешение CORS (если клиент находится на другом домене)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });
  
  // Разрешение парсинга JSON и URL-encoded данных
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Обработка POST-запроса с изображением
  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      // Создание новой записи в MongoDB с путем к загруженному изображению
      const newImage = new Image({ url: req.file.path });
      await newImage.save();
  
      res.status(201).json({ url: req.file.path });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cors())
app.use('/api/users',userRouter);
app.use('/api/products',productRouter)
app.use('/api/orders',orderRouter)


app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message})
})

app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`)
});



