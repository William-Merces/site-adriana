# Site da Adriana

Homenagem de Dia das Maes para Adriana, com abertura de presente, rufar de tambores e uma carta em partes acompanhada por fotos.

## Onde colocar os arquivos

- Fotos: `public/photos/`
- Videos, se houver: `public/videos/`
- Efeitos sonoros: `public/audio/`

Depois de adicionar fotos ou videos, rode:

```powershell
npm run generate-media
npm run build
```

## Comandos

- `npm run dev`: abre o servidor local.
- `npm run generate-media`: atualiza a lista de fotos e videos usados pelo site.
- `npm run build`: compila a versao final em `dist/`.

## Publicacao

O projeto esta preparado para GitHub Pages no repositorio `William-Merces/site-adriana`.
Ao enviar commits para a branch `main`, o GitHub Actions compila o Vite e publica o conteudo de `dist/`.

Endereco esperado:

`https://william-merces.github.io/site-adriana/`
