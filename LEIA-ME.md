# English by Vitoria — site

Site estático (HTML + CSS + JavaScript puros), sem instalação e sem dependências.

## Estrutura
- `index.html` — estrutura da página
- `css/style.css` — todo o visual (cores, fontes, responsivo, estante 3D)
- `js/dados.js` — **textos, preços, fotos e livros** (edite aqui)
- `js/app.js` — comportamento (menu, carrossel, abas, livros)
- `images/` — fotos, fundo e ícones
- `fonts/` — Aston Script Bold, Bootzy TM e Advine Pixel Demo

## Ver no computador
Abra `index.html` no navegador (duplo clique). Para a melhor experiência, use o servidor local abaixo.

## Ver no celular / tablet (mesmo Wi-Fi do computador)
1. Tenha o Python instalado e dê duplo clique em `abrir-site.bat` (ou rode `python servidor.py`).
2. O terminal mostra um endereço como `http://192.168.0.10:8000`. Digite-o no navegador do celular.
3. Se não abrir, permita o Python no firewall do Windows quando ele perguntar.

## Colocar online (qualquer dispositivo, de qualquer lugar)
Envie a pasta inteira para um serviço de hospedagem estática gratuito:
- **Netlify Drop** (app.netlify.com/drop): arraste a pasta e pronto.
- **GitHub Pages** ou **Cloudflare Pages**: suba os arquivos e ative o Pages.
Depois é só compartilhar o link; ele funciona em celular, tablet e computador.

## Trocar o fundo
Substitua `images/fundo.jpg` por uma foto sua (a atual é provisória). Se a foto for nítida, aumente `--bg-blur` em `css/style.css`.

## Fontes
A Advine Pixel Demo é versão de demonstração: confira a licença antes de usar comercialmente.
