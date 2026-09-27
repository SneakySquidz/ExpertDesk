// Official EU per diem (daily subsistence allowance) rates, in EUR.
//
// Source: European Commission, DG INTPA — "Current per diem rates".
// Decision C(2024)5405, applied to all contracts concluded from 2024-11-08.
// Governing rules: PRAG (Practical Guide to contract procedures for EU
// external actions), Section 2.5.5.
//
// https://international-partnerships.ec.europa.eu/document/download/167fc5d8-015b-4a51-85b1-266891fbcc21_en?filename=per-diem-rates-20241108_en.pdf
//
// EUR is the only officially binding figure. Any other currency shown in
// the app is a live conversion for reference only — never submit a claim
// in a converted currency.
const PER_DIEM_SOURCE = {
  decision: "C(2024)5405",
  effectiveFrom: "2024-11-08",
  url: "https://international-partnerships.ec.europa.eu/document/download/167fc5d8-015b-4a51-85b1-266891fbcc21_en?filename=per-diem-rates-20241108_en.pdf",
};

const PER_DIEM_RATES_EUR = {
  "Afghanistan": 125, "Albania": 210, "Algeria": 242, "American Samoa": 205,
  "Angola": 280, "Anguilla": 215, "Antigua and Barbuda": 225, "Argentina": 285,
  "Armenia": 280, "Aruba": 265, "Australia": 210, "Austria": 234,
  "Azerbaijan": 270, "Bahamas": 190, "Bahrain": 275, "Bangladesh": 190,
  "Barbados": 215, "Belarus": 225, "Belgium": 250, "Belize": 185,
  "Benin": 150, "Bermuda": 210, "Bhutan": 180, "Bolivia": 150,
  "Bonaire": 275, "Bosnia and Herzegovina": 200, "Botswana": 185, "Brazil": 245,
  "British Virgin Islands": 215, "Brunei": 225, "Bulgaria": 192, "Burkina Faso": 145,
  "Burundi": 165, "Cabo Verde": 125, "Cambodia": 165, "Cameroon": 160,
  "Canada": 230, "Cayman Islands": 195, "Central African Republic": 140, "Chad": 210,
  "Chile": 245, "China": 210, "Colombia": 170, "Comoros": 135,
  "Congo (Brazzaville)": 185, "Congo (Kinshasa)": 245, "Cook Islands": 185, "Costa Rica": 190,
  "Côte d’Ivoire": 190, "Croatia": 185, "Cuba": 225, "Curaçao": 275,
  "Cyprus": 228, "Czechia": 194, "Denmark": 297, "Djibouti": 235,
  "Dominica": 215, "Dominican Republic": 230, "Ecuador": 190, "Egypt": 217,
  "El Salvador": 180, "Equatorial Guinea": 145, "Eritrea": 130, "Estonia": 187,
  "Eswatini": 140, "Ethiopia": 195, "Fiji": 170, "Finland": 259,
  "France": 282, "French Guiana": 195, "French Polynesia": 195, "Gabon": 190,
  "Georgia": 295, "Germany": 225, "Ghana": 210, "Greece": 194,
  "Grenada": 215, "Guadeloupe": 180, "Guam": 195, "Guatemala": 175,
  "Guinea": 185, "Guinea-Bissau": 140, "Guyana": 210, "Haiti": 190,
  "Honduras": 175, "Hong Kong": 265, "Hungary": 184, "Iceland": 275,
  "India": 245, "Indonesia": 195, "Iran": 200, "Iraq": 145,
  "Ireland": 267, "Israel": 315, "Italy": 246, "Jamaica": 230,
  "Japan": 405, "Jordan": 200, "Kazakhstan": 245, "Kenya": 225,
  "Kiribati": 205, "Kosovo": 220, "Kuwait": 280, "Kyrgyzstan": 255,
  "Laos": 195, "Latvia": 189, "Lebanon": 260, "Lesotho": 150,
  "Liberia": 235, "Libya": 225, "Liechtenstein": 215, "Lithuania": 186,
  "Luxembourg": 261, "Macao": 150, "Madagascar": 155, "Malawi": 215,
  "Malaysia": 250, "Maldives": 185, "Mali": 155, "Malta": 229,
  "Marshall Islands": 185, "Martinique": 180, "Mauritania": 125, "Mauritius": 200,
  "Mayotte": 160, "Mexico": 255, "Micronesia": 190, "Moldova": 250,
  "Mongolia": 160, "Montenegro": 220, "Montserrat": 195, "Morocco": 205,
  "Mozambique": 200, "Myanmar/Burma": 125, "Namibia": 135, "Nauru": 185,
  "Nepal": 185, "Netherlands": 269, "New Caledonia": 190, "New Zealand": 185,
  "Nicaragua": 185, "Niger": 125, "Nigeria": 235, "Niue": 185,
  "North Korea": 230, "North Macedonia": 210, "Northern Mariana Islands": 205, "Norway": 225,
  "Oman": 205, "Pakistan": 180, "Palau": 185, "Palestine": 200,
  "Panama": 210, "Papua New Guinea": 190, "Paraguay": 190, "Peru": 210,
  "Philippines": 210, "Poland": 183, "Portugal": 192, "Puerto Rico": 205,
  "Qatar": 200, "Réunion": 150, "Romania": 198, "Russia": 365,
  "Rwanda": 225, "Saint Barthélemy": 180, "Saint Kitts and Nevis": 270, "Saint Lucia": 215,
  "Saint Martin": 180, "Saint Vincent and the Grenadines": 265, "Samoa": 185, "São Tomé and Príncipe": 155,
  "Saudi Arabia": 280, "Senegal": 200, "Serbia": 220, "Seychelles": 225,
  "Sierra Leone": 190, "Singapore": 225, "Sint Maarten": 275, "Slovakia": 174,
  "Slovenia": 201, "Solomon Islands": 170, "Somalia": 175, "South Africa": 195,
  "South Korea": 300, "South Sudan": 270, "Spain": 216, "Sri Lanka": 155,
  "Sudan": 270, "Suriname": 180, "Sweden": 304, "Switzerland": 258,
  "Syria": 225, "Taiwan": 255, "Tajikistan": 185, "Tanzania": 250,
  "Thailand": 205, "The Gambia": 170, "Timor-Leste": 160, "Togo": 155,
  "Tokelau": 185, "Tonga": 155, "Trinidad and Tobago": 175, "Tunisia": 159,
  "Türkiye": 220, "Turkmenistan": 230, "Turks and Caicos Islands": 190, "Tuvalu": 185,
  "Uganda": 235, "Ukraine": 270, "United Arab Emirates": 265, "United Kingdom": 334,
  "United States of America (except N.Y)": 280, "United States of America (New York)": 375,
  "Uruguay": 215, "US Virgin Islands": 195, "Uzbekistan": 230, "Vanuatu": 170,
  "Venezuela": 210, "Viet Nam": 255, "Wallis and Futuna": 185, "Yemen": 225,
  "Zambia": 185, "Zimbabwe": 165,
  "Other country or territory": 205,
};
