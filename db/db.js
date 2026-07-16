import mongoose from 'mongoose';


const MONGO_URI = 'mongodb://localhost:27017/promocao_biscoitos';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
};


const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },

  qrcodes: [{ 
    codigo: String, 
    dataLeitura: { type: Date, default: Date.now } 
  }],

  pushSubscription: {
    endpoint: String,
    expirationTime: Number,
    keys: {
      p256dh: String,
      auth: String
    }
  }
});

export const Cliente = mongoose.model('Cliente', clienteSchema);
