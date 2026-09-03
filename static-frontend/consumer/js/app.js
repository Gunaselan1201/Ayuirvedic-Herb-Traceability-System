// static-frontend/consumer/js/app.js
//
// Shared client-side logic for the Consumer Portal static demo.
// index.html calls initDashboard(), timeline.html calls initTimeline().
// Data comes from window.HERB_LEDGER / window.HERB_EXAMPLES (js/data.js).

/* ------------------------------------------------------------------ */
/* Dashboard page (index.html)                                         */
/* ------------------------------------------------------------------ */

function initDashboard() {
  const form = document.getElementById('batchForm');
  const input = document.getElementById('batchId');
  const errorBox = document.getElementById('formError');
  const examplesList = document.getElementById('examplesList');
  const qrScanBtn = document.getElementById('qrScanBtn');
  const qrModal = document.getElementById('qrModal');
  const qrModalClose = document.getElementById('qrModalClose');

  // Render example batch ID chips from data.js
  if (examplesList && window.HERB_EXAMPLES) {
    window.HERB_EXAMPLES.forEach(function (ex) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'example-chip';
      btn.innerHTML = '<span class="chip-id">' + escapeHtml(ex.batchId) + '</span>' +
        '<span>- ' + escapeHtml(ex.label) + '</span>';
      btn.addEventListener('click', function () {
        goToTimeline(ex.batchId);
      });
      examplesList.appendChild(btn);
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const value = (input.value || '').trim();
      if (!value) {
        showError('Please enter a Batch ID');
        return;
      }
      showError('');
      goToTimeline(value);
    });
  }

  if (qrScanBtn && qrModal) {
    qrScanBtn.addEventListener('click', function () {
      // Real implementation would open the device camera for QR scanning.
      // For this static demo we show a placeholder camera frame instead.
      qrModal.hidden = false;
    });
  }

  if (qrModalClose && qrModal) {
    qrModalClose.addEventListener('click', function () {
      qrModal.hidden = true;
    });
    qrModal.addEventListener('click', function (e) {
      if (e.target === qrModal) {
        qrModal.hidden = true;
      }
    });
  }

  function showError(msg) {
    if (!errorBox) return;
    if (!msg) {
      errorBox.hidden = true;
      errorBox.textContent = '';
    } else {
      errorBox.hidden = false;
      errorBox.textContent = msg;
    }
  }

  function goToTimeline(batchId) {
    window.location.href = 'timeline.html?batchId=' + encodeURIComponent(batchId);
  }
}

/* ------------------------------------------------------------------ */
/* Timeline page (timeline.html)                                       */
/* ------------------------------------------------------------------ */

