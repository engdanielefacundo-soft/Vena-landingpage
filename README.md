# Vena by Astron — Vigilância eletrônica de níveis de alagamento ?

Repositório oficial da plataforma web do **Vena**, sistema inteligente de monitoramento de galerias pluviais e prevenção de alagamentos urbanos desenvolvido pela **Astron**.

---

## 1. Visão Geral do Projeto

O **Vena** atua diretamente no interior dos bueiros para transformar a zeladoria municipal reativa em prevenção orientada por dados. Cada unidade instalada em gabinete estanque **IP67** utiliza dois sensores ultrassônicos para medir simultaneamente:

1. **Retenção de resíduos sólidos** logo abaixo da grelha pluvial.
2. **Elevação da lâmina d’água** no fundo da galeria.

As leituras são enviadas em tempo real via protocolo **MQTT** para o motor central, que cruza a condição física de cada ponto monitorado com a janela de previsão de chuva das próximas **48 horas**. Quando há previsão de chuva relevante, bueiros com acúmulo moderado de detritos têm sua prioridade elevada automaticamente na fila de limpeza e acionam alerta preventivo de **via interditada** junto à Defesa Civil.

---

## 2. Funcionalidades Implementadas

- **Showcase 3D Interativo**: Visualização do módulo Vena com levitação contínua e resposta física suave ao movimento do cursor e à rolagem.
- **Carrossel de Arquitetura em 3 Etapas (`#tecnologia`)**:
  - *Etapa 01 — Leitura Dupla na Galeria*: Diagrama interativo do corte da galeria e faixas operacionais (Verde · Livre, Amarelo · Atenção e Vermelho · Crítico).
  - *Etapa 02 — Monitoramento e Previsão de Chuva*: Fluxo de telemetria em nuvem e gráfico interativo da previsão horária de 48 horas.
  - *Etapa 03 — Priorização Inteligente da Limpeza*: Comparativo interativo de elevação preventiva de prioridade antes do temporal.
- **Gráficos Vetoriais Dinâmicos (`document.createElementNS`)**:
  - Renderização 100% dinâmica via JavaScript Vanilla sem bibliotecas externas.
  - Animações de entrada suaves com curva `cubic-bezier(0.16, 1, 0.3, 1)` acionadas via `IntersectionObserver`.
  - Destaque de item ativo, esmaecimento dos demais elementos e **tooltip flutuante** com cálculo automático de limites.
- **Simulador de Resultados na Bela Vista (`#resultados`)**:
  - Comparativo real entre dois pontos monitorados na Bela Vista (**Unidade 01 · Rua Treze de Maio** e **Unidade 02 · Av. 9 de Julho**) alternando entre a **Fase 1 · Sem Chuva** e a **Fase 2 · Com Chuva**.
- **Central de Dúvidas e Formulário Validado (`duvidas.html`)**:
  - Página dedicada com perguntas frequentes e formulário técnico.
  - **Validação contra envio de campos vazios**: bloqueia submissões em branco ou preenchidas apenas com espaços (`trim()`), sincroniza estados acessíveis (`aria-invalid`) e direciona o foco ao primeiro campo pendente.
  - **Limitador de caracteres em tempo real**: contadores ao vivo (`0 / 80`, `0 / 100` e `0 / 300 caracteres`) e barra de progresso dinâmica.

---

## 3. Estrutura de Pastas

```text
Vena-landingpage/
├── index.html                  # Página principal da plataforma Vena
├── duvidas.html                # Página dedicada de dúvidas e formulário validado
├── README.md                   # Documentação geral do projeto
├── IA.md                       # Documentação de prompts e resultados (exclusivo JavaScript)
└── assets/
    ├── css/
    │   └── style.css           # Sistema de design, variáveis e responsividade
    ├── js/
    │   └── script.js           # Motor de gráficos dinâmicos, carrossel e validação
    ├── img/
    │   ├── logo.png            # Logotipo Vena
    │   ├── logo-astron.png     # Logotipo Astron
    │   ├── logotitle.png       # Ícone da aba (favicon)
    │   └── vena-device.png     # Render 3D isométrico do hardware Vena IP67
    └── video/
        └── hero-bg-video.mp4   # Vídeo de fundo em loop das seções inicial e contato
```

---

## 4. Tecnologias Utilizadas

- **JavaScript Vanilla (ES6+)**: Manipulação de DOM, geração dinâmica de elementos via `document.createElementNS`, `IntersectionObserver`, `WeakMap`, `ValidityState` API e `requestAnimationFrame`.
- **HTML5 & CSS3**: Estruturação e variáveis de sistema sem uso de bibliotecas ou frameworks externos.

---

## 5. Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/engdanielefacundo-soft/Vena-landingpage.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd Vena-landingpage
   ```
3. Abra o arquivo `index.html` no navegador ou utilize uma extensão de servidor local (como *Live Server*).

---

**Desenvolvido por Astron — São Paulo, Brasil (2026).**
