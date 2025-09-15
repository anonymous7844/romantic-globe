// api/unsplash.js
// Função serverless para obter URL de imagem aleatória do Unsplash Source

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query param é obrigatório' });
  }
  // Usa o endpoint público do Unsplash Source (não requer chave)
  const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;
  return res.status(200).json({ url });
}
