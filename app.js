// Expert Desk — EU per diem search/browse + separate exchange rate converter.
// Real data throughout: data.js (DG INTPA per diem, EUR) + fx-rates.json (InforEuro).
// The two tools are independent: per diem is always EUR (the officially
// binding figure); exchange rates is its own converter, not mixed in.

// ---------------------------------------------------------------
// PER DIEM: search / browse / count (EUR only)
// ---------------------------------------------------------------
const countries = Object.keys(PER_DIEM_RATES_EUR).sort((a, b) => a.localeCompare(b));
let selectedCountry = null;

function fmtEur(amount) {
  return `€${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderList(filterText) {
  const list = document.getElementById("pd-list");
  const q = (filterText || "").trim().toLowerCase();
  const matches = q ? countries.filter((c) => c.toLowerCase().includes(q)) : countries;

  list.innerHTML = "";
  if (!matches.length) {
    list.innerHTML = `<p class="hint">No match for “${filterText}”. Try “Other country or territory” for anywhere not listed individually.</p>`;
    return;
  }

  matches.forEach((country) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "pd-row" + (country === selectedCountry ? " selected" : "");
    row.setAttribute("role", "option");
    row.innerHTML = `<span>${country}</span><span class="pd-rate">${fmtEur(PER_DIEM_RATES_EUR[country])}/day</span>`;
    row.addEventListener("click", () => selectCountry(country));
    list.appendChild(row);
  });
}

function selectCountry(country) {
  selectedCountry = country;
  renderList(document.getElementById("pd-search").value);
  updatePdResult();
}

document.getElementById("pd-search").addEventListener("input", (e) => renderList(e.target.value));

const daysInput = document.getElementById("pd-days");

function getDays() {
  return Math.max(0, parseFloat(daysInput.value) || 0);
}

function setDays(n) {
  daysInput.value = Math.max(0, n);
  updatePdResult();
}

document.getElementById("pd-minus").addEventListener("click", () => setDays(getDays() - 1));
document.getElementById("pd-plus").addEventListener("click", () => setDays(getDays() + 1));
daysInput.addEventListener("input", updatePdResult);
document.getElementById("pd-arrival-departure").addEventListener("change", updatePdResult);

document.getElementById("dr-apply").addEventListener("click", () => {
  const start = new Date(document.getElementById("dr-start").value);
  const end = new Date(document.getElementById("dr-end").value);
  const result = document.getElementById("pd-result");
  if (isNaN(start) || isNaN(end) || end < start) {
    result.textContent = "Enter a valid start and end date (end must be on or after start).";
    return;
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.round((end - start) / msPerDay) + 1; // inclusive
  setDays(days);
});

function updatePdResult() {
  const selected = document.getElementById("pd-selected");
  const result = document.getElementById("pd-result");

  if (!selectedCountry) {
    selected.textContent = "Select a country above to start counting.";
    result.textContent = "";
    return;
  }

  const rate = PER_DIEM_RATES_EUR[selectedCountry];
  selected.textContent = `${selectedCountry} — ${fmtEur(rate)}/day`;

  const days = getDays();
  const halfEnds = document.getElementById("pd-arrival-departure").checked;

  let total;
  if (halfEnds && days >= 2) {
    total = rate * 0.5 * 2 + rate * (days - 2);
  } else if (halfEnds && days > 0) {
    total = rate * 0.5 * days;
  } else {
    total = rate * days;
  }

  result.textContent = `${days} day(s) → ${fmtEur(total)}`;
}

renderList("");

// ---------------------------------------------------------------
// EXCHANGE RATES: separate search/browse + two-way converter
// ---------------------------------------------------------------
let fxDetails = {}; // code -> { value, currency, country }
let selectedCurrency = null;

async function loadFxRates() {
  const note = document.getElementById("fx-note");
  try {
    const res = await fetch("fx-rates.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`fx-rates.json fetch failed: ${res.status}`);
    const payload = await res.json();
    fxDetails = payload.rates;
    const period = `${payload.year}-${String(payload.month).padStart(2, "0")}`;
    note.textContent = `InforEuro rates for ${period}. EUR is the only officially binding figure for EU-funded contracts.`;
  } catch (err) {
    fxDetails = { EUR: { value: 1, currency: "Euro", country: "—" } };
    note.textContent = "Exchange rates unavailable right now.";
  }
  renderFxList("");
}

const fxCodes = () => Object.keys(fxDetails).sort((a, b) => a.localeCompare(b));

function renderFxList(filterText) {
  const list = document.getElementById("fx-list");
  const q = (filterText || "").trim().toLowerCase();
  const codes = fxCodes();
  const matches = q
    ? codes.filter((code) => {
        const d = fxDetails[code];
        return (
          code.toLowerCase().includes(q) ||
          d.currency.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q)
        );
      })
    : codes;

  list.innerHTML = "";
  if (!matches.length) {
    list.innerHTML = `<p class="hint">No currency matches “${filterText}”.</p>`;
    return;
  }

  matches.forEach((code) => {
    const d = fxDetails[code];
    const row = document.createElement("button");
    row.type = "button";
    row.className = "pd-row" + (code === selectedCurrency ? " selected" : "");
    row.setAttribute("role", "option");
    row.innerHTML = `<span>${code} — ${d.currency}</span><span class="pd-rate">${d.value}</span>`;
    row.addEventListener("click", () => selectCurrency(code));
    list.appendChild(row);
  });
}

function selectCurrency(code) {
  selectedCurrency = code;
  renderFxList(document.getElementById("fx-search").value);
  document.getElementById("fx-selected").textContent = `1 EUR = ${fxDetails[code].value} ${code} (${fxDetails[code].currency})`;
  document.getElementById("fx-cur-label").textContent = code;
  document.getElementById("fx-cur-amount").disabled = false;
  recomputeFromEur();
}

document.getElementById("fx-search").addEventListener("input", (e) => renderFxList(e.target.value));

function recomputeFromEur() {
  if (!selectedCurrency) return;
  const eur = parseFloat(document.getElementById("fx-eur-amount").value) || 0;
  document.getElementById("fx-cur-amount").value = (eur * fxDetails[selectedCurrency].value).toFixed(2);
}

function recomputeFromCur() {
  if (!selectedCurrency) return;
  const cur = parseFloat(document.getElementById("fx-cur-amount").value) || 0;
  document.getElementById("fx-eur-amount").value = (cur / fxDetails[selectedCurrency].value).toFixed(2);
}

document.getElementById("fx-eur-amount").addEventListener("input", recomputeFromEur);
document.getElementById("fx-cur-amount").addEventListener("input", recomputeFromCur);

loadFxRates();