function initTimeline() {
  const batchId = getQueryParam('batchId');
  const events = (batchId && window.HERB_LEDGER && window.HERB_LEDGER[batchId]) || [];

  const notFoundEl = document.getElementById('notFoundScreen');
  const contentEl = document.getElementById('timelineContent');

  if (!batchId || !Array.isArray(events) || events.length === 0) {
    if (notFoundEl) notFoundEl.hidden = false;
    if (contentEl) contentEl.hidden = true;
    return;
  }

  if (notFoundEl) notFoundEl.hidden = true;
  if (contentEl) contentEl.hidden = false;

  const farmer = events.find(function (e) { return e.stage === 'farmer'; });
  const lab = events.find(function (e) { return e.stage === 'lab'; });
  const manufacturer = events.find(function (e) { return e.stage === 'manufacturer'; });

  const farmerData = (farmer && farmer.data) || {};
  const labData = (lab && lab.data) || {};
  const manufData = (manufacturer && manufacturer.data) || {};

  // Batch ID / QR panel
  setText('batchIdDisplay', batchId);
  renderQr(batchId);

  // Stepper active states
  setStepState('stepFarm', !!farmer);
  setStepState('stepLab', !!lab);
  setStepState('stepManufacturing', !!manufacturer);

  // Manufactured Summary
  renderField('f-companyName', manufData.companyName);
  renderField('f-manufacturedBatchId', manufData.manufacturedBatchId);
  renderField('f-productNameTop', manufData.productName || manufData.product || farmerData.productName);
  renderField('f-productType', manufData.productType);
  renderField('f-ingredients', manufData.ingredients);
  renderField('f-manufAddedBy', manufacturer && manufacturer.addedBy);
  renderField('f-manufDate', formatDate(manufacturer && manufacturer.timestamp));

  // Raw Products table
  setText('raw-batchId', (farmer && farmer.batchId) || '-');
  setText('raw-productName', displayValue(farmerData.productName));

  // Harvest History
  renderField('f-harvestProduct', farmerData.productName);
  renderField('f-quantity', extractQuantityValue(farmerData.quantity));
  renderField('f-unit', extractQuantityUnit(farmerData.quantity));
  renderField('f-harvestedDate', farmerData.harvestedDate || farmerData.harvestedDateISO);
  renderField('f-latitude', (farmerData.coordinates && farmerData.coordinates.latitude) || farmerData.latitude);
  renderField('f-longitude', (farmerData.coordinates && farmerData.coordinates.longitude) || farmerData.longitude);
  renderField('f-state', farmerData.state);
  renderField('f-district', farmerData.district);
  renderField('f-villageTown', farmerData.villageTown);
  renderField('f-farmerAddedBy', farmer && farmer.addedBy);
  renderField('f-farmerDate', formatDate(farmer && farmer.timestamp));

  // Lab Test History
  renderField('f-labProductName', farmerData.productName);
  renderField('f-moisture', labData.moisture);
  renderField('f-pesticide', labData.pesticide);
  renderField('f-quality', labData.quality || labData.qualityGrade);
  renderField('f-testedBy', labData.testedBy);
  renderField('f-labAddedBy', lab && lab.addedBy);
  renderField('f-testedAtISO', labData.testedAtISO);
  renderField('f-labDate', formatDate(lab && lab.timestamp));

  // Core Tests
  renderField('f-pesticideResidues', labData.pesticideResidues);
  renderField('f-microbialLoad', labData.microbialLoad);
  renderField('f-aflatoxins', labData.aflatoxins);
  renderField('f-moistureWaterActivity', labData.moistureWaterActivity);
  const hm = labData.heavyMetals || {};
  renderField('f-hmPb', hm.Pb);
  renderField('f-hmAs', hm.As);
  renderField('f-hmCd', hm.Cd);
  renderField('f-hmHg', hm.Hg);

  // Ayurvedic Pharmacopoeial Quality Tests
  renderField('f-macroMicroIdentity', labData.macroMicroIdentity);
  renderField('f-totalAsh', labData.totalAsh);
  renderField('f-extractiveValues', labData.extractiveValues);
  renderField('f-foreignOrganicMatter', labData.foreignOrganicMatter);
  renderField('f-tlcHptlc', labData.tlcHptlc);
  renderField('f-markerCompoundQuant', labData.markerCompoundQuant);

  // Export-Grade Fields
  renderField('f-residualSolvents', labData.residualSolvents);
  renderField('f-pesticidePanelConfirmation', labData.pesticidePanelConfirmation);
  renderField('f-dnaBarcoding', labData.dnaBarcoding);
}

function renderQr(batchId) {
  const wrap = document.getElementById('qrImageWrap');
  if (!wrap) return;
  const img = document.createElement('img');
  img.alt = 'QR code for ' + batchId;
  img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(batchId);
  img.onerror = function () {
    // No network access (or blocked): fall back to a simple CSS placeholder grid
    wrap.innerHTML = '';
    wrap.appendChild(buildQrFallback(batchId));
  };
  wrap.innerHTML = '';
  wrap.appendChild(img);
}

function buildQrFallback(seed) {
  const el = document.createElement('div');
  el.className = 'qr-fallback';
  // Deterministic pseudo-random pattern derived from the batch ID so the
  // same batch always renders the same placeholder "code".
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < 49; i++) {
    const cell = document.createElement('div');
    hash = (hash * 1103515245 + 12345) >>> 0;
    const on = (hash >> 16) % 2 === 0;
    cell.className = 'cell' + (on ? ' on' : '');
    el.appendChild(cell);
  }
  return el;
}

function setStepState(id, active) {
  const el = document.getElementById(id);
  if (!el) return;
  if (active) {
    el.classList.remove('inactive');
  } else {
    el.classList.add('inactive');
  }
}

function renderField(id, value) {
  setText(id, displayValue(value));
}

function displayValue(value) {
  return value === undefined || value === null || value === '' ? '-' : String(value);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatDate(iso) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleString();
  } catch (e) {
    return String(iso);
  }
}

function extractQuantityValue(quantity) {
  if (!quantity) return '-';
  const match = String(quantity).match(/^[\d.]+/);
  return match ? match[0] : quantity;
}

function extractQuantityUnit(quantity) {
  if (!quantity) return '-';
  const match = String(quantity).match(/[A-Za-z]+$/);
  return match ? match[0] : '-';
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
