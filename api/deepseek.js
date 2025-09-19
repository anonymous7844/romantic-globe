// Função serverless para gerar texto romântico com a API Deepseek
// Configure a variável de ambiente DEEPSEEK_API_KEY no Vercel

export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt não fornecido' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    // fallback básico sem API
    return res.status(200).json({
      message: `Um lugar romântico chamado ${prompt} ❤️`
    });
  }

  try {
    const resp = await fetch('https://api.deepseek.com/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `Escreva uma breve descrição romântica sobre ${prompt}.`,
        max_tokens: 60
      })
    });
    const data = await resp.json();
    // ajuste conforme a resposta real da API
    const text = data.choices?.[0]?.text || data.message || `Um lugar romântico chamado ${prompt} ❤️`;
    return res.status(200).json({ message: text.trim() });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao gerar mensagem' });
  }
}
