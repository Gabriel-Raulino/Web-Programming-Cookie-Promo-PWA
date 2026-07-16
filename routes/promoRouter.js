import { Router } from 'express';
import { loginOuCadastro, cadastrarQrCode, listarQrCodes, salvarSubscription } from '../controllers/promoCtl.js';
import { autenticarCliente } from '../middlewares/auth.js';

export const promoRouter = Router();

promoRouter.post('/login', loginOuCadastro);

promoRouter.post('/qrcode', autenticarCliente, cadastrarQrCode);

promoRouter.get('/qrcodes', autenticarCliente, listarQrCodes);

promoRouter.post('/subscribe', autenticarCliente, salvarSubscription);
