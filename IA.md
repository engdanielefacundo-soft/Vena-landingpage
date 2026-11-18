# Documentação de Uso de IA — Lógica e Algoritmos em JavaScript

Este documento registra **5 prompts e seus respectivos resultados focados exclusivamente na implementação da lógica em JavaScript puro (Vanilla JS)** utilizada no arquivo `assets/js/script.js` do projeto **Vena by Astron**.

---

## Prompt 01 — Fábrica de Elementos Vetoriais Dinâmicos (`document.createElementNS`) e Metadados

### Prompt Utilizado
> *"Em JavaScript Vanilla (ES6+), crie uma função utilitária `createSvgEl` que instancie elementos dinamicamente no namespace oficial `http://www.w3.org/2000/svg` usando `document.createElementNS`, aplicando atributos a partir de um objeto chave-valor e definindo `textContent` opcional. Em seguida, crie uma função `attachTooltipMetadata` que anexe metadados estruturados no `dataset` de cada grupo interativo para leitura dinâmica em tempo de execução."*

### Resultado em JavaScript
```javascript
const SVG_NS = 'http://www.w3.org/2000/svg';

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
```

---

## Prompt 02 — Máquina de Estado para Carrossel Cíclico Infinito com Gestos Touch e Autoplay

### Prompt Utilizado
> *"Desenvolva em JavaScript puro a função `initVenaSlider` para gerenciar o estado de um carrossel cíclico infinito com clonagem do primeiro e último itens, normalização silenciosa de índice no evento `transitionend`, suporte a setas do teclado (`ArrowRight` e `ArrowLeft`), detecção de swipe touch (`touchstart` e `touchend` com filtro de eixo dominante) e temporizador de autoplay que pausa automaticamente ao detectar foco ou cursor."*

### Resultado em JavaScript
```javascript
function getRealIndex(currentTrackIndex, totalRealSlides) {
  if (currentTrackIndex === 0) return totalRealSlides - 1;
  if (currentTrackIndex === totalRealSlides + 1) return 0;
  return currentTrackIndex - 1;
}

function normalizeInfiniteBounds(state) {
  if (state.trackIndex === 0) {
    state.trackIndex = state.totalRealSlides;
    state.setTrackPosition(state.trackIndex, false);
    state.updateIndicators(getRealIndex(state.trackIndex, state.totalRealSlides));
  } else if (state.trackIndex === state.totalRealSlides + 1) {
    state.trackIndex = 1;
    state.setTrackPosition(state.trackIndex, false);
    state.updateIndicators(getRealIndex(state.trackIndex, state.totalRealSlides));
  }
  state.isTransitioning = false;
}

function handleTouchEnd(event, touchState, callbacks) {
  if (!touchState.isSwiping || event.changedTouches.length === 0) return;
  touchState.isSwiping = false;

  const deltaX = event.changedTouches[0].clientX - touchState.startX;
  const deltaY = event.changedTouches[0].clientY - touchState.startY;

  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > touchState.threshold) {
    if (deltaX < 0) {
      callbacks.nextSlide();
    } else {
      callbacks.prevSlide();
    }
  }
}
```

---

## Prompt 03 — Algoritmo de Clamping Geométrico de Tooltip e Gatilho via `IntersectionObserver`

### Prompt Utilizado
> *"Implemente em JavaScript Vanilla a lógica `initInteractiveCharts` que utilize `IntersectionObserver` para acionar a entrada dos gráficos quando visíveis e calcule em tempo real as coordenadas `(x, y)` de um tooltip flutuante via `getBoundingClientRect()`. O cálculo deve inverter a posição vertical caso o elemento esteja próximo ao topo e limitar (`Math.max` / `Math.min`) as coordenadas horizontais e verticais para impedir que o tooltip ultrapasse as bordas do contêiner."*

### Resultado em JavaScript
```javascript
function positionTooltip(shell, tooltip, clientX, clientY, targetEl) {
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
```

---

## Prompt 04 — Lógica Reativa de Alternância de Cenários Climáticos (`applyScenario`)

### Prompt Utilizado
> *"Escreva em JavaScript puro a função `initResultsScenarioToggle` para alternar o estado operacional das duas unidades monitoradas na Bela Vista (Rua Treze de Maio e Av. 9 de Julho) entre os modos `'dry'` (Fase 1 · Sem Chuva) e `'rain'` (Fase 2 · Com Chuva), sincronizando atributos `aria-pressed`, opacidade relativa das séries de dados e textos de resumo operacional."*

