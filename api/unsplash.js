// api/unsplash.js
// Função serverless no Vercel para buscar uma foto aleatória do Unsplash

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const query = req.query.query || 'romantic';

  // Se tiver chave de API do Unsplash no ambiente Vercel, usa
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  try {
    if (!accessKey) {
      // fallback: source.unsplash sem API key
      return res.status(200).json({
        url: `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`
      });
    }

    const resp = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${accessKey}`);
    const data = await resp.json();

    return res.status(200).json({
      url: data.urls?.regular || `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`
    });
  } catch (err) {
    return res.status(200).json({
      url: `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`
    });
  }
}
