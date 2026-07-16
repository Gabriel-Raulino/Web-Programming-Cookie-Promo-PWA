import { Cliente } from '../db/db.js';
import { SECRET } from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';


export const loginOuCadastro = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    let cliente = await Cliente.findOne({ email });


    if (!cliente) {
      cliente = await Cliente.create({ nome, email, senha, qrcodes: [] });
    } else if (cliente.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: cliente._id }, SECRET);
    return res.json({ token, nome: cliente.nome });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const cadastrarQrCode = async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({ error: "Código QR inválido" });
    }
	

    const cliente = await Cliente.findByIdAndUpdate(
      req.clienteId,
      { $push: { qrcodes: { codigo } } },
      { new: true }
    );

    return res.json({ message: "QR-Code cadastrado com sucesso!", total: cliente.qrcodes.length });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar QR-Code" });
  }
};


export const listarQrCodes = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.clienteId);
    return res.json(cliente.qrcodes);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar QR-Codes" });
  }
};


export const salvarSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    await Cliente.findByIdAndUpdate(req.clienteId, {
      pushSubscription: subscription
    });

    return res.json({ message: "Dispositivo registrado para notificações!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao salvar assinatura de push" });
  }
};
