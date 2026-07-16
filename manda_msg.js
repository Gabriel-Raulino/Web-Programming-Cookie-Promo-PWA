import mongoose from 'mongoose';
import webpush from 'web-push';
import fs from 'fs';
import { Cliente } from './db/db.js';


const chaves = JSON.parse(fs.readFileSync('./chaves.json', 'utf-8'));


webpush.setVapidDetails(
  'mailto:gabriel.raulino@grad.ufsc.br',
  chaves.publicKey,
  chaves.privateKey
);

const MONGO_URI = 'mongodb://localhost:27017/promocao_biscoitos';

async function realizarSorteio() {

  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error(' Erro: Formato incorreto.');
    console.log(' Uso correto: node manda_msg.js <codigo_qrcode> "<mensagem>"');
    process.exit(1);
  }

  const codigoSorteado = args[0];
  const mensagem = args[1];

  try {
    console.log(` A procurar o cliente que cadastrou o código: ${codigoSorteado}...`);
    await mongoose.connect(MONGO_URI);
    

    const clienteVencedor = await Cliente.findOne({ "qrcodes.codigo": codigoSorteado });

    if (!clienteVencedor) {
      console.log(` Nenhum cliente registou o QR Code: ${codigoSorteado}`);
      process.exit(0);
    }

    if (!clienteVencedor.pushSubscription || !clienteVencedor.pushSubscription.endpoint) {
      console.log(` O cliente ${clienteVencedor.nome} tem o código, mas não ativou as notificações no smartphone.`);
      process.exit(0);
    }

    console.log(` Cliente encontrado! A enviar notificação para o dispositivo de: ${clienteVencedor.nome}...`);


    await webpush.sendNotification(
      clienteVencedor.pushSubscription,
      JSON.stringify({ message: mensagem })
    );

    console.log(' Mensagem enviada com sucesso para o smartphone do cliente!');

  } catch (error) {
    console.error(' Erro crítico ao tentar notificar o cliente:', error);
  } finally {

    await mongoose.disconnect();
    process.exit(0);
  }
}


realizarSorteio();
