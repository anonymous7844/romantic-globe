// api/deepseek.js
// Função serverless no Vercel para gerar mensagem com Deepseek (ou outra IA)

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const prompt = req.query.prompt || 'mensagem romântica';
  const apiKey = process.env.DEEPSEEK_API_KEY; // configure no Vercel

  try {
    if (!apiKey) {
      // fallback: apenas retorna uma frase simples se não tiver chave
      return res.status(200).json({ message: `Um lugar romântico chamado ${prompt} ❤️` });
    }

    // Exemplo de chamada (ajuste conforme seu provedor)
    const resp = await fetch('https://api.deepseek.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 40
      })
    });
    const data = await resp.json();

    return res.status(200).json({
      message: data?.text || `Um lugar romântico chamado ${prompt} ❤️`
    });
  } catch (err) {
    return res.status(200).json({ message: `Um lugar romântico chamado ${prompt} ❤️` });
  }
}
