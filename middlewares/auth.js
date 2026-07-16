import jwt from 'jsonwebtoken';

export const SECRET = "segredo_promocao_biscoito_x";

export const autenticarCliente = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Sem token de autenticação" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.clienteId = decoded.id; 
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
