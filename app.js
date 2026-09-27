// Expert Desk — EU per diem search/browse + day-count calculator.
// Real data (data.js), live currency conversion, no fake sections.

// ---------------------------------------------------------------
// Currency conversion (live ECB rates via frankfurter.app, EUR base)
// ---------------------------------------------------------------
const FX_CACHE_KEY = "expertdesk.fxRates";
const FX_CACHE_MS = 12 * 60 * 60 * 1000; // 12h

let fxRates = { EUR: 1 };
let currentCurrency = "EUR";

async function loadFxRates() {
  const note = document.getElementById("fx-note");
  try {
    const cached = JSON.parse(localStorage.getItem(FX_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.fetchedAt < FX_CACHE_MS) {
      fxRates = cached.rates;
      populateCurrencySelect();
      note.textContent = `Live rates cached ${new Date(cached.fetchedAt).toLocaleString()}.`;
      return;
    }

    const res = await fetch("https://api.frankfurter.app/latest?from=EUR");
    if (!res.ok) throw new Error(`FX fetch failed: ${res.status}`);
    const payload = await res.json();
    fxRates = { EUR: 1, ...payload.rates };
    localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ rates: fxRates, fetchedAt: Date.now() }));
    populateCurrencySelect();
    note.textContent = `Live ECB reference rates as of ${payload.date}. EUR is the only officially binding figure.`;
  } catch (err) {
    fxRates = { EUR: 1 };
    populateCurrencySelect();
    note.textContent = "Currency conversion unavailable right now — showing EUR only (the official rate).";
  }
}

function populateCurrencySelect() {
  const select = document.getElementById("pd-currency");
  const prior = select.value || "EUR";
  select.innerHTML = "";
  const codes = ["EUR", ...Object.keys(fxRates).filter((c) => c !== "EUR").sort()];
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
  if (selectedCountry) selectCountry(selectedCountry);
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
  const rateEur = PER_DIEM_RATES_EUR[country];
  const converted = fmtAmount(convert(rateEur, currentCurrency), currentCurrency);
  document.getElementById("pd-selected").textContent =
    currentCurrency === "EUR"
      ? `${country} — ${converted}/day`
      : `${country} — ${converted}/day (official rate: €${rateEur}/day)`;
}

document.getElementById("pd-search").addEventListener("input", (e) => renderList(e.target.value));

document.getElementById("perdiem-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const result = document.getElementById("pd-result");
  if (!selectedCountry) {
    result.textContent = "Pick a country from the list above first.";
    return;
  }
  const days = parseFloat(document.getElementById("pd-days").value) || 0;
  const halfEnds = document.getElementById("pd-arrival-departure").checked;
  const rate = convert(PER_DIEM_RATES_EUR[selectedCountry], currentCurrency);

  let total;
  if (halfEnds && days >= 2) {
    total = rate * 0.5 * 2 + rate * (days - 2);
  } else if (halfEnds && days > 0) {
    total = rate * 0.5 * days;
  } else {
    total = rate * days;
  }

  result.textContent = `${selectedCountry}: ${days} day(s) at ${fmtAmount(rate, currentCurrency)}/day → ${fmtAmount(total, currentCurrency)}`;
});

// ---------------------------------------------------------------
// Day-count calculator
// ---------------------------------------------------------------
document.getElementById("daycount-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const start = new Date(document.getElementById("dc-start").value);
  const end = new Date(document.getElementById("dc-end").value);
  const result = document.getElementById("dc-result");

  if (isNaN(start) || isNaN(end) || end < start) {
    result.textContent = "Enter a valid start and end date (end must be on or after start).";
    return;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.round((end - start) / msPerDay) + 1; // inclusive
  result.textContent = `${days} day(s) inclusive.`;
});

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
renderList("");
loadFxRates();
