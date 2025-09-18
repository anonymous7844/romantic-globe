// /api/unsplash.js
export default async function handler(req, res) {
  const { query } = req.query;
  try {
    // Usa o Source Unsplash (público) sem API Key
    // devolve uma imagem aleatória com base no termo
    const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar imagem' });
  }
}
