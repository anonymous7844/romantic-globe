// Função serverless para buscar imagens no Unsplash
// Configure a variável de ambiente UNSPLASH_ACCESS_KEY no Vercel

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query não fornecida' });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    // fallback público se não houver chave
    return res.status(200).json({
      url: `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`
    });
  }

  try {
    const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
      query
    )}&orientation=landscape&client_id=${accessKey}`;
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    if (data && data.urls && data.urls.regular) {
      return res.status(200).json({ url: data.urls.regular });
    }
    return res.status(200).json({
      url: `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar imagem' });
  }
}
