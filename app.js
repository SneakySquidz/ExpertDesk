// Expert Desk — tools, updates, gated insights.
// Everything here is placeholder data/logic to be replaced with real figures.

// ---------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// ---------------------------------------------------------------
// TOOLS: per diem calculator
// ---------------------------------------------------------------
// PLACEHOLDER RATES — not real EU/UN daily subsistence allowance figures.
// Replace with the actual rate table you work from (e.g. EU DSA by country).
const PER_DIEM_RATES = {
  "Belgium": 148,
  "France": 180,
  "Spain": 175,
  "Italy": 190,
  "Poland": 150,
  "Nigeria": 210,
  "Kenya": 195,
  "Generic / other": 160,
};

const countrySelect = document.getElementById("pd-country");
Object.keys(PER_DIEM_RATES).forEach((country) => {
  const opt = document.createElement("option");
  opt.value = country;
  opt.textContent = `${country} — ${PER_DIEM_RATES[country]}/day (placeholder)`;
  countrySelect.appendChild(opt);
});

document.getElementById("perdiem-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const country = countrySelect.value;
  const days = parseFloat(document.getElementById("pd-days").value) || 0;
  const halfEnds = document.getElementById("pd-arrival-departure").checked;
  const rate = PER_DIEM_RATES[country];

  let total;
  if (halfEnds && days >= 2) {
    // First and last day at 50%, full rate for days in between.
    total = rate * 0.5 * 2 + rate * (days - 2);
  } else if (halfEnds && days > 0) {
    total = rate * 0.5 * days;
  } else {
    total = rate * days;
  }

  document.getElementById("pd-result").textContent =
    `${country}: ${days} day(s) at ${rate}/day → ${total.toFixed(2)} (placeholder currency)`;
});

// ---------------------------------------------------------------
// TOOLS: day-count calculator
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
// UPDATES: key facts / compliance news (placeholder content)
// ---------------------------------------------------------------
const UPDATES = [
  {
    date: "2026-09-01",
    title: "Placeholder: EU procurement rule update",
    body: "Replace with a real summary and source link.",
  },
  {
    date: "2026-08-15",
    title: "Placeholder: sanctions list change",
    body: "Replace with a real summary and source link.",
  },
  {
    date: "2026-08-01",
    title: "Placeholder: per diem rate revision",
    body: "Replace with a real summary and source link.",
  },
];

const updatesList = document.getElementById("updates-list");
UPDATES.forEach((item) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="update-date">${item.date}</span><strong>${item.title}</strong><p>${item.body}</p>`;
  updatesList.appendChild(li);
});

// ---------------------------------------------------------------
// INSIGHTS: placeholder lock + compliance checklist
// ---------------------------------------------------------------
// NOT real security — a client-side passcode is trivially bypassed by
// reading this file. Fine as a placeholder gate, not for real access control.
const UNLOCK_CODE = "expertdesk"; // change this, or replace with real auth later
const UNLOCK_KEY = "medseas.expertdesk.unlocked";

const lockedPanel = document.getElementById("insights-locked");
const contentPanel = document.getElementById("insights-content");

function showUnlocked() {
  lockedPanel.classList.add("hidden");
  contentPanel.classList.remove("hidden");
}

if (localStorage.getItem(UNLOCK_KEY) === "true") {
  showUnlocked();
}

document.getElementById("unlock-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("unlock-code").value;
  const error = document.getElementById("unlock-error");

  if (code === UNLOCK_CODE) {
    localStorage.setItem(UNLOCK_KEY, "true");
    showUnlocked();
  } else {
    error.textContent = "Incorrect passcode.";
  }
});

// Compliance checklist (placeholder items, persisted per-browser)
const CHECKLIST_KEY = "medseas.expertdesk.checklist";
const DEFAULT_CHECKLIST = [
  { text: "Verify expert's conflict-of-interest declaration", done: false },
  { text: "Confirm insurance/medical cover for mission dates", done: false },
  { text: "Check sanctions/exclusion list before contracting", done: false },
  { text: "Confirm per diem rate against current published table", done: false },
  { text: "Collect signed code of conduct", done: false },
];

function loadChecklist() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY));
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_CHECKLIST;
  } catch {
    return DEFAULT_CHECKLIST;
  }
}

let checklist = loadChecklist();

function renderChecklist() {
  const ul = document.getElementById("checklist");
  ul.innerHTML = "";
  checklist.forEach((item, i) => {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = item.done;
    cb.addEventListener("change", () => {
      checklist[i].done = cb.checked;
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
      renderChecklist();
    });
    label.append(cb, document.createTextNode(" " + item.text));
    li.appendChild(label);
    ul.appendChild(li);
  });
}

renderChecklist();
