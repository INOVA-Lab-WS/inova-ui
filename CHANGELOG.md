# Changelog

## 0.4.5 · 2026-10-05

- `ConnectorCard`: os metadados vão ao fim do cartão (`mt-auto`, cartão `h-full`), e os rodapés de uma mesma linha da grade ficam alinhados (#13).
- `ActionCard` aceita `asChild`: o item do trilho lateral (`context="rail"`, ícone sobre rótulo) e do menu móvel (`context="menu"`) vira o `Link` do app (#14).

## 0.4.4 · 2026-10-05

- `Accordion`: hover e pressionado pintam o cartão inteiro, como na biblioteca publicada (antes só a faixa do título).

## 0.4.3 · 2026-10-05

- `ConnectorCard`: seta à direita do título (`arrow`, ligada por padrão), como na biblioteca (#12); `asChild` implementado: o `Link` do app, como único filho, recebe o visual e o conteúdo e navega sem recarregar a página (#11).
- `Accordion`: os 5 estados do botão (padrão, hover, pressionado, desabilitado, foco); `disabled` no `AccordionItem`; anel de foco por fora do cartão.

## 0.4.2 · 2026-10-05

- `Chip` aceita `asChild`: a aba que é página vira link (`<Chip asChild appearance="filled" count={24}><Link href=…>Todos</Link></Chip>`), com ícone e contagem dentro dele.

## 0.4.1 · 2026-10-05

- `Badge` ganha a variante `error`: vermelho claro (`status-error-bg` e `status-error-fg`), no mesmo formato de `warning`, para erro que não é alarme (#7).

## 0.4.0 · 2026-10-05

- **Estilos no servidor (#2):** novo ponto de entrada `@inova-lab-ws/ui/variants`, sem `"use client"`, com `cn`, `buttonVariants`, `chipVariants`, `badgeVariants`, `avatarVariants`, `actionCardVariants`, `historyThumbnailVariants`, `connectorCardClassName` e `pillTabClassName`. Os componentes continuam em `@inova-lab-ws/ui`.
- **Botão e aba como link (#3):** `Button` e `PillTab` aceitam `asChild` (o filho, por exemplo um `Link`, recebe o visual). A aba como link ganha `aria-current="page"`, e `PillTabs navigation` vira um `<nav>`.
- **Fonte com next/font (#4):** o tema usa `var(--font-inter, "Inter")`, `var(--font-instrument-serif, "Instrument Serif")` e `var(--font-roboto-mono, "Roboto Mono")`. Funciona com `next/font` (variáveis com esses nomes) e com a fonte instalada pelo nome.
- **Ícones (#8), quebra:** `lucide-react` deixa de ser dependência e passa a ser `peerDependency` `>=1`. O app precisa ter `lucide-react` 1.x instalado.

## 0.3.0 · 2026-10-05

- 5 componentes novos, vindos do que o Gate usava: `Accordion` (conteúdo livre), `ActionMenu` (itens com os estados do chip), `ConnectorCard`, `CopyField` e `PageHeader` (abas feitas com `Chip`).
- Para a tag, use `Badge`; para abas com contagem, use `Chip` com `count`.

## 0.2.4 · 2026-10-05

- MetricTile: a ajuda do "i" usa o Tooltip do pacote em vez do `title` do navegador.
- README: tabela de componentes completa, agrupada por categoria, com o nome de cada um no Figma.
- Code Connect salvo no Figma para os 51 componentes novos.

## 0.2.3 · 2026-10-05

- DateRangePicker: a faixa do intervalo passa por trás do início e do fim, contínua, como no Figma.

## 0.2.2 · 2026-10-05

- DateRangePicker: dia ativo (início e fim) em preto (`surface-ink`) e intervalo em preto a 10%, como o padrão de seleção.

## 0.2.1 · 2026-10-05

- DateRangePicker: atalhos e "Aplicar" passam a ser Chip (os componentes preset e apply saíram da biblioteca).
- DateRangePicker segue as correções do Figma: popup 320 no mobile e 352 no desktop, cantos 16, dia 36px com texto 12, hoje e bordas em negrito, intervalo em verde ação a 10%.

## 0.2.0 · 2026-10-05

- Todos os componentes da INOVA Lab Library entram no pacote: indicadores, navegação, estrutura, logos, controles de formulário, overlays, dados, gráficos, tabela e conversa (57 exports).
- HistoryThumbnail segue a versão atual do Figma (128x96 e 112x84, anel verde no selecionado).
- Code Connect para cada componente em `figma/`.

## 0.1.1 · 2026-10-05
- Sucesso na família do verde da marca: `status.success-bg` #E8F4DA (= `green.secondary`) e `status.success-fg` #2E6B20 (= `green.secondary-foreground`). Antes #F0FDF4 e #166534, de outra família de verde.

## 0.1.0 · 2026-10-05
- Primeira versão. Tokens da INOVA Lab Library na escala 4/8 (`tokens/tokens.json` → `theme.css`).
- Componentes: Button, Input, Chip, Alert, Toast (+ ToastViewport).
- Code Connect ligando os 5 componentes à biblioteca no Figma.
