// Single source of truth for all editable site content (house pattern: render from data).
// Anything marked TODO is a placeholder awaiting the couple/Patrick.

// Hostname is the ONE place the domain is defined. Override at build time with
// SITE_DOMAIN=... — e.g. `SITE_DOMAIN=carolynandmerrick.com npm run build` — if the
// couple buy their own domain later. No code change needed; everything derives from it.
const domain = process.env.SITE_DOMAIN || "merrolyn.moorelab.cloud";

module.exports = {
  couple: {
    bride: "Carolyn Moore",
    groom: "Merrick Harris",
    short: "Carolyn & Merrick",
    initials: "C & M"
  },
  date: { iso: "2027-08-14", display: "August 14, 2027", short: "8.14.27" },
  venue: {
    name: "The Harpswell Inn",
    address: "108 Lookout Point Rd, Harpswell, ME 04079",
    town: "Harpswell, Maine",
    mapsQuery: "The+Harpswell+Inn,+108+Lookout+Point+Rd,+Harpswell,+ME+04079"
  },
  domain: domain,                 // current: merrolyn.moorelab.cloud (Patrick's wildcard)
  url: `https://${domain}`,       // used for canonical + og:url
  tagline: "We can't wait to celebrate with you on the coast of Maine.",

  nav: [
    { label: "Our Story", url: "/story/" },
    { label: "Schedule", url: "/schedule/" },
    { label: "Travel", url: "/travel/" },
    { label: "Stay", url: "/stay/" },
    { label: "Registry", url: "/registry/" },
    { label: "RSVP", url: "/rsvp/" }
  ],

  story: {
    lead: "How Carolyn and Merrick found their way to a tent in the woods and a wedding on the coast.",
    body: "TODO — the couple's story. A few warm paragraphs about how they met, the proposal, and why Maine."
  },

  // TODO: real times from the couple
  schedule: [
    { time: "TODO", title: "Welcome gathering", detail: "Friday evening — casual, all guests welcome.", day: "Fri, Aug 13" },
    { time: "4:00 PM", title: "Ceremony", detail: "The Harpswell Inn, on the point.", day: "Sat, Aug 14" },
    { time: "5:00 PM", title: "Cocktail hour", detail: "Lawn overlooking Middle Bay.", day: "Sat, Aug 14" },
    { time: "6:30 PM", title: "Dinner & dancing", detail: "Reception under the tent.", day: "Sat, Aug 14" },
    { time: "TODO", title: "Farewell brunch", detail: "Sunday send-off.", day: "Sun, Aug 15" }
  ],

  travel: {
    intro: "Harpswell sits on a string of peninsulas in Casco Bay — classic midcoast Maine. Here's the easiest way in.",
    airport: { name: "Portland International Jetport (PWM)", note: "~45 minutes south. Easiest major airport." },
    alt: { name: "Boston Logan (BOS)", note: "~2.25 hours; more flights, longer drive." },
    drive: "From Portland, take I-295 N to Brunswick, then Rt 123 south down the Harpswell peninsula.",
    parking: "Ample parking at the inn. TODO confirm shuttle plans.",
    shuttle: "TODO — if we run a shuttle from a host hotel, details land here (great SMS reminder)."
  },

  // TODO: confirmed lodging blocks
  stay: [
    { name: "The Harpswell Inn", note: "Rooms at the venue — book early.", url: "#" },
    { name: "Brunswick hotels (~20 min)", note: "Chain + boutique options near Bowdoin College.", url: "#" },
    { name: "Bailey Island cottages", note: "Down the peninsula, on the water.", url: "#" },
    { name: "TODO room block", note: "If we secure a block + code, it goes here.", url: "#" }
  ],

  registry: {
    intro: "Your presence is the gift. If you'd like to help us build our first home together, a contribution to our house fund means the world — no registry, no shipping, just thank-yous from us.",
    methods: [
      { label: "Venmo", handle: "@TODO", icon: "ti-brand-venmo" },
      { label: "Zelle", handle: "TODO (email/phone)", icon: "ti-device-mobile" },
      { label: "PayPal", handle: "TODO", icon: "ti-brand-paypal" },
      { label: "By mail", handle: "TODO mailing address", icon: "ti-mail" }
    ],
    note: "Sent something? Let us know below so we can thank you properly."
  },

  rsvp: {
    deadline: "TODO (e.g. July 1, 2027)",
    note: "RSVP online below. Prefer texting? Once our number is live you'll be able to RSVP by SMS too."
  },

  // photo-forward hero: swap this to the couple's engagement photo when we have it.
  // until then the layered coastal-Maine SVG scene is used (see CSS --hero-photo).
  heroPhoto: null
};
