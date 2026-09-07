# duo-site

Site institucional da **DUO Soluções** — `duosolucoesam.com.br`.

Estático, sem build: HTML e CSS escritos à mão, publicado no GitHub Pages.

## Estrutura

```
index.html            → duosolucoesam.com.br         (bifurca as duas portas)
industria/index.html  → /industria                   (DUO Indústria)
comercio/index.html    → /comercio                     (DUO Comércio)
assets/               logo, ícone, favicon e style.css
CNAME                 domínio próprio
```

## Contexto de negócio

O conteúdo deste site é derivado do VR SO, que não é público. As fontes:

| O que | Onde, no VR SO |
|---|---|
| Estrutura das duas portas | `empresa/contexto/posicionamento.md` |
| O que se vende e para quem | `empresa/contexto/empresa.md`, `ofertas.md` |
| Preços publicados | `empresa/contexto/precos.md` |
| Cores, tipografia e regras da logo | `empresa/marca/identidade_duo.md`, `empresa/marca/logo/README.md` |

**A logo é arquivo, nunca redesenho.** Não recriar o ícone em CSS ou SVG à mão —
o encaixe das duas peças é feito de curvas Bézier específicas.

## Prévia local

```
npx serve .
```

## Publicação

GitHub Pages a partir da branch `main`. Ver a skill `publish-site` no VR SO:
commit e tag antes de publicar, e conferir a URL no ar antes de dizer que subiu.
