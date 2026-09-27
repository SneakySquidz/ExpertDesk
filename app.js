// Expert Desk — EU per diem search/browse + simple day counter.
// Real data throughout: data.js (DG INTPA per diem) + fx-rates.json (InforEuro).

// ---------------------------------------------------------------
// Currency conversion (InforEuro monthly rates, bundled + auto-refreshed)
// ---------------------------------------------------------------
let fxRates = { EUR: 1 };
let currentCurrency = "EUR";

async function loadFxRates() {
  const note = document.getElementById("fx-note");
  try {
    const res = await fetch("fx-rates.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`fx-rates.json fetch failed: ${res.status}`);
    const payload = await res.json();
    fxRates = Object.fromEntries(Object.entries(payload.rates).map(([code, r]) => [code, r.value]));
    populateCurrencySelect(payload.rates);
    const period = `${payload.year}-${String(payload.month).padStart(2, "0")}`;
    note.textContent = `InforEuro rates for ${period}. EUR is the only officially binding figure.`;
  } catch (err) {
    fxRates = { EUR: 1 };
    populateCurrencySelect({});
    note.textContent = "Exchange rates unavailable right now — showing EUR only (the official rate).";
  }
}

function populateCurrencySelect(rateDetails) {
  const select = document.getElementById("pd-currency");
  const prior = select.value || "EUR";
  select.innerHTML = "";
  const codes = ["EUR", ...Object.keys(rateDetails).filter((c) => c !== "EUR").sort()];
  codes.forEach((code) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = code;
    select.appendChild(opt);
  });
  select.value = codes.includes(prior) ? prior : "EUR";
  currentCurrency = select.value;
}

function convert(eurAmount, code) {
  const rate = fxRates[code];
  return rate ? eurAmount * rate : eurAmount;
}

function fmtAmount(amount, code) {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${code}`;
}

document.getElementById("pd-currency").addEventListener("change", (e) => {
  currentCurrency = e.target.value;
  renderList(document.getElementById("pd-search").value);
  updateResult();
});

// ---------------------------------------------------------------
// Per diem: search / browse
// ---------------------------------------------------------------
const countries = Object.keys(PER_DIEM_RATES_EUR).sort((a, b) => a.localeCompare(b));
let selectedCountry = null;

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
    row.innerHTML = `<span>${country}</span><span class="pd-rate">${fmtAmount(convert(PER_DIEM_RATES_EUR[country], currentCurrency), currentCurrency)}/day</span>`;
    row.addEventListener("click", () => selectCountry(country));
    list.appendChild(row);
  });
}

function selectCountry(country) {
  selectedCountry = country;
  renderList(document.getElementById("pd-search").value);
  updateResult();
}

document.getElementById("pd-search").addEventListener("input", (e) => renderList(e.target.value));

// ---------------------------------------------------------------
// Basic day counter (+ / − / typed) with optional adjustments
// ---------------------------------------------------------------
const daysInput = document.getElementById("pd-days");

function getDays() {
  return Math.max(0, parseFloat(daysInput.value) || 0);
}

function setDays(n) {
  daysInput.value = Math.max(0, n);
  updateResult();
}

document.getElementById("pd-minus").addEventListener("click", () => setDays(getDays() - 1));
document.getElementById("pd-plus").addEventListener("click", () => setDays(getDays() + 1));
daysInput.addEventListener("input", updateResult);
document.getElementById("pd-arrival-departure").addEventListener("change", updateResult);

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

// ---------------------------------------------------------------
// Result line — selected country, rate, running total
// ---------------------------------------------------------------
function updateResult() {
  const selected = document.getElementById("pd-selected");
  const result = document.getElementById("pd-result");

  if (!selectedCountry) {
    selected.textContent = "Select a country above to start counting.";
    result.textContent = "";
    return;
  }

  const rateEur = PER_DIEM_RATES_EUR[selectedCountry];
  const rate = convert(rateEur, currentCurrency);
  selected.textContent =
    currentCurrency === "EUR"
      ? `${selectedCountry} — ${fmtAmount(rate, currentCurrency)}/day`
      : `${selectedCountry} — ${fmtAmount(rate, currentCurrency)}/day (official rate: €${rateEur}/day)`;

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

  result.textContent = `${days} day(s) → ${fmtAmount(total, currentCurrency)}`;
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
renderList("");
loadFxRates();
