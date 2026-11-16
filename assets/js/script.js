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
