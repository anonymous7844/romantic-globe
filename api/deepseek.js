// /api/deepseek.js
export default async function handler(req, res) {
  const { prompt } = req.query;
  try {
    // Se você tem uma chave Deepseek, configure-a como variável de ambiente no Vercel:
    // Settings > Environment Variables > DEEPSEEK_API_KEY
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) {
      // fallback se não tiver chave
      return res.status(200).json({ message: `Um lugar romântico chamado ${prompt} ❤️` });
    }

    // Exemplo de chamada à API Deepseek (ajuste ao formato real da sua API)
    const resp = await fetch('https://api.deepseek.com/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({ prompt })
    });
    const data = await resp.json();
    res.status(200).json({ message: data.message || `Um lugar romântico chamado ${prompt} ❤️` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar mensagem' });
  }
}
