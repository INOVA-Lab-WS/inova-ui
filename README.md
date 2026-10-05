# @inova-lab/ui

Os componentes, tokens e logos da **INOVA Lab Library** (Figma) em React. É a fonte única de interface do
INOVA Lab: AmbientAI, Gate e todo produto novo instalam este pacote. **Nenhum app cria componente de interface
próprio nem copia o código daqui.** O que faltar entra por este repositório.

- Figma: [INOVA Lab Library](https://www.figma.com/design/Ze0WiY6G9j2yLxKb55dDMK/INOVA-Lab-Library)
- Guia de uso: INOVA UI Skill (`skills/inova-ui-skill`)
- Dono: @gabriel-moma-lmbr (único que edita e aprova, por enquanto)

## Instalar num projeto

1. `.npmrc` do projeto:
   ```
   @inova-lab:registry=https://npm.pkg.github.com
   ```
2. `npm install @inova-lab/ui` (React 19 e Tailwind 4 no projeto).
3. No CSS global do app:
   ```css
   @import "@inova-lab/ui/theme.css";
   @source "../node_modules/@inova-lab/ui/dist";
   ```
4. Use: `import { Button, Input, Chip, Alert, Toast } from "@inova-lab/ui";`

## Regras

- **Escala 4/8.** Raios 0, 4, 8, 12, 16, 24 e pill; espaçamento em múltiplos de 4; fonte 12, 14, 16, 20, 24, 32, 40, 48.
  Única exceção: `font.size.chart-axis` (10px), só para eixos de gráfico.
- **Tokens vêm do Figma.** `tokens/tokens.json` é exportado da biblioteca; `src/styles/theme.css` é gerado
  (`npm run tokens`). Não edite o CSS à mão.
- **Componente novo ou variante nova:** primeiro na biblioteca do Figma, depois aqui, com Code Connect.

## Desenvolver

```
npm install
npm run check      # typecheck + build
npx figma connect parse   # valida o Code Connect
```

Publicar: criar uma release no GitHub com a versão de `package.json`; o workflow `publish.yml` publica no GitHub Packages.
Publicar o Code Connect no Figma: `FIGMA_ACCESS_TOKEN=… npx figma connect publish` (exige plano Organization ou Enterprise).
