Perfeito 🚀 — aqui está um **README.md** já pronto para você copiar/colar no seu repositório.
Ele é **profissional, completo, estruturado** e explica como usar/deployar tanto no GitHub Pages quanto no Vercel.

---

### 📄 `README.md`

```markdown
# 🌍 Romantic Places Globe

Um **webapp interativo** e **PWA** que mostra lugares românticos ao redor do mundo em um **globo 3D interativo**.  
Inclui desafios para desbloquear locais, favoritos, conquistas e geração automática de descrições e imagens usando APIs externas.

![Preview](https://user-images.githubusercontent.com/000000/placeholder.png)

---

## ✨ Funcionalidades

- 🌐 **Globo 3D** com `three.js` + `globe.gl` com animações suaves.
- 📍 Locais livres (azul) e bloqueados (vinho) exibidos como **pulses/luzes** 3D.
- 🔓 Desafios para desbloquear locais com diferentes tipos (quiz, charadas, ordem etc).
- ❤️ Favoritos e conquistas persistentes com `localStorage`.
- 📝 Geração automática de mensagens com API **Deepseek**.
- 🖼️ Imagens automáticas com API **Unsplash**.
- 📱 **PWA / Offline Ready** (Manifest + Service Worker).
- 🌗 Tema claro/escuro.
- 📋 Compatível com **GitHub Pages** e **Vercel**.

---

## 📂 Estrutura do Projeto

```

📁 /
├── index.html                 # HTML principal
├── style.css                  # Estilos globais
├── app.js                     # Lógica JS do globo, modais, desafios
├── romantic-places-part1.json # Locais (parte 1)
├── romantic-places-part2.json # Locais (parte 2)
├── manifest.json              # Manifesto PWA
├── service-worker.js          # Service Worker (offline)
├── api/
│   ├── unsplash.js            # Função serverless para imagens
│   └── deepseek.js            # Função serverless para textos
└── vercel.json                # Configuração de deploy no Vercel

````

---

## 🚀 Como Rodar Localmente

1. **Clone** o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
````

2. **Abra** o `index.html` no seu navegador
   *(para APIs, use um servidor local ou Vercel)*

3. **Configure variáveis de ambiente** se usar Vercel:

   * `UNSPLASH_ACCESS_KEY` — sua chave pública da API Unsplash.
   * `DEEPSEEK_API_KEY` — sua chave da API Deepseek.

---

## 🌐 Deploy

### GitHub Pages

1. Vá em **Settings > Pages** no repositório.
2. Escolha a branch principal (`main`) e a pasta `/` (root).
3. Salve — seu site ficará disponível em `https://usuario.github.io/repositorio`.

### Vercel

1. Crie uma conta no [Vercel](https://vercel.com/).
2. **Importe** o repositório.
3. Configure variáveis de ambiente:

   * `UNSPLASH_ACCESS_KEY`
   * `DEEPSEEK_API_KEY`
4. Clique em **Deploy**.

---

## 📱 Recursos PWA

* Ícones e cores definidos em `manifest.json`.
* Service Worker (`service-worker.js`) para cache offline.
* Instalação em Android, iOS e desktops suportados.

---

## 🛠️ Tecnologias Utilizadas

* [Three.js](https://threejs.org/)
* [Globe.gl](https://globe.gl/)
* HTML5 / CSS3 / JS ES6+
* PWA (Manifest + Service Worker)
* APIs externas: Unsplash + Deepseek
* Deploy em GitHub Pages e Vercel

---

## 🤝 Contribuição

Pull requests são bem-vindos. Para mudanças grandes, abra uma issue antes para discutir.

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT.

```

---

💡 **O que esse README traz**:
- Explica claramente o que o projeto faz.
- Mostra a estrutura completa do repositório.
- Ensina como rodar localmente.
- Ensina deploy no GitHub Pages e no Vercel.
- Explica PWA e APIs.
- É **profissional e pronto** para deixar no repositório.