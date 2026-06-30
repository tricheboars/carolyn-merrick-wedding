// Single source of truth for all editable site content (house pattern: render from data).
// Placeholders read "coming soon"/"to be announced" until the couple/Patrick send finals.

// Hostname is the ONE place the domain is defined. Override at build time with
// SITE_DOMAIN=... — e.g. `SITE_DOMAIN=carolynandmerrick.com npm run build` — if the
// couple buy their own domain later. No code change needed; everything derives from it.
const domain = process.env.SITE_DOMAIN || "merrolyn.com";

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
  domain: domain,                 // current: merrolyn.com (prod) / merrolyn.moorelab.cloud (dev)
  url: `https://${domain}`,       // used for canonical + og:url
  tagline: "We can't wait to celebrate with you on the coast of Maine.",

  nav: [
    { label: "Our Story", url: "/story/" },
    { label: "Schedule", url: "/schedule/" },
    { label: "Travel", url: "/travel/" },
    { label: "Stay", url: "/stay/" },
    { label: "Gallery", url: "/gallery/" },
    { label: "Registry", url: "/registry/" },
    { label: "FAQ", url: "/faq/" },
    { label: "RSVP", url: "/rsvp/" }
  ],

  story: {
    lead: "How Carolyn and Merrick found their way to a tent in the woods and a wedding on the coast.",
    body: "Our story is coming soon — how Carolyn and Merrick met, the proposal, and why Maine. Check back as we get closer to the day."
  },

  schedule: [
    { time: "TBA", title: "Welcome gathering", detail: "Friday evening — casual, all guests welcome.", day: "Fri, Aug 13" },
    { time: "4:00 PM", title: "Ceremony", detail: "The Harpswell Inn, on the point.", day: "Sat, Aug 14" },
    { time: "5:00 PM", title: "Cocktail hour", detail: "Lawn overlooking Middle Bay.", day: "Sat, Aug 14" },
    { time: "6:30 PM", title: "Dinner & dancing", detail: "Reception under the tent.", day: "Sat, Aug 14" },
    { time: "TBA", title: "Farewell brunch", detail: "Sunday send-off.", day: "Sun, Aug 15" }
  ],

  travel: {
    intro: "Harpswell sits on a string of peninsulas in Casco Bay — classic midcoast Maine. Here's the easiest way in.",
    airport: { name: "Portland International Jetport (PWM)", note: "~45 minutes south. Easiest major airport." },
    alt: { name: "Boston Logan (BOS)", note: "~2.25 hours; more flights, longer drive." },
    drive: "From Portland, take I-295 N to Brunswick, then Rt 123 south down the Harpswell peninsula.",
    parking: "Ample parking at the inn.",
    shuttle: "If we arrange a shuttle from a host hotel, details will appear here — and we'll text you."
  },

  stay: [
    { name: "The Harpswell Inn", note: "Rooms at the venue — book early.", url: "#" },
    { name: "Brunswick hotels (~20 min)", note: "Chain + boutique options near Bowdoin College.", url: "#" },
    { name: "Bailey Island cottages", note: "Down the peninsula, on the water.", url: "#" },
    { name: "Group room block — to be announced", note: "If we secure a hotel block, the code will appear here.", url: "#" }
  ],

  thingsToDo: [
    { name: "Cribstone Bridge & Land's End", note: "Drive out Bailey Island to the world's only granite cribstone bridge, and on to the views at Land's End." },
    { name: "Mackerel Cove", note: "A postcard working lobster harbor on Bailey Island." },
    { name: "Lobster on the water", note: "Cook's Lobster & Ale House and Dolphin Marina & Restaurant are local institutions." },
    { name: "Giant Stairs", note: "A short, rocky coastal trail with open ocean views on Bailey Island." },
    { name: "Brunswick & Portland", note: "Bowdoin College and Maine Street are ~20 min; Portland's Old Port and Portland Head Light ~45 min." }
  ],

  faq: [
    { q: "What's the weather like in August?", a: "Coastal-Maine summer: warm days (mid-70s–80s°F) and cool evenings on the water. Bring a layer for the night." },
    { q: "What should we wear?", a: "Dress code is being finalized — likely semi-formal / garden party. Comfortable shoes are smart for grass and rocks." },
    { q: "Is the celebration indoors or outdoors?", a: "Most of the day is expected to be outdoors and tented on the point — we'll confirm closer to the date." },
    { q: "Can I bring a plus-one?", a: "Your invitation and RSVP will show who's included. Questions? Just ask." },
    { q: "Parking / is there a shuttle?", a: "Parking is at the inn. If we run a shuttle, we'll share the details (and text you)." },
    { q: "Are kids welcome?", a: "Your invitation will note who's included — and you're always welcome to ask us." },
    { q: "What about gifts?", a: "Your presence is the gift. If you'd like, there's a house fund on the Registry page." },
    { q: "How do I RSVP?", a: "Right here on the site — and once our number is live, by text too. Note any dietary needs on your RSVP." }
  ],

  gallery: [
    { src: "/assets/img/gallery/g01.jpg", alt: "Carolyn & Merrick by the tent in the redwoods" },
    { src: "/assets/img/gallery/g02.jpg", alt: "Carolyn & Merrick, in black & white" },
    { src: "/assets/img/gallery/g03.jpg", alt: "Among the redwoods" },
    { src: "/assets/img/gallery/g04.jpg", alt: "The ring" },
    { src: "/assets/img/gallery/g05.jpg", alt: "A quiet moment" },
    { src: "/assets/img/gallery/g06.jpg", alt: "On the foggy coast" },
    { src: "/assets/img/gallery/g07.jpg", alt: "In the trees" },
    { src: "/assets/img/gallery/g08.jpg", alt: "Autumn in the forest" },
    { src: "/assets/img/gallery/g09.jpg", alt: "Carolyn" },
    { src: "/assets/img/gallery/g10.jpg", alt: "By the sea" },
    { src: "/assets/img/gallery/g11.jpg", alt: "Together on the beach" },
    { src: "/assets/img/gallery/g12.jpg", alt: "The two of them" }
  ],

  registry: {
    intro: "Your presence is the gift. If you'd like to help us build our first home together, a contribution to our house fund means the world — no registry, no shipping, just thank-yous from us.",
    methods: [
      { label: "Venmo", handle: "Coming soon", icon: "ti-brand-venmo" },
      { label: "Zelle", handle: "Coming soon", icon: "ti-device-mobile" },
      { label: "PayPal", handle: "Coming soon", icon: "ti-brand-paypal" },
      { label: "By mail", handle: "Coming soon", icon: "ti-mail" }
    ],
    note: "Sent something? Let us know below so we can thank you properly."
  },

  rsvp: {
    deadline: "To be announced",
    note: "RSVP online below. Prefer texting? Once our number is live you'll be able to RSVP by SMS too."
  },

  // photo-forward hero: real Lookout Point (Harpswell) sunset for now; swap to the
  // couple's engagement photo by replacing --hero-photo in style.css (or this asset).
  heroPhoto: "/assets/img/hero-lookout-point.jpg",

  // Attribution for the coastal-Maine background photos (Wikimedia Commons).
  photoCredits: [
    { title: "Sunset at Lookout Point, Harpswell, Maine", author: "Paul VanDerWerf",
      license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      source: "https://commons.wikimedia.org/wiki/File:Sunset_at_Lookout_Point_in_Harpswell,_Maine,_2017-9.jpg" },
    { title: "South Harpswell, Maine — panoramic view", author: "Daderot",
      license: "Public domain", licenseUrl: "",
      source: "https://commons.wikimedia.org/wiki/File:South_Harpswell,_Maine_-_panoramic_view.jpg" },
    { title: "Casco Bay, Maine", author: "Dougtone",
      license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      source: "https://commons.wikimedia.org/wiki/File:Casco_Bay_092108_140.jpg" },
    { title: "Bailey Island (Cribstone) Bridge, Harpswell", author: "Daderot",
      license: "Public domain", licenseUrl: "",
      source: "https://commons.wikimedia.org/wiki/File:Bailey_Island_Bridge,_Harpswell,_ME_-_panorama.jpg" },
    { title: "Engagement photos — hero, Our Story, Gallery", author: "Carolyn & Merrick's October 2025 engagement session",
      license: "", licenseUrl: "", source: "" }
  ]
};
