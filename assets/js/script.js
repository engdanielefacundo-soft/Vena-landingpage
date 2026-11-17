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
          'font-size': 11,
          'font-weight': 700,
        },
        badgeText
      )
    );
    svg.appendChild(createSvgEl('line', { x1: 28, y1: 56, x2: 652, y2: 56, stroke: '#E2E8F0' }));
  }

  /* ==========================================================================
     3. SVG CHART RENDERERS (Tecnologia 01, 02, 03 & Resultados)
     ========================================================================== */
  function buildTechEdgeChart() {
    const data = CHART_DATASETS.techEdge;
    const svg = createSvgEl('svg', {
      role: 'img',
      'aria-label': data.title,
      class: 'technical-svg',
      viewBox: '0 0 680 420',
      fill: 'none',
    });

    svg.appendChild(createSvgEl('rect', { width: 680, height: 420, rx: 10, fill: '#FFFFFF' }));
    appendStandardChartHeader(svg, data.title, data.badge);

    // Left Panel: Storm Drain Cross-Section
    svg.appendChild(createSvgEl('rect', { x: 28, y: 72, width: 344, height: 320, rx: 8, fill: '#F8FAFC', stroke: '#E2E8F0' }));
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 48, y: 92, fill: '#475569', 'font-family': 'Inter, sans-serif', 'font-size': 11, 'font-weight': 600 },
        'Nível da Rua · Grelha Pluvial'
      )
    );
    svg.appendChild(createSvgEl('rect', { x: 48, y: 102, width: 304, height: 12, rx: 4, fill: '#CBD5E1' }));
    [80, 128, 176, 224, 272].forEach((slotX) => {
      svg.appendChild(createSvgEl('rect', { x: slotX, y: 102, width: 22, height: 12, fill: '#FFFFFF' }));
    });

    // Interactive Node 1: Vena Hardware Module
    const moduleGroup = createSvgEl('g', { class: 'chart-node-pop', style: '--anim-delay: 60ms' });
    attachTooltipMetadata(moduleGroup, data.sensors[0]);
    moduleGroup.appendChild(createSvgEl('rect', { x: 90, y: 126, width: 220, height: 70, rx: 8, fill: '#0059BC' }));
    moduleGroup.appendChild(createSvgEl('rect', { x: 108, y: 140, width: 68, height: 20, rx: 10, fill: 'rgba(255,255,255,0.16)' }));
    moduleGroup.appendChild(
      createSvgEl(
        'text',
        { x: 142, y: 154, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 700 },
        'ESP32'
      )
    );
    moduleGroup.appendChild(createSvgEl('circle', { cx: 264, cy: 150, r: 5, fill: '#10B981' }));
    moduleGroup.appendChild(createSvgEl('circle', { cx: 278, cy: 150, r: 5, fill: '#F59E0B' }));
    moduleGroup.appendChild(createSvgEl('circle', { cx: 292, cy: 150, r: 5, fill: '#EF4444' }));
    moduleGroup.appendChild(
      createSvgEl(
        'text',
        { x: 108, y: 180, fill: '#FFFFFF', 'font-family': 'Inter, sans-serif', 'font-size': 14, 'font-weight': 700 },
        'Módulo Vena'
      )
    );
    svg.appendChild(moduleGroup);

    // Interactive Node 2: Sensor Lixo + Waves + Debris Target
    const debrisGroup = createSvgEl('g', { class: 'chart-node-pop', style: '--anim-delay: 140ms' });
    attachTooltipMetadata(debrisGroup, data.sensors[1]);
    debrisGroup.appendChild(createSvgEl('rect', { x: 108, y: 196, width: 74, height: 20, rx: 4, fill: '#3B82F6' }));
    debrisGroup.appendChild(
      createSvgEl(
        'text',
        { x: 145, y: 210, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-family': 'Inter, sans-serif', 'font-size': 9.5, 'font-weight': 700 },
        'Sensor Lixo'
      )
    );
    debrisGroup.appendChild(
      createSvgEl('path', { d: 'M128 228 Q145 238 162 228', stroke: '#3B82F6', 'stroke-width': 2.2, 'stroke-linecap': 'round' })
    );
    debrisGroup.appendChild(
      createSvgEl('path', {
        d: 'M120 244 Q145 256 170 244',
        stroke: '#3B82F6',
        'stroke-width': 2.2,
        'stroke-linecap': 'round',
        opacity: 0.75,
      })
    );
    debrisGroup.appendChild(
      createSvgEl('path', {
        d: 'M112 260 Q145 272 178 260',
        stroke: '#3B82F6',
        'stroke-width': 2.2,
        'stroke-linecap': 'round',
        opacity: 0.45,
      })
    );
    debrisGroup.appendChild(
      createSvgEl('rect', { x: 90, y: 274, width: 110, height: 28, rx: 6, fill: '#FFFFFF', stroke: '#3B82F6', 'stroke-width': 1.75 })
    );
    debrisGroup.appendChild(
      createSvgEl(
        'text',
        { x: 145, y: 292, 'text-anchor': 'middle', fill: '#0059BC', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 700 },
        'Resíduos Sólidos'
      )
    );
    svg.appendChild(debrisGroup);

    // Interactive Node 3: Sensor Agua + Waves + Water Column
    const waterGroup = createSvgEl('g', { class: 'chart-node-pop', style: '--anim-delay: 220ms' });
    attachTooltipMetadata(waterGroup, data.sensors[2]);
    waterGroup.appendChild(createSvgEl('rect', { x: 228, y: 196, width: 74, height: 20, rx: 4, fill: '#1D4ED8' }));
    waterGroup.appendChild(
      createSvgEl(
        'text',
        { x: 265, y: 210, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-family': 'Inter, sans-serif', 'font-size': 9.5, 'font-weight': 700 },
        'Sensor Água'
      )
    );
    waterGroup.appendChild(
      createSvgEl('line', {
        x1: 265,
        y1: 218,
        x2: 265,
        y2: 330,
        stroke: '#0059BC',
        'stroke-width': 1.75,
        'stroke-dasharray': '4 4',
      })
    );
    waterGroup.appendChild(
      createSvgEl('path', { d: 'M248 246 Q265 256 282 246', stroke: '#0059BC', 'stroke-width': 2.2, 'stroke-linecap': 'round' })
    );
    waterGroup.appendChild(
      createSvgEl('path', {
        d: 'M240 276 Q265 288 290 276',
        stroke: '#0059BC',
        'stroke-width': 2.2,
        'stroke-linecap': 'round',
        opacity: 0.7,
      })
    );
    waterGroup.appendChild(
      createSvgEl('path', {
        d: 'M232 306 Q265 320 298 306',
        stroke: '#0059BC',
        'stroke-width': 2.2,
        'stroke-linecap': 'round',
        opacity: 0.45,
      })
    );
    waterGroup.appendChild(
      createSvgEl('path', {
        d: 'M48 338 Q124 330 200 338 T352 338 L352 378 L48 378 Z',
        fill: '#0059BC',
      })
    );
    waterGroup.appendChild(
      createSvgEl('path', {
        d: 'M48 338 Q124 330 200 338 T352 338',
        stroke: '#93C5FD',
        'stroke-width': 2,
      })
    );
    waterGroup.appendChild(
      createSvgEl(
        'text',
        { x: 200, y: 363, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-family': 'Inter, sans-serif', 'font-size': 11.5, 'font-weight': 600 },
        'Lâmina d’Água no Fundo da Galeria'
      )
    );
    svg.appendChild(waterGroup);

    // Right Panel: 3 Interactive Zone Cards with Animated Progress Bars
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 396, y: 90, fill: '#0F172A', 'font-family': 'Inter, sans-serif', 'font-size': 13, 'font-weight': 700 },
        'Faixas de Alerta no Bueiro'
      )
    );
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 396, y: 110, fill: '#475569', 'font-family': 'Inter, sans-serif', 'font-size': 11.5 },
        'Passe o cursor para inspecionar cada nível'
      )
    );

    const cardYPositions = [124, 216, 308];
    data.zones.forEach((zone, index) => {
      const y = cardYPositions[index];
      const isDark = zone.cardFill === '#0059BC';
      const zoneGroup = createSvgEl('g', {
        class: 'chart-node-pop',
        style: `--anim-delay: ${140 + index * 90}ms`,
      });
      attachTooltipMetadata(zoneGroup, {
        tag: zone.tooltipTag,
        color: zone.accent,
        title: zone.label,
        metric: zone.tooltipMetric,
        desc: zone.tooltipDesc,
      });

      zoneGroup.appendChild(
        createSvgEl('rect', {
          x: 396,
          y,
          width: 256,
          height: 82,
          rx: 8,
          fill: zone.cardFill,
          stroke: zone.cardStroke,
        })
      );
      zoneGroup.appendChild(
        createSvgEl('rect', {
          x: 396,
          y,
          width: 6,
          height: 82,
          rx: 3,
          fill: isDark ? '#93C5FD' : zone.accent,
        })
      );
      zoneGroup.appendChild(
        createSvgEl(
          'text',
          { x: 416, y: y + 24, fill: zone.textColor, 'font-family': 'Inter, sans-serif', 'font-size': 12.5, 'font-weight': 700 },
          zone.label
        )
      );
      zoneGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: 636,
            y: y + 24,
            'text-anchor': 'end',
            fill: isDark ? '#DBEAFE' : zone.accent,
            'font-family': 'Inter, sans-serif',
            'font-size': 11,
            'font-weight': 700,
          },
          zone.distance
        )
      );
      zoneGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: 416,
            y: y + 44,
            fill: isDark ? '#DBEAFE' : '#475569',
            'font-family': 'Inter, sans-serif',
            'font-size': 11,
          },
          zone.sublabel
        )
      );

      const trackWidth = 220;
      zoneGroup.appendChild(
        createSvgEl('rect', {
          x: 416,
          y: y + 54,
          width: trackWidth,
          height: 6,
          rx: 3,
          fill: isDark ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
        })
      );
      zoneGroup.appendChild(
        createSvgEl('rect', {
          x: 416,
          y: y + 54,
          width: Math.round(trackWidth * zone.barRatio),
          height: 6,
          rx: 3,
          fill: isDark ? '#FFFFFF' : zone.accent,
          class: 'chart-bar-grow-x',
          style: `--anim-delay: ${260 + index * 110}ms`,
        })
      );

      zoneGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: 416,
            y: y + 73,
            fill: isDark ? '#FFFFFF' : '#0059BC',
            'font-family': 'Inter, sans-serif',
            'font-size': 10.5,
            'font-weight': 600,
          },
          zone.action
        )
      );

      svg.appendChild(zoneGroup);
    });

    return svg;
  }

  function buildTechForecastChart() {
    const data = CHART_DATASETS.techForecast;
    const svg = createSvgEl('svg', {
      role: 'img',
      'aria-label': data.title,
      class: 'technical-svg',
      viewBox: '0 0 680 420',
      fill: 'none',
    });

    svg.appendChild(createSvgEl('rect', { width: 680, height: 420, rx: 10, fill: '#FFFFFF' }));
    appendStandardChartHeader(svg, data.title, data.badge);

    // Top Row: 3 Interactive Pipeline Nodes
    const nodePositions = [28, 248, 468];
    data.pipeline.forEach((node, idx) => {
      const x = nodePositions[idx];
      const nodeGroup = createSvgEl('g', {
        class: 'chart-node-pop',
        style: `--anim-delay: ${60 + idx * 80}ms`,
      });
      attachTooltipMetadata(nodeGroup, {
        tag: node.step,
        color: '#0059BC',
        title: node.title,
        metric: node.tooltipMetric,
        desc: node.tooltipDesc,
      });

      nodeGroup.appendChild(
        createSvgEl('rect', {
          x,
          y: 70,
          width: 184,
          height: 84,
          rx: 8,
          fill: node.fill,
          stroke: node.stroke,
          'stroke-width': 1.5,
        })
      );
      nodeGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: x + 18,
            y: 96,
            fill: node.dark ? '#DBEAFE' : '#0059BC',
            'font-family': 'Inter, sans-serif',
            'font-size': 10.5,
            'font-weight': 700,
          },
          node.step
        )
      );
      nodeGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: x + 18,
            y: 120,
            fill: node.dark ? '#FFFFFF' : '#0F172A',
            'font-family': 'Inter, sans-serif',
            'font-size': 15,
            'font-weight': 700,
          },
          node.title
        )
      );
      nodeGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: x + 18,
            y: 140,
            fill: node.dark ? '#EFF6FF' : '#475569',
            'font-family': 'Inter, sans-serif',
            'font-size': 11.5,
          },
          node.subtitle
        )
      );
      svg.appendChild(nodeGroup);

      if (idx < 2) {
        const lineX1 = x + 184;
        const lineX2 = lineX1 + 32;
        svg.appendChild(createSvgEl('line', { x1: lineX1, y1: 112, x2: lineX2, y2: 112, stroke: '#0059BC', 'stroke-width': 2 }));
        svg.appendChild(createSvgEl('polygon', { points: `${lineX2 + 4},112 ${lineX2 - 5},106 ${lineX2 - 5},118`, fill: '#0059BC' }));
      }
    });

    // Bottom Chart Frame: 48h Rain Forecast
    svg.appendChild(createSvgEl('rect', { x: 28, y: 170, width: 624, height: 224, rx: 8, fill: '#F8FAFC', stroke: '#E2E8F0' }));
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 52, y: 200, fill: '#0F172A', 'font-family': 'Inter, sans-serif', 'font-size': 12.5, 'font-weight': 700 },
        'Janela de Previsão para as Próximas 48 Horas'
      )
    );
    svg.appendChild(createSvgEl('rect', { x: 444, y: 182, width: 184, height: 24, rx: 12, fill: '#0059BC' }));
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 536, y: 198, 'text-anchor': 'middle', fill: '#FFFFFF', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 700 },
        'Chuva prevista em 2 horas'
      )
    );
    svg.appendChild(createSvgEl('line', { x1: 52, y1: 216, x2: 628, y2: 216, stroke: '#E2E8F0' }));

    // Threshold line & baseline
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 628, y: 264, 'text-anchor': 'end', fill: '#0059BC', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 600 },
        'Gatilho de chuva relevante'
      )
    );
    svg.appendChild(
      createSvgEl('line', {
        x1: 52,
        y1: 274,
        x2: 628,
        y2: 274,
        stroke: '#3B82F6',
        'stroke-width': 1.5,
        'stroke-dasharray': '6 4',
      })
    );
    svg.appendChild(createSvgEl('line', { x1: 52, y1: 350, x2: 628, y2: 350, stroke: '#CBD5E1', 'stroke-width': 1.5 }));

    const baselineY = 350;
    const barPoints = data.hourlyForecast.map((point, idx) => {
      const barX = 76 + idx * 72;
      const centerX = barX + 18;
      const topY = baselineY - point.height;
      return { barX, centerX, topY, point };
    });

    const polylineCoords = barPoints.map((p) => `${p.centerX},${p.topY}`).join(' ');
    svg.appendChild(
      createSvgEl('polyline', {
        points: polylineCoords,
        fill: 'none',
        stroke: '#93C5FD',
        'stroke-width': 2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        class: 'chart-line-draw',
        style: '--anim-delay: 240ms',
      })
    );

    barPoints.forEach(({ barX, centerX, topY, point }, idx) => {
      const barGroup = createSvgEl('g');
      attachTooltipMetadata(barGroup, {
        tag: `Horizonte · ${point.label}`,
        color: point.height >= 76 ? '#0059BC' : '#3B82F6',
        title: `Previsão ${point.label}`,
        metric: point.status,
        desc: point.desc,
      });

      barGroup.appendChild(
        createSvgEl('rect', {
          x: barX - 10,
          y: 224,
          width: 56,
          height: 156,
          fill: 'transparent',
        })
      );

      barGroup.appendChild(
        createSvgEl('rect', {
          x: barX,
          y: topY,
          width: 36,
          height: point.height,
          rx: 4,
          fill: point.fill,
          class: 'chart-bar-grow-y',
          style: `--anim-delay: ${100 + idx * 65}ms`,
        })
      );

      barGroup.appendChild(
        createSvgEl('circle', {
          cx: centerX,
          cy: topY,
          r: 4,
          fill: '#FFFFFF',
          stroke: '#0059BC',
          'stroke-width': 2,
          class: 'chart-node-pop',
          style: `--anim-delay: ${260 + idx * 65}ms`,
        })
      );

      barGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: centerX,
            y: 374,
            'text-anchor': 'middle',
            fill: point.height >= 76 ? '#0059BC' : '#475569',
            'font-family': 'Inter, sans-serif',
            'font-size': 11,
            'font-weight': point.height >= 76 ? 700 : 500,
          },
          point.label
        )
      );

      svg.appendChild(barGroup);
    });

    return svg;
  }

  function buildTechPriorityChart() {
    const data = CHART_DATASETS.techPriority;
    const svg = createSvgEl('svg', {
      role: 'img',
      'aria-label': data.title,
      class: 'technical-svg',
      viewBox: '0 0 680 420',
      fill: 'none',
    });

    svg.appendChild(createSvgEl('rect', { width: 680, height: 420, rx: 10, fill: '#FFFFFF' }));
    appendStandardChartHeader(svg, data.title, data.badge);

    const rowYPositions = [76, 158, 240];
    const maxBarWidth = 360;

    data.scenarios.forEach((scen, idx) => {
      const y = rowYPositions[idx];
      const isCritical = idx === 2;
      const isWarning = idx === 1;
      const rowGroup = createSvgEl('g', {
        class: 'chart-node-pop',
        style: `--anim-delay: ${80 + idx * 100}ms`,
      });
      attachTooltipMetadata(rowGroup, {
        tag: scen.statusLabel,
        color: isCritical ? '#0059BC' : scen.dotColor,
        title: scen.name,
        metric: scen.tooltipMetric,
        desc: scen.tooltipDesc,
      });

      rowGroup.appendChild(
        createSvgEl('rect', {
          x: 28,
          y,
          width: 624,
          height: 70,
          rx: 8,
          fill: isCritical ? '#0059BC' : isWarning ? '#EFF6FF' : '#F8FAFC',
          stroke: isCritical ? '#0059BC' : isWarning ? '#BFDBFE' : '#E2E8F0',
        })
      );

      rowGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: 48,
            y: y + 26,
            fill: isCritical ? '#FFFFFF' : '#0F172A',
            'font-family': 'Inter, sans-serif',
            'font-size': 13,
            'font-weight': 700,
          },
          scen.name
        )
      );
      rowGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: 48,
            y: y + 44,
            fill: isCritical ? '#DBEAFE' : '#475569',
            'font-family': 'Inter, sans-serif',
            'font-size': 11,
          },
          scen.condition
        )
      );

      const trackX = 48;
      const trackY = y + 54;
      rowGroup.appendChild(
        createSvgEl('rect', {
          x: trackX,
          y: trackY,
          width: maxBarWidth,
          height: 7,
          rx: 3.5,
          fill: isCritical ? 'rgba(255,255,255,0.2)' : '#DBEAFE',
        })
      );
      rowGroup.appendChild(
        createSvgEl('rect', {
          x: trackX,
          y: trackY,
          width: Math.round((scen.finalScore / 100) * maxBarWidth),
          height: 7,
          rx: 3.5,
          fill: isCritical ? '#FFFFFF' : scen.barColor,
          class: 'chart-bar-grow-x',
          style: `--anim-delay: ${220 + idx * 120}ms`,
        })
      );

      rowGroup.appendChild(
        createSvgEl('rect', {
          x: 472,
          y: y + 18,
          width: 160,
          height: 34,
          rx: 6,
          fill: isCritical ? 'rgba(255,255,255,0.14)' : '#FFFFFF',
          stroke: isCritical ? '#93C5FD' : '#BFDBFE',
        })
      );
      rowGroup.appendChild(
        createSvgEl('circle', {
          cx: 490,
          cy: y + 35,
          r: 5,
          fill: scen.dotColor,
        })
      );
      rowGroup.appendChild(
        createSvgEl(
          'text',
          {
            x: 504,
            y: y + 39,
            fill: isCritical ? '#FFFFFF' : '#0059BC',
            'font-family': 'Inter, sans-serif',
            'font-size': 11.5,
            'font-weight': 700,
          },
          scen.statusLabel
        )
      );

      svg.appendChild(rowGroup);
    });

    // Bottom Operational Summary Bar
    svg.appendChild(createSvgEl('rect', { x: 28, y: 326, width: 624, height: 68, rx: 8, fill: '#EFF6FF', stroke: '#BFDBFE' }));
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 52, y: 352, fill: '#0059BC', 'font-family': 'Inter, sans-serif', 'font-size': 11, 'font-weight': 700 },
        'RESULTADO OPERACIONAL'
      )
    );
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 52, y: 374, fill: '#0F172A', 'font-family': 'Inter, sans-serif', 'font-size': 12.5, 'font-weight': 600 },
        'A limpeza chega antes da chuva cair e a Defesa Civil interdita preventivamente vias críticas.'
      )
    );

    return svg;
  }

  function buildResultsComparisonChart() {
    const data = CHART_DATASETS.resultsComparison;
    const svg = createSvgEl('svg', {
      role: 'img',
      'aria-label':
        'Gráfico comparativo das duas fases climáticas na Bela Vista mostrando Rua Treze de Maio livre nas duas fases e Av. 9 de Julho subindo de Atenção sem chuva para Crítico com chuva',
      class: 'results-svg',
      viewBox: '0 0 680 400',
      fill: 'none',
    });

    svg.appendChild(createSvgEl('rect', { width: 680, height: 400, rx: 10, fill: '#FFFFFF' }));

    // Top Header / Legend Row
    svg.appendChild(createSvgEl('circle', { cx: 36, cy: 30, r: 5, fill: '#3B82F6' }));
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 48, y: 34, fill: '#475569', 'font-family': 'Inter, sans-serif', 'font-size': 11.5, 'font-weight': 600 },
        'Fase 1 · Sem Chuva'
      )
    );
    svg.appendChild(createSvgEl('circle', { cx: 188, cy: 30, r: 5, fill: '#0059BC' }));
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 200, y: 34, fill: '#0059BC', 'font-family': 'Inter, sans-serif', 'font-size': 11.5, 'font-weight': 700 },
        'Fase 2 · Com Chuva'
      )
    );
    svg.appendChild(
      createSvgEl(
        'text',
        {
          x: 652,
          y: 34,
          'text-anchor': 'end',
          fill: '#0059BC',
          'font-family': 'Inter, sans-serif',
          'font-size': 11,
          'font-weight': 600,
          id: 'svg-phase-summary',
        },
        'Sem chuva: limpeza programada'
      )
    );
    svg.appendChild(createSvgEl('line', { x1: 28, y1: 52, x2: 652, y2: 52, stroke: '#E2E8F0' }));

    // 3 Horizontal Operational Zones
    svg.appendChild(
      createSvgEl('rect', { x: 28, y: 68, width: 624, height: 86, rx: 6, fill: '#0059BC', 'fill-opacity': 0.06 })
    );
    svg.appendChild(
      createSvgEl('line', {
        x1: 28,
        y1: 154,
        x2: 652,
        y2: 154,
        stroke: '#0059BC',
        'stroke-width': 1.25,
        'stroke-dasharray': '5 4',
      })
    );

    svg.appendChild(createSvgEl('rect', { x: 28, y: 154, width: 624, height: 86, fill: '#EFF6FF', 'fill-opacity': 0.6 }));
    svg.appendChild(
      createSvgEl('line', {
        x1: 28,
        y1: 240,
        x2: 652,
        y2: 240,
        stroke: '#3B82F6',
        'stroke-width': 1.2,
        'stroke-dasharray': '4 4',
      })
    );

    svg.appendChild(createSvgEl('rect', { x: 28, y: 240, width: 624, height: 86, fill: '#F8FAFC' }));
    svg.appendChild(createSvgEl('line', { x1: 28, y1: 326, x2: 652, y2: 326, stroke: '#CBD5E1', 'stroke-width': 1.5 }));

    // Dedicated Left Y-Axis Zone Labels Column (x=28..224)
    svg.appendChild(createSvgEl('line', { x1: 224, y1: 68, x2: 224, y2: 326, stroke: '#E2E8F0', 'stroke-width': 1.5 }));

    svg.appendChild(
      createSvgEl(
        'text',
        { x: 42, y: 104, fill: '#0059BC', 'font-family': 'Inter, sans-serif', 'font-size': 12, 'font-weight': 700 },
        'CRÍTICO'
      )
    );
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 42, y: 124, fill: '#475569', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 600 },
        'LED Vermelho · Via Interditada'
      )
    );

    svg.appendChild(
      createSvgEl(
        'text',
        { x: 42, y: 190, fill: '#0059BC', 'font-family': 'Inter, sans-serif', 'font-size': 12, 'font-weight': 700 },
        'ATENÇÃO'
      )
    );
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 42, y: 210, fill: '#475569', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 600 },
        'LED Amarelo · Limpeza na Rotina'
      )
    );

    svg.appendChild(
      createSvgEl(
        'text',
        { x: 42, y: 276, fill: '#10B981', 'font-family': 'Inter, sans-serif', 'font-size': 12, 'font-weight': 700 },
        'LIVRE'
      )
    );
    svg.appendChild(
      createSvgEl(
        'text',
        { x: 42, y: 296, fill: '#475569', 'font-family': 'Inter, sans-serif', 'font-size': 10.5, 'font-weight': 600 },
        'LED Verde · Fluxo Normal'
      )
    );

    // Render Each Unit's Dual-Phase Bars
    data.units.forEach((unit, unitIdx) => {
      const unitContainer = createSvgEl('g', { id: `svg-group-${unit.id}` });

      unit.phases.forEach((phase, phaseIdx) => {
        const isDry = phase.key === 'dry';
        const phaseGroup = createSvgEl('g', {
          id: phase.groupId,
          opacity: isDry ? '1' : '0.42',
        });

        attachTooltipMetadata(phaseGroup, {
          tag: phase.tooltipTag,
          color: phase.dotColor,
          title: phase.tooltipTitle,
          metric: phase.tooltipMetric,
          desc: phase.tooltipDesc,
          phaseKey: phase.key,
        });

        phaseGroup.appendChild(
          createSvgEl('rect', {
            x: phase.x - 6,
            y: 72,
            width: phase.width + 12,
            height: 282,
            fill: 'transparent',
          })
        );

        const barAttrs = {
          id: phase.barId,
          x: phase.x,
          y: phase.y,
          width: phase.width,
          height: phase.height,
          rx: 6,
          fill: phase.fill,
          class: 'chart-bar-grow-y',
          style: `--anim-delay: ${120 + (unitIdx * 2 + phaseIdx) * 110}ms`,
        };
        if (phase.barId === 'svg-9j-dry-bar') {
          barAttrs.stroke = '#0059BC';
          barAttrs['stroke-width'] = 2;
        }
        phaseGroup.appendChild(createSvgEl('rect', barAttrs));

        const centerX = phase.x + phase.width / 2;
        phaseGroup.appendChild(
          createSvgEl(
            'text',
            {
              x: centerX,
              y: phase.y - 12,
              'text-anchor': 'middle',
              fill: phase.textColor,
              'font-family': 'Inter, sans-serif',
              'font-size': 11,
              'font-weight': 700,
              class: 'chart-node-pop',
              style: `--anim-delay: ${280 + (unitIdx * 2 + phaseIdx) * 110}ms`,
            },
            phase.statusLabel
          )
        );

        phaseGroup.appendChild(
          createSvgEl(
            'text',
            {
              x: centerX,
              y: 346,
              'text-anchor': 'middle',
              fill: isDry && unit.id === 'nove-julho' ? '#0059BC' : '#475569',
              'font-family': 'Inter, sans-serif',
              'font-size': 10.5,
              'font-weight': isDry && unit.id === 'nove-julho' ? 700 : 600,
            },
            phase.phaseLabel
          )
        );

        unitContainer.appendChild(phaseGroup);
      });

      if (unit.id === 'nove-julho') {
        unitContainer.appendChild(
          createSvgEl('path', {
            id: 'svg-escalation-connector',
            d: 'M518 164 Q540 124 560 112',
            stroke: '#0059BC',
            'stroke-width': 2,
            'stroke-dasharray': '4 3',
            fill: 'none',
            opacity: 0.55,
          })
        );
      }

      unitContainer.appendChild(
        createSvgEl(
          'text',
          {
            x: unit.centerX,
            y: 376,
            'text-anchor': 'middle',
            fill: '#0F172A',
            'font-family': 'Inter, sans-serif',
            'font-size': 12.5,
            'font-weight': 700,
          },
          unit.name
        )
      );

      svg.appendChild(unitContainer);
    });

    return svg;
  }

  function mountAllSvgCharts() {
    const edgeMount = document.getElementById('chart-mount-edge');
    const forecastMount = document.getElementById('chart-mount-forecast');
    const priorityMount = document.getElementById('chart-mount-priority');
    const resultsMount = document.getElementById('chart-mount-results');

    if (edgeMount) {
      edgeMount.replaceChildren(buildTechEdgeChart());
    }
    if (forecastMount) {
      forecastMount.replaceChildren(buildTechForecastChart());
    }
    if (priorityMount) {
      priorityMount.replaceChildren(buildTechPriorityChart());
    }
    if (resultsMount) {
      resultsMount.replaceChildren(buildResultsComparisonChart());
    }
  }

  /* ==========================================================================
     4. INTERACTIVE CHART MOTION, HOVER & FLOATING TOOLTIP ENGINE
     ========================================================================== */
  function initInteractiveCharts(onPhaseBarSelect) {
    const chartShells = Array.from(document.querySelectorAll('.interactive-chart-shell'));
    if (!chartShells.length) return;

    if (!('IntersectionObserver' in window)) {
      chartShells.forEach((shell) => shell.classList.add('is-in-view'));
    } else {
      const entryObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              requestAnimationFrame(() => {
                entry.target.classList.add('is-in-view');
              });
            }
          });
        },
        { root: null, threshold: 0.15 }
      );
      chartShells.forEach((shell) => entryObserver.observe(shell));
    }

    chartShells.forEach((shell) => {
      const tooltip = shell.querySelector('.chart-tooltip');
      if (!tooltip) return;

      let activeItem = null;

      function populateTooltip(item) {
        const tag = item.dataset.tooltipTag || '';
        const color = item.dataset.tooltipColor || '#0059BC';
        const title = item.dataset.tooltipTitle || '';
        const metric = item.dataset.tooltipMetric || '';
        const desc = item.dataset.tooltipDesc || '';

        tooltip.innerHTML = `
          <div class="chart-tooltip-tag">
            <span class="chart-tooltip-dot" style="background-color: ${color}"></span>
            <span>${tag}</span>
          </div>
          <div class="chart-tooltip-title">${title}</div>
          <div class="chart-tooltip-metric">${metric}</div>
          <div class="chart-tooltip-desc">${desc}</div>
        `;
      }

      function positionTooltip(clientX, clientY, targetEl) {
        const shellRect = shell.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth || 220;
        const tooltipHeight = tooltip.offsetHeight || 105;
        const pad = 12;

        let x;
        let y;

        if (typeof clientX === 'number' && typeof clientY === 'number') {
          x = clientX - shellRect.left - tooltipWidth / 2;
          y = clientY - shellRect.top - tooltipHeight - 16;
        } else if (targetEl) {
          const itemRect = targetEl.getBoundingClientRect();
          x = itemRect.left - shellRect.left + itemRect.width / 2 - tooltipWidth / 2;
          y = itemRect.top - shellRect.top - tooltipHeight - 12;
        } else {
          return;
        }

        if (y < pad) {
          y =
            typeof clientY === 'number'
              ? clientY - shellRect.top + 20
              : targetEl.getBoundingClientRect().bottom - shellRect.top + 10;
        }

        x = Math.max(pad, Math.min(shellRect.width - tooltipWidth - pad, x));
        y = Math.max(pad, Math.min(shellRect.height - tooltipHeight - pad, y));

        tooltip.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(1)`;
      }

      function activateItem(item, clientX, clientY) {
        if (activeItem !== item) {
          if (activeItem) {
            activeItem.classList.remove('is-hovered');
          }
          activeItem = item;
          activeItem.classList.add('is-hovered');
          shell.classList.add('is-hovering-item');
          populateTooltip(item);
          tooltip.hidden = false;
          tooltip.classList.add('is-visible');
        }
        positionTooltip(clientX, clientY, item);
      }

      function deactivateAll() {
        if (activeItem) {
          activeItem.classList.remove('is-hovered');
          activeItem = null;
        }
        shell.classList.remove('is-hovering-item');
        tooltip.classList.remove('is-visible');
      }

      shell.addEventListener(
        'pointermove',
        (event) => {
          const item = event.target.closest('.chart-data-item');
          if (item && shell.contains(item)) {
            activateItem(item, event.clientX, event.clientY);
          } else if (activeItem) {
            deactivateAll();
          }
        },
        { passive: true }
      );

      shell.addEventListener('pointerleave', () => {
        deactivateAll();
      });

      shell.addEventListener('focusin', (event) => {
        const item = event.target.closest('.chart-data-item');
        if (item && shell.contains(item)) {
          activateItem(item, null, null);
        }
      });

      shell.addEventListener('focusout', (event) => {
        if (!shell.contains(event.relatedTarget)) {
          deactivateAll();
        }
      });

      shell.addEventListener('click', (event) => {
        const item = event.target.closest('.chart-data-item[data-phase-key]');
        if (item && typeof onPhaseBarSelect === 'function') {
          onPhaseBarSelect(item.dataset.phaseKey);
        }
      });
    });
  }

  /* ==========================================================================
     5. CUSTOM CURSOR, HERO 3D FLOAT, CAROUSEL & SCENARIO SWITCHER
     ========================================================================== */
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (!cursor || !hasFinePointer || prefersReducedMotion) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let cursorMode = 'default';
    let isVisible = false;
    const lerpFactor = 0.24;

    window.addEventListener(
      'mousemove',
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!isVisible) {
          currentX = mouseX;
          currentY = mouseY;
          isVisible = true;
          cursor.classList.add('is-visible');
        }
      },
      { passive: true }
    );

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursor.classList.remove('is-visible');
    });

    document.addEventListener('mouseover', (event) => {
      const sliderControl = event.target.closest('[data-cursor="slider-nav"]');
      if (sliderControl) {
        cursorMode = 'slider-nav';
        cursor.classList.add('is-slider-nav');
        cursor.classList.remove('is-hovering');
        return;
      }

      const interactive = event.target.closest('a, button, .chart-data-item');
      if (interactive) {
        cursorMode = 'interactive';
        cursor.classList.add('is-hovering');
        cursor.classList.remove('is-slider-nav');
        return;
      }

      cursorMode = 'default';
      cursor.classList.remove('is-hovering', 'is-slider-nav');
    });

    function renderCursor() {
      currentX += (mouseX - currentX) * lerpFactor;
      currentY += (mouseY - currentY) * lerpFactor;

      let radiusOffset = 4;
      if (cursorMode === 'slider-nav') {
        radiusOffset = 17;
      } else if (cursorMode === 'interactive') {
        radiusOffset = 11;
      }

      const x = (currentX - radiusOffset).toFixed(2);
      const y = (currentY - radiusOffset).toFixed(2);

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      window.requestAnimationFrame(renderCursor);
    }

    window.requestAnimationFrame(renderCursor);
  }

  function initVenaSlider() {
    const sliderShell = document.getElementById('vena-slider');
    const track = document.getElementById('slider-track');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dots = Array.from(document.querySelectorAll('.slider-dot'));
    const statusEl = document.getElementById('slider-status');

    if (!sliderShell || !track) {
      return;
    }

    const originalSlides = Array.from(track.querySelectorAll('.slider-slide'));
    const totalRealSlides = originalSlides.length;
    if (totalRealSlides < 2) {
      return;
    }

    const slideTitles = [
      'Etapa 01 de 03 · Leitura Dupla na Galeria',
      'Etapa 02 de 03 · Monitoramento e Previsão de Chuva',
      'Etapa 03 de 03 · Priorização Inteligente da Limpeza',
    ];

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[totalRealSlides - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone = 'last';

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    const allTrackSlides = Array.from(track.querySelectorAll('.slider-slide'));

    let trackIndex = 1;
    let isTransitioning = false;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 5500;
    let isHoveredOrFocused = false;

    function getRealIndex(currentTrackIndex) {
      if (currentTrackIndex === 0) return totalRealSlides - 1;
      if (currentTrackIndex === totalRealSlides + 1) return 0;
      return currentTrackIndex - 1;
    }

    function replayChartAnimationInSlide(slideEl) {
      if (!slideEl) return;
      const chartShell = slideEl.querySelector('.interactive-chart-shell');
      if (!chartShell) return;
      chartShell.classList.remove('is-in-view');
      void chartShell.offsetWidth;
      requestAnimationFrame(() => {
        chartShell.classList.add('is-in-view');
      });
    }

    function updateIndicators(realIndex) {
      allTrackSlides.forEach((slide, idx) => {
        const isCurrent = idx === trackIndex;
        slide.classList.toggle('is-selected', isCurrent);
        if (!slide.dataset.clone) {
          slide.setAttribute('aria-hidden', String(!isCurrent));
        }
        if (isCurrent) {
          replayChartAnimationInSlide(slide);
        }
      });

      dots.forEach((dot, idx) => {
        const isCurrent = idx === realIndex;
        dot.classList.toggle('is-active', isCurrent);
        dot.setAttribute('aria-selected', String(isCurrent));
      });

      if (statusEl && slideTitles[realIndex]) {
        statusEl.textContent = slideTitles[realIndex];
      }
    }

    function setTrackPosition(index, withAnimation) {
      if (withAnimation && !prefersReducedMotion) {
        track.classList.add('is-animating');
      } else {
        track.classList.remove('is-animating');
      }
      track.style.transform = `translate3d(${-(index * 100)}%, 0, 0)`;
    }

    function moveToTrackIndex(nextTrackIndex) {
      if (isTransitioning) return;
      isTransitioning = true;
      trackIndex = nextTrackIndex;
      const realIndex = getRealIndex(trackIndex);

      updateIndicators(realIndex);
      setTrackPosition(trackIndex, true);

      if (prefersReducedMotion) {
        normalizeInfiniteBounds();
      }
    }

    function normalizeInfiniteBounds() {
      if (trackIndex === 0) {
        trackIndex = totalRealSlides;
        setTrackPosition(trackIndex, false);
        updateIndicators(getRealIndex(trackIndex));
      } else if (trackIndex === totalRealSlides + 1) {
        trackIndex = 1;
        setTrackPosition(trackIndex, false);
        updateIndicators(getRealIndex(trackIndex));
      }
      isTransitioning = false;
    }

    track.addEventListener('transitionend', (event) => {
      if (event.target !== track || event.propertyName !== 'transform') return;
      normalizeInfiniteBounds();
    });

    function nextSlide() {
      moveToTrackIndex(trackIndex + 1);
    }

    function prevSlide() {
      moveToTrackIndex(trackIndex - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (getRealIndex(trackIndex) === idx) return;
        moveToTrackIndex(idx + 1);
        restartAutoplay();
      });
    });

    document.addEventListener('keydown', (event) => {
      const isSliderFocused = sliderShell.contains(document.activeElement);
      if (!isSliderFocused && !isHoveredOrFocused) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextSlide();
        restartAutoplay();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevSlide();
        restartAutoplay();
      }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;
    const SWIPE_THRESHOLD = 45;

    sliderShell.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isSwiping = true;
        pauseAutoplay();
      },
      { passive: true }
    );

    sliderShell.addEventListener(
      'touchend',
      (event) => {
        if (!isSwiping || event.changedTouches.length === 0) return;
        isSwiping = false;

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }

        if (!isHoveredOrFocused) {
          startAutoplay();
        }
      },
      { passive: true }
    );

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion || isHoveredOrFocused) {
        return;
      }
      autoplayTimer = window.setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer !== null) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function pauseAutoplay() {
      stopAutoplay();
    }

    function restartAutoplay() {
      if (!isHoveredOrFocused) {
        startAutoplay();
      }
    }

    sliderShell.addEventListener('mouseenter', () => {
      isHoveredOrFocused = true;
      pauseAutoplay();
    });

    sliderShell.addEventListener('mouseleave', () => {
      isHoveredOrFocused = false;
      startAutoplay();
    });

    sliderShell.addEventListener('focusin', () => {
      isHoveredOrFocused = true;
      pauseAutoplay();
    });

    sliderShell.addEventListener('focusout', (event) => {
      if (!sliderShell.contains(event.relatedTarget)) {
        isHoveredOrFocused = false;
        startAutoplay();
      }
    });

    setTrackPosition(trackIndex, false);
    updateIndicators(0);
    startAutoplay();
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  function initHeroProductShowcase() {
    const heroSection = document.getElementById('hero');
    const deviceScrollRig = document.getElementById('hero-device-scroll');

    if (!heroSection || !deviceScrollRig) {
      return;
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let rafId = null;

    function computeScrollTarget() {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroHeight = heroSection.offsetHeight || window.innerHeight;
      const raw = scrollY / Math.max(1, heroHeight * 0.85);
      targetProgress = Math.max(0, Math.min(1, raw));
      requestTick();
    }

    function animateHeroDevice() {
      rafId = null;

      currentProgress += (targetProgress - currentProgress) * 0.14;
      currentPointerX += (targetPointerX - currentPointerX) * 0.1;
      currentPointerY += (targetPointerY - currentPointerY) * 0.1;

      const scale = 1 + currentProgress * 0.1;
      const rotateZ = -1.2 + currentProgress * 3.5 + currentPointerX * 1.8;
      const rotateX = currentProgress * 5.0 - currentPointerY * 4.0;
      const rotateY = -currentProgress * 4.5 + currentPointerX * 5.0;
      const translateY = currentProgress * -16;

      deviceScrollRig.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg)`;

      const stillMoving =
        Math.abs(targetProgress - currentProgress) > 0.001 ||
        Math.abs(targetPointerX - currentPointerX) > 0.001 ||
        Math.abs(targetPointerY - currentPointerY) > 0.001;

      if (stillMoving) {
        requestTick();
      }
    }

    function requestTick() {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(animateHeroDevice);
      }
    }

    window.addEventListener('scroll', computeScrollTarget, { passive: true });
    window.addEventListener('resize', computeScrollTarget, { passive: true });

    if (window.matchMedia('(pointer: fine)').matches) {
      heroSection.addEventListener(
        'mousemove',
        (event) => {
          const rect = heroSection.getBoundingClientRect();
          const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          targetPointerX = Math.max(-1, Math.min(1, nx));
          targetPointerY = Math.max(-1, Math.min(1, ny));
          requestTick();
        },
        { passive: true }
      );

      heroSection.addEventListener('mouseleave', () => {
        targetPointerX = 0;
        targetPointerY = 0;
        requestTick();
      });
    }

    computeScrollTarget();
  }

  function initSectionSnapSync() {
    const navLinks = Array.from(
      document.querySelectorAll('.primary-nav .nav-link, .header-actions .btn-contact[href^="#"]')
    );
    const sections = Array.from(document.querySelectorAll('main > section[id]'));

    if (!navLinks.length || !sections.length) {
      return;
    }

    function setActiveSection(sectionId) {
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${sectionId}`;
        if (isMatch) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('onscrollsnapchange' in window || 'onscrollsnapchange' in document) {
      document.addEventListener('scrollsnapchange', (event) => {
        const snappedTarget = event.snapTargetBlock;
        if (snappedTarget && snappedTarget.id) {
          setActiveSection(snappedTarget.id);
        }
      });
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { root: null, threshold: 0.55 }
      );

      sections.forEach((section) => observer.observe(section));
    }
  }

  function initResultsScenarioToggle() {
    const scenarioBtns = Array.from(document.querySelectorAll('.scenario-btn'));
    const bvDry = document.getElementById('svg-bv-dry');
    const bvRain = document.getElementById('svg-bv-rain');
    const j9Dry = document.getElementById('svg-9j-dry');
    const j9Rain = document.getElementById('svg-9j-rain');
    const j9DryBar = document.getElementById('svg-9j-dry-bar');
    const j9RainBar = document.getElementById('svg-9j-rain-bar');
    const connector = document.getElementById('svg-escalation-connector');
    const svgPhaseSummary = document.getElementById('svg-phase-summary');
    const phaseBadge = document.getElementById('results-phase-badge');
    const pillBueiro2 = document.getElementById('pill-bueiro-02');
    const actionBueiro2 = document.getElementById('action-bueiro-02');

    if (!scenarioBtns.length) {
      return null;
    }

    function applyScenario(mode) {
      const isRain = mode === 'rain';

      scenarioBtns.forEach((btn) => {
        const active = btn.dataset.scenario === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });

      if (bvDry) bvDry.setAttribute('opacity', isRain ? '0.45' : '1');
      if (bvRain) bvRain.setAttribute('opacity', isRain ? '1' : '0.45');
      if (j9Dry) j9Dry.setAttribute('opacity', isRain ? '0.42' : '1');
      if (j9Rain) j9Rain.setAttribute('opacity', isRain ? '1' : '0.42');

      if (j9DryBar) {
        j9DryBar.setAttribute('stroke-width', isRain ? '0' : '2');
      }
      if (j9RainBar) {
        j9RainBar.setAttribute('stroke', isRain ? '#0059BC' : 'none');
        j9RainBar.setAttribute('stroke-width', isRain ? '2.5' : '0');
      }
      if (connector) {
        connector.setAttribute('opacity', isRain ? '1' : '0.5');
      }

      if (isRain) {
        if (svgPhaseSummary) {
          svgPhaseSummary.textContent = 'Com chuva: limpeza imediata e via interditada';
        }
        if (phaseBadge) {
          phaseBadge.textContent = 'Fase Ativa: Com Chuva';
        }
        if (pillBueiro2) {
          pillBueiro2.textContent = 'Crítico · Com Chuva';
          pillBueiro2.className = 'fleet-pill fleet-pill-critical';
        }
        if (actionBueiro2) {
          actionBueiro2.innerHTML =
            '<span><strong>Fase Com Chuva:</strong> Prioridade máxima com despacho imediato de limpeza e alerta de via interditada.</span>';
        }
      } else {
        if (svgPhaseSummary) {
          svgPhaseSummary.textContent = 'Sem chuva: limpeza programada';
        }
        if (phaseBadge) {
          phaseBadge.textContent = 'Fase Ativa: Sem Chuva';
        }
        if (pillBueiro2) {
          pillBueiro2.textContent = 'Atenção · Sem Chuva';
          pillBueiro2.className = 'fleet-pill fleet-pill-warning';
        }
        if (actionBueiro2) {
          actionBueiro2.innerHTML =
            '<span><strong>Fase Sem Chuva:</strong> Sinalização em LED amarelo no bueiro e limpeza preventiva programada na rotina.</span>';
        }
      }
    }

    scenarioBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        applyScenario(btn.dataset.scenario);
      });
    });

    return applyScenario;
  }

