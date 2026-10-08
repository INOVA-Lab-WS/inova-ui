# Changelog

## 0.10.2 · 2026-10-08

- **`MultiSelect` dentro da tela (#75):** a lista de opções tem no máximo 256px e rola por dentro; o painel nunca passa da área visível (vira para cima ou encolhe, com 8px de folga).
- **`GenerationBoard onImageClick` (#76):** a foto pronta vira botão, com mãozinha, borda verde no hover e contorno no foco, para abrir o visualizador. `imageLabel` nomeia o botão (padrão "Ampliar imagem"). Sem a prop, nada muda.
- **Hover nas barras (#77):** em `BarChart` e `StackedBarChart`, passar o mouse ou focar uma barra (Tab, setas, Home, End) destaca a barra, atenua as outras a 40% e mostra a dica com o rótulo, o valor de cada série e o total. `BarChart valueLabel` dá o nome do valor na dica.
- **Foco na bottom-sheet (#78):** a gaveta leva o foco para dentro ao abrir (antes ele ficava no botão atrás dela). Com `initialFocus`, o campo indicado recebe o foco e o teclado sobe no celular; sem a prop, o foco vai para a própria gaveta, sem focar campo. `onOpenAutoFocus` também vale na gaveta.
- **`PillTabs fullWidth` (#79):** o grupo ocupa a largura toda e cada pílula divide o espaço por igual, com o rótulo centralizado.

## 0.10.1 · 2026-10-08

- **Gráficos com muitas barras (#73):** `BarChart` e `StackedBarChart` nunca passam do cartão. As barras encolhem para caber, e o espaço entre elas diminui com mais de 12 e de 24 barras. Os rótulos do eixo aparecem de tanto em tanto, para nenhum ser cortado ("02/…", "1…"), sempre com o primeiro (alinhado à esquerda) e o último (à direita). 30 dias num celular mostram 5 datas; 24 horas mostram 0h, 3h, 6h… 23h. `labelStep` (`"auto"` por padrão, ou um número) força o passo.

## 0.10.0 · 2026-10-08

Revisão do Gabriel no AmbientAI (07/10). Cada correção foi feita primeiro na INOVA Lab Library e depois no código.

- **`Thumbnail` clicável (#62):** com `onClick`, vira `<button type="button">` com mãozinha, borda verde no hover, foco e `disabled` quando `unavailable`. Com `href` continua link; sem nenhum dos 2, continua só leitura.
- **`GenerationBoard` carregando com contraste (#63):** sem imagem embaixo, frase, percentual e barra ficam em `text-primary` com o `Spinner` girando (de ~1,2:1 para ~14:1). Sobre a imagem anterior, continua branco. **`ProgressReadout tone`:** `"on-image"` (padrão, branco) ou `"on-surface"` (escuro, para superfície clara).
- **`GenerationBoard fit` (#64):** `"cover"` (padrão) preenche o quadro mantendo a proporção, como no Figma; `"contain"` mostra a foto inteira, com faixas. **Atenção: o padrão mudou de contain para cover.** Quem posiciona algo sobre a foto supondo as faixas (os pinos de produto do AmbientAI) precisa recalcular ou passar `fit="contain"`.
- **Folha de baixo no iPhone (#65):** não sobe além da área segura do topo mais 72px (`--inova-sheet-top-gap`, o cabeçalho + 16) e fica 12px acima do maior entre o teclado e a barra de início (`--inova-safe-area-bottom`).
- **Esqueletos (#66):** os 4 gráficos em `state="loading"` desenham grade, barras e eixo em esqueleto; `ActivityLog state="loading"` desenha `skeletonRows` (padrão 3) linhas no formato da linha; `Table busy` aceita `skeletonRow="text"` (uma barra por coluna, sem círculo) e `skeletonColumns`. O padrão `skeletonRow="avatar"` é o desenho da 0.9.0. As frases de carregamento ficam para o leitor de tela.
- **`Button variant="action"` e `size="compact"` (#67):** a pílula verde de ação (`surface-action`, texto `on-action`, 40px no celular e 32px a partir de 1024px, ícone de 16px, brilho verde no hover). O "Falar" do `InputCard` passa a ser essa pílula.
- **Indicador de escuta (#68):** gravando, faixa e cartão do `Composer` ficam numa casca só (raio 24, `surface-shell`, sem espaço); o `ListeningBanner` põe a onda à esquerda e "Ouvindo…" à direita; o `Waveform` desenha 24 barras finas em 64x20, cortadas na caixa.
- **Sem faixa bege embaixo da folha (#69):** o bloco que o vaul pinta abaixo da gaveta foi escondido.
- **`ProfileMenu presentation` (#70):** `"popover"` (padrão), `"bottom-sheet"` ou `"responsive"` (gaveta abaixo de 1024px). `ActionMenuItem` e `ActionMenuSeparator` funcionam dentro da gaveta; `onSelect` roda no clique e fecha a gaveta, salvo `event.preventDefault()`. `Overlay hideTitle` deixa o título só para o leitor de tela.
- **Teclado na folha de baixo (#71):** no foco de um campo, a página volta para onde estava se o Safari deslocou a vista, e só o corpo da folha rola até o campo, depois que o teclado assenta. A folha encolhe para a área visível. Não testado num iPhone.
- **README (#59):** aviso de que o tema muda `text-lg` a `text-4xl` no app inteiro, com a tabela e a busca para listar os usos.

## 0.9.0 · 2026-10-07

- **Tema sem Tailwind dentro (#60):** `theme.css` não importa mais o Tailwind (que entrava 2 vezes no app) e já traz `@source "./"`. **O app agora faz `@import "tailwindcss";` antes de `@import "@inova-lab-ws/ui/theme.css";`** e pode tirar o `@source` para `node_modules`. Sem Tailwind no app: `theme-standalone.css`.
- **`cn` conhece o tema (#61):** montado com `extendTailwindMerge` e os nomes da biblioteca (tamanhos de texto com `chart-axis`, raios, sombras, camadas, tracking). `text-text-muted text-chart-axis` mantém a cor. `inovaMergeConfig` exportado para o app montar o próprio `cn`. `tailwind-merge` passa para a versão 3. Teste em `scripts/test-cn.mjs`, rodando no `check`.
- **Teclado no celular (#49):** `KeyboardInsetProvider` / `useKeyboardInset` gravam `--inova-kb-inset` e `--inova-visual-viewport-height`. A folha de baixo do `Overlay` fica 12px acima do teclado, cabe na altura visível e rola o campo focado dentro dela, sem animar com movimento reduzido.
- **Fila de avisos (#50):** `ToastProvider` e `useToast().show({ kind, message, duration })` → id, `dismiss(id)`. Até 3 visíveis, os mais antigos saem primeiro; tempo padrão do token `toast-visible`; erro fica até fechar; o relógio pausa com o ponteiro ou o foco em cima; clicar fecha.
- **Quebras de tela no código (#55):** `useBreakpoint()` (`mobile`, `tablet`, `desktop`, `wide`), `useMediaQuery`, `useMinWidth`, `usePointerCoarse` e `BREAKPOINTS`, gerados dos mesmos tokens do CSS e seguros para renderização no servidor. `Overlay` e `Menu` usam o mesmo hook.
- **`ImageViewer` no celular:** 12px de margem nas laterais da imagem, como na biblioteca.

## 0.8.0 · 2026-10-07

- **`ImageViewer` (#52):** galeria em tela cheia com as regras do visualizador do AmbientAI: fundo do chip ink (translúcido e desfocado), controles em vidro, contador "2 / 5" e setas só com 2 ou mais imagens, navegação em loop, terços da tela, deslizar, arrastar para baixo para fechar, toque duplo 2x, pinça até 4x, Esc e setas, foco preso e devolvido, troca anunciada. `ImageViewerAction` para as ações de baixo. Salvar a imagem continua no app.
- **`EmptyState` (#51):** ícone num selo, título, apoio e ação, `compact` ou `page`, `announce` para `role="status"`. `EmptyMark` para célula vazia.
- **`MetricTileGroup` (#53):** a faixa de métricas, junto do `MetricTile`: rola de lado com encaixe no celular e vira grade de 2 a 6 colunas a partir de 1024px.
- **`ScrollArea` (#54):** barra fina que aparece ao rolar; utilitário `scrollbar-none` para faixas de lado.
- **Sombras (#56):** `shadow-control`, `shadow-raised`, `shadow-overlay`, `shadow-action-glow` (`--inova-shadow-*`). Os componentes não têm mais sombra solta; menus e popovers passam para `raised`, um pouco mais leve que antes.
- **Camadas (#57):** `z-base`, `z-raised`, `z-header`, `z-overlay`, `z-popover`, `z-toast`, `z-splash` (`--inova-layer-*`). Os componentes usam as classes; menus, seletores e dicas ficam em `z-popover` (60), acima dos overlays.
- **Caixa alta (#58):** `tracking-tight`, `tracking-normal`, `tracking-wide`; `Eyebrow` e `eyebrowClassName`.


- **`Menu` lembra se está aberto ou fechado:** no `sidebar` não controlado, a escolha fica salva no navegador (`localStorage`, chave `storageKey`, padrão `"inova-menu-expanded"`), e por isso sobrevive à troca de página e ao recarregar. Antes, cada página montava o menu de novo e ele voltava aberto. `storageKey={null}` desliga; com `expanded` controlado, quem guarda é o app.

## 0.7.4 · 2026-10-07

- **`ActionCard context="menu"`:** 56px de altura no celular e 48px a partir de 1024px, com 12px nas laterais, como as variantes `menu-mobile` e `menu-desktop` da biblioteca (antes 16px em volta, cerca de 56px em qualquer tela).

## 0.7.3 · 2026-10-06

- **Fundo da página no formato do menu:** o gradiente do `<html>` vai de `surface-canvas-bottom` na base a `surface-canvas-top` no topo, igual ao `Menu`, e fica preso à altura da tela (`background-attachment: fixed`). Antes ele cobria o documento inteiro e parava em 42%, então numa página mais longa que a tela a área visível ficava chapada ao lado do menu em gradiente.

## 0.7.2 · 2026-10-06

- **`AccordionItem`:** estados iguais à biblioteca. Hover em `surface-muted` e pressionado em `surface-selected` (antes `surface-control-hover` e `chip-pressed`).

## 0.7.1 · 2026-10-06

- **`Rating previousValue` (pedido do Forma Lab):** a nota do ciclo anterior em cinza neutro; a atual fica por cima e a anterior aparece onde passa dela. O leitor de tela lê as 2 ("3 de 5, ciclo anterior 2 de 5"), também em `readOnly`. Sem `previousValue`, nada muda.
- **`Slider` (#46, Forma Lab):** escolhe um número num intervalo (`min`, `max`, `step`, `value`/`defaultValue`, `onValueChange`, `name`). Valor ao lado em `tabular-nums` e pt-BR, com `formatValue` para a unidade. Trilho `surface-muted`, faixa `surface-action`, alça de 20px com alvo de 48px no celular. Setas, Page Up/Down (10 passos), Home e End; `role="slider"` com `aria-valuetext` ("45 por cento"). Foco no padrão preto; estado desativado.
- **`Skeleton` (#47, Forma Lab):** esqueleto de carregamento em `surface-muted`, com as formas `rect` (raio 8), `text` (12px, raio 4) e `circle`. Pulsa só com movimento permitido (`motion-safe:animate-pulse`) e é `aria-hidden`.
- **`MetricTile loading`:** valor e legenda viram esqueleto, com `aria-busy`. O foco do botão de ajuda segue o padrão preto.
- **`Table busy` sem linhas:** mostra `skeletonRows` (padrão 4) linhas de esqueleto.

## 0.7.0 · 2026-10-06

- **`Menu` novo, no lugar do antigo:** `presentation="sidebar"` (agora o padrão) é o menu lateral responsivo. Abaixo de 768px ele some, e o app usa o botão do `Header` com `presentation="fullscreen"`. De 768 a 1023px fica fechado em 64px. A partir de 1024px abre em 240px ou fecha em 64px pelo botão de painel (`PanelLeftClose` / `PanelLeftOpen`), controlado (`expanded`, `onExpandedChange`) ou não (`defaultExpanded`). Fechado, a própria logo é o botão de abrir: no hover ou no foco ela vira o ícone de painel. `account` põe o avatar da pessoa embaixo, depois de um divisor; no menu fechado aparece só o 1º item (o avatar), e o nome fica para o leitor de tela. `expanded` e `collapsed` fixam um estado só. `navigation` pode ser uma função que recebe `{ collapsed }`, para usar `ActionCard context="rail"` fechado e `context="menu"` aberto. **`presentation="rail"` continua funcionando** como nome antigo de `collapsed`. **Atenção:** um `<Menu>` sem `presentation` era trilho e agora é o menu responsivo.
- **`Menu` (ajustes do teste no navegador):** `logo` aceita uma função de `{ collapsed }`, para o menu fechado mostrar só o símbolo e o aberto a marca inteira. O menu de tela cheia anima a entrada (250 ms, deslizando da esquerda) e a saída (200 ms) quando o app controla `open` e mantém o componente montado; `onExitComplete` avisa o fim da saída. Respeita o movimento reduzido.
- **Animação (Foundations, tokens `motion`):** durações `fast` 150, `exit` 200, `base` 250, `slow` 500, `image` 700, `sweep` 2800 e `toast-visible` 2600 ms, e as curvas `enter`, `exit`, `standard` e `linear`, como variáveis `--inova-motion-*`. O Tailwind ganha `ease-enter`, `ease-exit` e `ease-standard`. `Overlay` e `Menu` já usam os tokens, sem tempo escrito à mão.
- **`Overlay` mais rápido:** gaveta, diálogo e véu entram em 250 ms e saem em 200 ms (antes 500 ms).
- **`Toggle` igual à biblioteca:** trilho de 40×24 e bolinha de 16px a 4px da borda, sem sombra.
- **Grid e breakpoints (Foundations):** `tokens.json` ganhou `layout`, e o tema ganhou os breakpoints `tablet` (768), `desktop` (1024) e `wide` (1440) e as variáveis `--inova-grid-columns`, `--inova-grid-gutter`, `--inova-grid-margin`, `--inova-nav-width` e `--inova-content-max-width`, que mudam por faixa. Mobile: 4 colunas, gutter 16, margem 16. Tablet: 8, 16, 24. Desktop: 12, 24, 32. Wide: 12, 24, 40, com o conteúdo até 1280px. `PageGrid` aplica a grade; ela começa onde o menu termina.
- **`Rating` (#43, Forma Lab):** avaliação por estrelas, nota inteira de 1 a 5, estrela cheia em âmbar (`rating-filled`). Clicar na nota atual zera; hover pré-visualiza. `radiogroup` com rótulo, cada estrela "N de 5", setas, Home e End, tabindex móvel. `name` grava num campo escondido. `readOnly` mostra uma nota inteira; média é só número, fora do componente. Tamanhos 20 (alvo de 48px abaixo de 768px) e 16.
- **`Alert` responsivo:** `actionLabel` e `onAction` mostram a ação como link embaixo da mensagem no celular (abaixo de 768px), com título, mensagem e link em coluna, e como botão à direita a partir de 768px. É a nova versão `viewport=mobile` da biblioteca. `action` continua para conteúdo próprio.
- **`GenerationBoard`:** a 1ª geração (`state="loading"`) tem o mesmo efeito de `regenerating`: superfície desfocada, o brilho que atravessa e a leitura "frase + % + barra" em branco (`ProgressReadout`). Em `regenerating`, a imagem anterior fica por baixo.
- **`Header` agnóstico:** a logo é um slot (no Figma, a propriedade `logo`). Sem `logo`, o header mostra `LogoPlaceholder` e não mais a marca AmbientAI. **Atenção: o app AmbientAI precisa passar `logo={<LogoAmbientAI type="wordmark" title="AmbientAI" />}`.** Um svg no slot fica com 12px de altura e a largura proporcional, como no protótipo.
- **`ActionCard context="rail"`:** a caixa do ícone passa de 56×40 para 40×40, como na biblioteca.
- **`ActionCard`:** saiu `context="refined"`, retirado da biblioteca (nenhum uso).

## 0.6.6 · 2026-10-06

- **`Header` (#40):** a página não fica mais 32px mais larga no celular. A área segura soma na altura (`h-[calc(3.5rem+var(--inova-safe-area-top))]`) sem `box-content`, que somava também o padding lateral à largura.
- **`MultiSelect` (#41):** `help` e `error` como no `Input`, ligados ao gatilho por `aria-describedby`, com `aria-invalid` e borda vermelha no erro.
- **`MultiSelect` (#42):** o painel é uma `listbox` com `aria-multiselectable`, e cada opção é `role="option"` com `aria-selected`. As setas, Home e End navegam e Espaço ou Enter marcam. A caixa de seleção que a biblioteca desenha continua, só como desenho. O gatilho tem `aria-haspopup="listbox"`.

## 0.6.5 · 2026-10-06

- **`Button variant="destructive-ghost"` (#31):** ação destrutiva secundária, texto vermelho sem fundo e vermelho claro no hover e no pressionado, para "Excluir" ou "Remover" ao lado da ação principal. Desenhada e aprovada na biblioteca.
- **`Code` e `codeClassName` (#33):** código no meio do texto (mono 12, fundo `surface-muted`, raio 4, 4 nas laterais, altura de linha 20). `codeClassName` também em `@inova-lab-ws/ui/variants`.

## 0.6.4 · 2026-10-06

- **`Header` (#30):** reserva a área segura do topo do iPhone (PWA com barra de status translúcida); a barra fica com 56px abaixo dela.
- **`Overlay` (#32):** `role="alertdialog"` no diálogo e `initialFocus` / `onOpenAutoFocus` para o foco começar onde o app quiser (ex.: no Cancelar).
- **`MultiSelect` (#34):** `form` aceita uma lista de formulários; "todos" usa `allSelectedLabel`, diferente do vazio; `hint` sob o rótulo de cada opção.
- **`AccordionItem` (#35, #37):** `keepMounted` mantém o conteúdo (e os campos) quando fechado; hover, pressionado e foco reagem só ao título do próprio item.
- **`ActivityLog` (#36):** por linha, `avatar` e `result` (selo à direita), `action` e `note` com conteúdo rico; `emptyMessage` no componente.
- **`ActionMenuItem` (#38):** `asChild` com o `Link` do app, ícone dentro dele.
- **`Table` (#39):** o invólucro com rolagem tem `relative`, e textos só para leitor de tela não alargam mais a página.

## 0.6.3 · 2026-10-06

- `Chip iconOnly`: chip sem rótulo, quadrado (32 no small, 40 no medium), com `aria-label`. Na biblioteca, a propriedade `show-label` do `chip` passou a funcionar em todas as 50 variantes (antes não estava ligada a nenhuma). No `generation-board`, mostrar produtos, baixar e ampliar ficam só com ícone; "Registrar pedido" mantém o rótulo.

## 0.6.2 · 2026-10-06

- `ProductListRow kind="catalog"`: a linha do catálogo sem cartão (só 16 em cima e embaixo), como na biblioteca (decisão do Gabriel). As outras continuam como cartão (`kind="card"`, padrão).

## 0.6.1 · 2026-10-06

- **Um vermelho de erro só (decisão do Gabriel):** `status-error-fg` passa a ser o `danger` (#C23A2B), o mesmo de campos, checkbox, badge, alert e toast. Na biblioteca, `color/status/error-fg` virou apelido de `color/danger`.
- **Foco do botão preto em todas as variantes (decisão do Gabriel):** contorno preto de 2px e anel interno de 3px em `border-focus` a 50%, como o desenho da biblioteca; primary e ink deixaram o contorno branco.

## 0.6.0 · 2026-10-06

**Badge redesenhado (decisão do Gabriel):** `color` (green, red, yellow, blue, beige, disabled) x `tone` (dark, light), com ou sem ícone, igual à biblioteca. Os nomes antigos de `variant` continuam funcionando e viram o par correspondente (`default` → green dark, `secondary` → green light, `outline`/`muted`/`native-*` → beige light ou o claro da cor, `warning` → yellow light, `destructive` → red dark, `error` → red light).

**Auditoria do código contra a INOVA Lab Library** (cerca de 60 componentes, o Figma vale). Corrigido no código:
- **Formulário:** `Input`, `Select`, `Textarea`, `MultiSelect` e `DateRangePicker` com padding 12 também no celular; foco com borda `border-focus` e anel de 3px; erro em `surface-danger`. `Checkbox` com check de 12px, `Radio` com ponto de 10px, `Toggle` com o círculo a 4px da borda, `RoleRadio` com raio 16 e selecionada em semibold.
- **Indicadores e ações:** destrutivo do `Button` sem mudança de opacidade; texto do chip `ink`/`action` em semibold; ícone do `Avatar` de app em 16/20; `Alert` e `Toast` com padding 12.
- **Navegação e estrutura:** `ActionCard` (suggestion, refined e menu) com as medidas e cores do Figma; `Header` esconde o botão de menu no desktop; `NavigationTabBar` usa o chip puro; `PillTab` com raio 16 e inativo em regular; foco do `ConnectorCard` por dentro; hover e pressionado destrutivos do `ActionMenu` em vermelho claro.
- **Overlay:** raio 24 e borda de 1px em todas as apresentações, padding 24 no diálogo e na gaveta.
- **Dados:** `MetricTile` (stat, variant e count) com padding, pesos e tamanhos do Figma e marcador de cor opcional (`markerClassName`); `ProgressReadout` refeito como no Figma (percentual e barra de 100×4 em branco, para ficar sobre imagem); `Table` com raio 16, padding 20 e `title`, `summary` e `note` opcionais; células com 8 de padding vertical e 12 entre colunas; `ActivityLogRow` com disco e ícone (`icon`), autor em 14 semibold; `DistributionChart` em 14 com `chart-series2`.
- **Conversa:** `FeedbackPrompt`, `InputCard` (medidas do desktop), `ListeningBanner` (sem canto próprio), `Thumbnail` (hover com borda verde) e `UserMessage` (padding 8 com foto).

Pontos em que o próprio Figma parece inconsistente ficaram para o Gabriel decidir (ver a sessão).

## 0.5.3 · 2026-10-06

- **`Table` (#29):** `caption` (legenda para leitor de tela, em `sr-only`) e `busy` (vira `aria-busy`). `TableCell type="row-header"` é o nome de cada linha (`<th scope="row">`, 14 semibold), igual ao novo tipo da biblioteca. `secondary` esconde a coluna abaixo de `md`.
- **`TableCell type="body"`** passa a 14 medium, como no Figma (antes saía regular).
- **`Overlay` (#28):** `presentation="responsive"` é folha de baixo abaixo de `lg` (1024px) e gaveta lateral a partir de `lg`. Gaveta e diálogo animam a entrada e a saída em 500 ms (painel na sua direção, véu com fade), respeitando o movimento reduzido. `onExitComplete` avisa quando a saída terminou. A folha de baixo ganhou `repositionInputs={false}`, como a skill pede.

## 0.5.2 · 2026-10-06

- `ActionMenu` igual ao ajuste do Gabriel na biblioteca: itens de 192px de largura (painel com no mínimo 200px, padding 4) e divisor colado aos itens, sem margem.

## 0.5.1 · 2026-10-06

- **`bot-avatar` saiu da biblioteca:** o avatar do assistente é o `avatar` com o símbolo da marca. No código, `<Avatar size="small" name="AmbientAI" icon={<LogoAmbientAI type="mark" color="white" />} />`. O `BotAvatar` continua exportado, marcado como obsoleto, e agora usa o `Avatar` por dentro.
- **`Avatar`:** quando recebe `icon`, mostra o ícone mesmo com `name` (o nome fica só como nome acessível).

## 0.5.0 · 2026-10-06

- **`Card` (#25):** a caixa branca vazia da biblioteca (`card`): borda de 1px, raio 12, padding 16, conteúdo livre. `interactive` (ou `asChild` com um `Link`) liga hover (borda mais forte e sombra quase invisível) e foco. `cardClassName` também em `@inova-lab-ws/ui/variants`.
- **`Avatar variant="app"` (#26):** logo de app ou serviço no círculo, fundo branco e borda de 1px; sem logo, o ícone de pacote cinza. O `Avatar` de pessoa segue: inicial, ícone ou a foto que a própria pessoa enviou (`variant=photo` na biblioteca).

## 0.4.9 · 2026-10-06

- **`Header` (#21):** logo centralizada, como no Figma; ícone do botão de menu é o `chocolate-menu` da biblioteca (`ChocolateMenuIcon`), não mais o `LayoutGrid` do item "Apps"; `menuExpanded` (vira `aria-expanded`) e `menuButtonRef` para o app devolver o foco; `sticky` fixa no topo com `surface-page` a 95% e desfoque.
- **`ProfileMenu` (#22):** nome e e-mail quebram linha em vez de cortar com reticências; o painel não passa da largura da tela.
- **`Select` (#23):** seleção simples com o visual do `Input` (a biblioteca juntou o select no input, com o chevron à direita). É o `<select>` nativo: `label`, `help`, `error`, `placeholder`, `name`/`defaultValue` para formulário comum e `value`/`onChange` para uso controlado.
- **`MultiSelect` (#24):** `name` (1 campo escondido por valor), `defaultValue` para uso não controlado e `form` para um formulário em outro lugar da página.
- **`linkClassName` (#27):** estilo de link de texto, em `@inova-lab-ws/ui` e em `@inova-lab-ws/ui/variants`, para `<a>`, `Link` e `<button>` com cara de link.

## 0.4.8 · 2026-10-05

- **`ProfileMenu` (#18):** o menu da pessoa, desenhado na INOVA Lab Library (`profile-menu`). O avatar abre um painel com avatar grande, nome e e-mail, as ações do app (filhos, como `ActionMenuItem`) e "Sair" por último (`onSignOut`, ou `signOut` para trocar o item). Esc, clique fora e as setas vêm do `DropdownMenu` do Radix.

## 0.4.7 · 2026-10-05

- **Logos com tamanho padrão (#17):** o símbolo tem 20px de altura (o espaço de logo do trilho e do cabeçalho), wordmark e mark têm 14px; a largura segue o desenho. `className` muda o tamanho.
- **`ActionCard context="rail"` igual ao Figma (#19):** o fundo de hover e de selecionado fica só na caixa de 56×40 em volta do ícone; o rótulo vai embaixo, fora dela, em 12/600.
- **`Menu presentation="fullscreen"` fecha (#20):** barra de 64px no topo com a logo centralizada e o X à direita (`onClose`, `closeLabel` = "Fechar menu"); Esc chama `onClose`; o 1º item da navegação recebe o foco ao abrir.

## 0.4.6 · 2026-10-05

- `Avatar`: se a foto (`src`) não carregar, mostra a inicial. A foto é só a que a pessoa enviou no app, nunca a do provedor de login (#16).

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
