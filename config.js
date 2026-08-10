// =====================================================================
// Retail Stock Requirement Form - frontend configuration
// =====================================================================

// ================= BACKEND CONNECTION =================
// If this form is deployed on Vercel (frontend + api/ in the same
// project - the default setup), a relative path is all you need: it
// automatically resolves against whatever domain the page is loaded from,
// so you never have to edit this after deploying.
const BACKEND_URL = "/api/save-requirement";

// Running the LOCAL Node backend instead (see ../backend, started with
// `npm run dev` from the project root)? Comment the line above out and
// uncomment this one instead:
// const BACKEND_URL = "http://localhost:4000/api/save-requirement";
// =========================================================

// ================= BRANCH LOGIN CREDENTIALS =================
// One username/password per branch. Username lookup is case-insensitive.
// Edit this list any time to add branches, or give a branch its own
// unique password instead of the shared one.
// NOTE: these credentials live in plain text inside this file, so anyone
// who can open/view the file's source can read them. This is a basic
// access gate for internal use, not secure authentication.
const BRANCH_CREDENTIALS = {
    "ho@showoffff":                       { password: "Showoffff@123", branch: "HEAD OFFICE", isHO: true },
    "bidar@showoffff":                    { password: "Showoffff@123", branch: "BIDAR" },
    "bijapur@showoffff":                  { password: "Showoffff@123", branch: "BIJAPUR" },
    "chikmagalur@showoffff":              { password: "Showoffff@123", branch: "CHIKMAGALUR" },
    "gopalanarcade@showoffff":            { password: "Showoffff@123", branch: "GOPALAN ARCADE" },
    "gopalansignaturemall@showoffff":     { password: "Showoffff@123", branch: "GOPALAN SIGNATURE MALL" },
    "hassan@showoffff":                   { password: "Showoffff@123", branch: "HASSAN" },
    "jaynagar@showoffff":                 { password: "Showoffff@123", branch: "JAYNAGAR" },
    "jaynagarsalepoint@showoffff":        { password: "Showoffff@123", branch: "JAYNAGAR SALE POINT" },
    "kalaburagi@showoffff":               { password: "Showoffff@123", branch: "KALABURAGI" },
    "mantrimall@showoffff":               { password: "Showoffff@123", branch: "MANTRI MALL" },
    "mysore@showoffff":                   { password: "Showoffff@123", branch: "MYSORE" },
    "newcommercialstreet@showoffff":      { password: "Showoffff@123", branch: "NEW COMMERCIAL STREET" },
    "phoenixmarketcitymall@showoffff":    { password: "Showoffff@123", branch: "PHOENIX MARKETCITY MALL" },
    "royalmeenakashimall@showoffff":      { password: "Showoffff@123", branch: "ROYAL MEENAKASHI MALL" },
    "showoffmalleshwaram@showoffff":      { password: "Showoffff@123", branch: "SHOWOFF MALLESHWARAM" },
    "tumkur@showoffff":                   { password: "Showoffff@123", branch: "TUMKUR" },
    "yelahanka@showoffff":                { password: "Showoffff@123", branch: "YELAHANKA" }
  };
// =============================================================
