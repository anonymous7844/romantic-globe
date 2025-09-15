// api/deepseek.js
// Função serverless para gerar mensagem romântica
// Pega a chave da API DeepSeek de process.env.DEEPSEEK (configurada no Vercel)

export default async function handler(req, res) {
  const { prompt } = req.query;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt é obrigatório' });
  }

  // Se um dia quiser integrar com um endpoint real:
  // const apiKey = process.env.DEEPSEEK;
  // const response = await fetch('https://api.deepseek.ai/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${apiKey}`
  //   },
  //   body: JSON.stringify({prompt})
  // });
  // const data = await response.json();
  // return res.status(200).json({ message: data.message });

  // Por enquanto, retorna mensagem romântica simples:
  const message = `Este é um lugar especial chamado ${prompt}, perfeito para momentos inesquecíveis ❤️`;

  res.status(200).json({ message });
}
