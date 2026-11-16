(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. DECLARATIVE CHART DATASETS (Single Corporate Blue Hue & Tonal Variations)
     ========================================================================== */
  const CHART_DATASETS = {
    techEdge: {
      title: 'Interior da Galeria · Leitura Simultânea de Lixo e Água',
      badge: 'Proteção IP67',
      sensors: [
        {
          id: 'module-esp32',
          tag: 'Unidade de Borda',
          color: '#0059BC',
          title: 'Módulo Vena ESP32',
          metric: 'Gabinete Estanque IP67',
          desc: 'Processa localmente os ecos ultrassônicos e aciona a sinalização luminosa no bueiro.',
        },
        {
          id: 'sensor-debris',
          tag: 'Canal Acústico 01',
          color: '#3B82F6',
          title: 'Sensor de Resíduos Sólidos',
          metric: 'Faixa monitorada: Grelha Pluvial',
          desc: 'Detecta folhas, plásticos e sedimentos retidos logo abaixo da grade da via.',
        },
        {
          id: 'sensor-water',
          tag: 'Canal Acústico 02',
          color: '#1D4ED8',
          title: 'Sensor de Lâmina d’Água',
          metric: 'Faixa monitorada: Fundo da Galeria',
          desc: 'Acompanha a velocidade de subida da água dentro da tubulação pluvial.',
        },
      ],
      zones: [
        {
          id: 'zone-free',
          label: 'Verde · Livre',
          distance: 'Acima de 3 m',
          sublabel: 'Escoamento desobstruído',
          action: 'LED Verde aceso no bueiro',
          accent: '#10B981',
          textColor: '#0F172A',
          cardFill: '#F8FAFC',
          cardStroke: '#E2E8F0',
          barRatio: 0.28,
          tooltipTag: 'Nível Operacional 0',
          tooltipMetric: 'Distância livre > 3,0 m',
          tooltipDesc: 'Galeria limpa e fluxo pluvial normal. Sem necessidade de intervenção.',
        },
        {
          id: 'zone-warning',
          label: 'Amarelo · Atenção',
          distance: '1 a 3 m',
          sublabel: 'Retenção parcial de resíduos',
          action: 'LED Amarelo · Limpeza programada',
          accent: '#3B82F6',
          textColor: '#0F172A',
          cardFill: '#EFF6FF',
          cardStroke: '#BFDBFE',
          barRatio: 0.62,
          tooltipTag: 'Nível Operacional 1',
          tooltipMetric: 'Distância livre: 1,0 m a 3,0 m',
          tooltipDesc: 'Acúmulo moderado detectado. Entra na programação preventiva da zeladoria.',
        },
        {
          id: 'zone-critical',
          label: 'Vermelho · Crítico',
          distance: 'Até 1 m',
          sublabel: 'Risco iminente de transbordo',
          action: 'LED Vermelho · Via interditada',
          accent: '#0059BC',
          textColor: '#FFFFFF',
          cardFill: '#0059BC',
          cardStroke: '#0059BC',
          barRatio: 0.94,
          tooltipTag: 'Nível Operacional 2',
          tooltipMetric: 'Distância livre < 1,0 m',
          tooltipDesc: 'Despacho imediato de limpeza e emissão de alerta de via interditada pela Defesa Civil.',
        },
      ],
    },

    techForecast: {
      title: 'Conexão em Tempo Real & Previsão das Próximas 48 Horas',
      badge: 'Leitura Contínua',
      pipeline: [
        {
          step: '01 · BUEIROS NA VIA',
          title: 'Sensores ESP32',
          subtitle: 'Enviam nível de lixo e água',
          fill: '#F8FAFC',
          stroke: '#DBEAFE',
          dark: false,
          tooltipMetric: 'Leitura contínua em campo',
          tooltipDesc: 'Cada módulo mede lixo e água dentro da galeria e transmite via Wi-Fi.',
        },
        {
          step: '02 · REDE EM NUVEM',
          title: 'Mensageria MQTT',
          subtitle: 'Comunicação instantânea',
          fill: '#EFF6FF',
          stroke: '#93C5FD',
          dark: false,
          tooltipMetric: 'Tópicos isolados por bueiro',
          tooltipDesc: 'Transmissão leve que permite expandir a rede municipal sem alterar os módulos instalados.',
        },
        {
          step: '03 · CENTRAL VENA',
          title: 'Motor Inteligente',
          subtitle: 'Cruza clima e obstrução',
          fill: '#0059BC',
          stroke: '#0059BC',
          dark: true,
          tooltipMetric: 'Varredura meteorológica 48h',
          tooltipDesc: 'Combina a condição física do bueiro com a previsão horária da Open-Meteo.',
        },
      ],
      hourlyForecast: [
        { label: 'Agora', mm: 0.2, height: 12, fill: '#BFDBFE', status: 'Tempo firme · 0,2 mm/h', desc: 'Sem precipitação relevante no momento.' },
        { label: 'Em 2h', mm: 6.4, height: 76, fill: '#3B82F6', status: 'Gatilho ativado · 6,4 mm/h', desc: 'Frente de chuva detectada: bueiros com lixo sobem de prioridade.' },
        { label: 'Em 6h', mm: 18.0, height: 118, fill: '#0059BC', status: 'Pico de temporal · 18,0 mm/h', desc: 'Limpeza preventiva já concluída antes do pico de precipitação.' },
        { label: 'Em 12h', mm: 14.2, height: 98, fill: '#0059BC', status: 'Chuva persistente · 14,2 mm/h', desc: 'Monitoramento contínuo da lâmina d’água nas galerias.' },
        { label: 'Em 18h', mm: 4.8, height: 52, fill: '#3B82F6', status: 'Chuva moderada · 4,8 mm/h', desc: 'Escoamento estabilizado nos pontos desobstruídos.' },
        { label: 'Em 24h', mm: 0.4, height: 16, fill: '#93C5FD', status: 'Estiagem · 0,4 mm/h', desc: 'Retorno ao regime normal de observação.' },
        { label: 'Em 36h', mm: 2.8, height: 38, fill: '#60A5FA', status: 'Chuva leve · 2,8 mm/h', desc: 'Nova janela monitorada automaticamente pela central.' },
        { label: 'Em 48h', mm: 0.1, height: 12, fill: '#BFDBFE', status: 'Tempo firme · 0,1 mm/h', desc: 'Fechamento do horizonte preditivo de 48 horas.' },
      ],
    },

    techPriority: {
      title: 'Elevação Preventiva de Prioridade Antes do Temporal',
      badge: 'Fila em Tempo Real',
      scenarios: [
        {
          id: 'prio-clean',
          name: 'Galeria Limpa',
          condition: 'Sem resíduos · Com ou sem chuva',
          baseScore: 18,
          finalScore: 18,
          statusLabel: 'Livre · Monitoramento',
          dotColor: '#10B981',
          barColor: '#10B981',
          tooltipMetric: 'Prioridade Baixa · Fluxo Livre',
          tooltipDesc: 'Mesmo com previsão de chuva, a galeria limpa escoa normalmente e não consome equipe.',
        },
        {
          id: 'prio-dry-debris',
          name: 'Bueiro com Resíduos · Fase Sem Chuva',
          condition: 'Grelha parcialmente obstruída · Tempo firme',
          baseScore: 54,
          finalScore: 54,
          statusLabel: 'Atenção · Rotina',
          dotColor: '#3B82F6',
          barColor: '#3B82F6',
          tooltipMetric: 'Prioridade Moderada · Limpeza na Rotina',
          tooltipDesc: 'Sinalização em LED amarelo no bueiro e agendamento preventivo para a equipe de zeladoria.',
        },
        {
          id: 'prio-rain-debris',
          name: 'Bueiro com Resíduos · Fase Com Chuva',
          condition: 'Grelha obstruída + Chuva prevista em 2h',
          baseScore: 54,
          finalScore: 96,
          statusLabel: 'Crítico · 1º da Fila',
          dotColor: '#DBEAFE',
          barColor: '#0059BC',
          tooltipMetric: 'Prioridade Máxima · Despacho + Via Interditada',
          tooltipDesc: 'A aproximação da chuva eleva o risco automaticamente: limpeza imediata e alerta da Defesa Civil.',
        },
      ],
    },

    resultsComparison: {
      units: [
        {
          id: 'treze-maio',
          name: 'Unidade 01 · Rua Treze de Maio',
          centerX: 334,
          phases: [
            {
              key: 'dry',
              groupId: 'svg-bv-dry',
              barId: 'svg-bv-dry-bar',
              phaseLabel: 'Sem Chuva',
              statusLabel: 'Livre',
              x: 264,
              y: 280,
              width: 60,
              height: 46,
              fill: '#10B981',
              textColor: '#10B981',
              dotColor: '#10B981',
              tooltipTag: 'Bela Vista · Fase 1 · Sem Chuva',
              tooltipTitle: 'Rua Treze de Maio · Galeria Livre',
              tooltipMetric: 'Distância livre > 3,0 m · LED Verde',
              tooltipDesc: 'Ponto na cota alta da Bela Vista sem resíduos na grelha e com nível da água normal.',
            },
            {
              key: 'rain',
              groupId: 'svg-bv-rain',
              barId: 'svg-bv-rain-bar',
              phaseLabel: 'Com Chuva',
              statusLabel: 'Livre',
              x: 344,
              y: 280,
              width: 60,
              height: 46,
              fill: '#10B981',
              textColor: '#10B981',
              dotColor: '#10B981',
              tooltipTag: 'Bela Vista · Fase 2 · Com Chuva',
              tooltipTitle: 'Rua Treze de Maio · Estável',
              tooltipMetric: 'Escoamento Pleno · 2º na Fila',
              tooltipDesc: 'Por estar desobstruído, mantém vazão normal na Bela Vista mesmo com chuva prevista.',
            },
          ],
        },
        {
          id: 'nove-julho',
          name: 'Unidade 02 · Av. 9 de Julho',
          centerX: 542,
          phases: [
            {
              key: 'dry',
              groupId: 'svg-9j-dry',
              barId: 'svg-9j-dry-bar',
              phaseLabel: 'Sem Chuva',
              statusLabel: 'Atenção',
              x: 472,
              y: 186,
              width: 60,
              height: 140,
              fill: '#3B82F6',
              textColor: '#0059BC',
              dotColor: '#3B82F6',
              tooltipTag: 'Bela Vista · Fase 1 · Sem Chuva',
              tooltipTitle: 'Av. 9 de Julho · Atenção',
              tooltipMetric: 'Retenção entre 1 m e 3 m · LED Amarelo',
              tooltipDesc: 'Ponto de vale na Bela Vista com resíduos na grelha. Sem chuva, segue em limpeza programada.',
            },
            {
              key: 'rain',
              groupId: 'svg-9j-rain',
              barId: 'svg-9j-rain-bar',
              phaseLabel: 'Com Chuva',
              statusLabel: 'Crítico',
              x: 552,
              y: 98,
              width: 60,
              height: 228,
              fill: '#0059BC',
              textColor: '#0059BC',
              dotColor: '#0059BC',
              tooltipTag: 'Bela Vista · Fase 2 · Com Chuva',
              tooltipTitle: 'Av. 9 de Julho · Prioridade Crítica',
              tooltipMetric: '1º na Fila · LED Vermelho + Defesa Civil',
              tooltipDesc: 'Com chuva prevista na Bela Vista, sobe para Crítico: limpeza imediata e alerta de via interditada.',
            },
          ],
        },
      ],
    },
  };

  /* ==========================================================================
     2. DYNAMIC SVG FACTORY (document.createElementNS)
     ========================================================================== */
  function createSvgEl(tag, attrs, textContent) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          el.setAttribute(key, String(value));
        }
      });
    }
    if (textContent !== undefined && textContent !== null) {
      el.textContent = String(textContent);
    }
    return el;
  }

  function attachTooltipMetadata(svgGroup, meta) {
    svgGroup.classList.add('chart-data-item');
    svgGroup.setAttribute('tabindex', '0');
    svgGroup.setAttribute('role', 'graphics-symbol');
    svgGroup.setAttribute('aria-label', `${meta.title} — ${meta.metric}`);
    svgGroup.dataset.tooltipTag = meta.tag || '';
    svgGroup.dataset.tooltipColor = meta.color || '#0059BC';
    svgGroup.dataset.tooltipTitle = meta.title || '';
    svgGroup.dataset.tooltipMetric = meta.metric || '';
    svgGroup.dataset.tooltipDesc = meta.desc || '';
    if (meta.phaseKey) {
      svgGroup.dataset.phaseKey = meta.phaseKey;
    }
  }

  /**
   * Standardized Top Header + Top-Right Legend Rect for all "Como funciona" charts
   */
  function appendStandardChartHeader(svg, titleText, badgeText) {
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 28, y: 36, fill: '#0F172A', 'font-family': 'Inter, sans-serif', 'font-size': 13, 'font-weight': 700 },
        titleText
      )
    );
    svg.appendChild(
      createSvgEl('rect', {
        x: 492,
        y: 18,
        width: 160,
        height: 26,
        rx: 13,
        fill: '#EFF6FF',
        stroke: '#BFDBFE',
        'stroke-width': 1,
      })
    );
    svg.appendChild(createSvgEl('circle', { cx: 508, cy: 31, r: 4, fill: '#0059BC' }));
    svg.appendChild(
      createSvgEl(
        'text',
        {
          x: 520,
          y: 35,
          fill: '#0059BC',
          'font-family': 'Inter, sans-serif',
