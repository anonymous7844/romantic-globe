// api/deepseek.js
export default async function handler(req, res) {
  const { prompt } = req.query;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  // Aqui você poderia integrar a um serviço real de IA no futuro.
  // Por enquanto retorna uma mensagem romântica gerada de forma simples.
  const message = `Este é um lugar especial chamado ${prompt}, perfeito para momentos inesquecíveis ❤️`;

  res.status(200).json({ message });
}