### Resultado em JavaScript
```javascript
function applyScenario(mode, refs) {
  const isRain = mode === 'rain';

  refs.scenarioBtns.forEach((btn) => {
    const active = btn.dataset.scenario === mode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if (refs.bvDry) refs.bvDry.setAttribute('opacity', isRain ? '0.45' : '1');
  if (refs.bvRain) refs.bvRain.setAttribute('opacity', isRain ? '1' : '0.45');
  if (refs.j9Dry) refs.j9Dry.setAttribute('opacity', isRain ? '0.42' : '1');
  if (refs.j9Rain) refs.j9Rain.setAttribute('opacity', isRain ? '1' : '0.42');

  if (refs.j9DryBar) {
    refs.j9DryBar.setAttribute('stroke-width', isRain ? '0' : '2');
  }
  if (refs.j9RainBar) {
    refs.j9RainBar.setAttribute('stroke', isRain ? '#0059BC' : 'none');
    refs.j9RainBar.setAttribute('stroke-width', isRain ? '2.5' : '0');
  }
  if (refs.connector) {
    refs.connector.setAttribute('opacity', isRain ? '1' : '0.5');
  }

  if (refs.svgPhaseSummary) {
    refs.svgPhaseSummary.textContent = isRain
      ? 'Com chuva: limpeza imediata e via interditada'
      : 'Sem chuva: limpeza programada';
  }
  if (refs.phaseBadge) {
    refs.phaseBadge.textContent = isRain ? 'Fase Ativa: Com Chuva' : 'Fase Ativa: Sem Chuva';
  }
}
```

---

## Prompt 05 — Motor de Validação contra Campos Vazios (`ValidityState` + `WeakMap`) e Limitador de Caracteres

### Prompt Utilizado
> *"Crie em JavaScript Vanilla a lógica de validação de formulário e limitador de caracteres em tempo real. Utilize um `WeakMap` para rastrear o estado de interação de cada controle, bloqueie valores vazios ou compostos apenas por espaços em branco (`value.trim().length === 0`) via `setCustomValidity()`, impeça a submissão no evento `submit` direcionando o foco ao primeiro controle inválido (`firstInvalidControl.focus()`) e implemente `updateCharLimiter(control)` para truncar strings acima do limite máximo e calcular a razão percentual de preenchimento."*

### Resultado em JavaScript
```javascript
const dirtyState = new WeakMap();

function updateCharLimiter(control) {
  if (!control || !control.id) return;
  const maxAttr = control.dataset.maxChars || control.getAttribute('maxlength');
  const maxChars = maxAttr ? parseInt(maxAttr, 10) : 0;
  if (!maxChars || Number.isNaN(maxChars)) return;

  if (control.value.length > maxChars) {
    control.value = control.value.slice(0, maxChars);
  }

  const currentLen = control.value.length;
  const ratio = currentLen / maxChars;
  const isTextarea = control.tagName === 'TEXTAREA';

  const counterEl = document.querySelector(`.char-counter[data-for="${control.id}"]`);
  if (counterEl) {
    counterEl.textContent = isTextarea
      ? `${currentLen} / ${maxChars} caracteres`
      : `${currentLen} / ${maxChars}`;
    counterEl.classList.toggle('is-near-limit', ratio >= 0.8 && ratio < 1);
    counterEl.classList.toggle('is-at-limit', ratio >= 1);
  }

  const barFillEl = document.querySelector(`.char-limit-fill[data-bar-for="${control.id}"]`);
  if (barFillEl) {
    const pct = Math.min(100, Math.round(ratio * 100));
    barFillEl.style.width = `${pct}%`;
    barFillEl.classList.toggle('is-near-limit', ratio >= 0.8 && ratio < 1);
    barFillEl.classList.toggle('is-at-limit', ratio >= 1);
  }
}

function validateFieldControl(control, forceErrorDisplay) {
  if (!control.matches || !control.matches('input, textarea, select')) {
    return true;
  }
  const rawVal = typeof control.value === 'string' ? control.value : '';
  const trimmedVal = rawVal.trim();

  control.setCustomValidity('');
  if (control.required && trimmedVal.length === 0) {
    control.setCustomValidity('Este campo obrigatório não pode ficar vazio.');
  }

  const isValid = control.checkValidity();
  const state = dirtyState.get(control) || { hasInteracted: false, hasBlurred: false };
  const shouldShowError = !isValid && (forceErrorDisplay || (state.hasInteracted && state.hasBlurred));

  control.classList.toggle('user-invalid-fallback', shouldShowError);
  if (shouldShowError) {
    control.setAttribute('aria-invalid', 'true');
  } else {
    control.removeAttribute('aria-invalid');
  }

  return isValid;
}
```
