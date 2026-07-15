// Single source of truth for all editable site content (house pattern: render from data).
// Placeholders read "coming soon"/"to be announced" until the couple/Patrick send finals.

// Hostname is the ONE place the domain is defined. Override at build time with
// SITE_DOMAIN=... — e.g. `SITE_DOMAIN=carolynandmerrick.com npm run build` — if the
// couple buy their own domain later. No code change needed; everything derives from it.
const domain = process.env.SITE_DOMAIN || "merrolyn.com";

// House-fund payment handles (Venmo/Zelle/mailing address) are kept OUT of this
// public repo — they load from the gitignored registry.local.json on the build box.
// Icon note: ti-brand-venmo doesn't exist in Tabler v3, hence ti-cash.
let registryMethods;
try {
  registryMethods = require("./registry.local.json");
} catch {
  console.warn("\n[site.js] WARNING: _data/registry.local.json not found — the Registry page will say \"Coming soon\". Copy registry.local.json.example and fill in the real handles.\n");
  registryMethods = [
    { label: "Venmo", handle: "Coming soon", icon: "ti-cash" },
    { label: "Zelle", handle: "Coming soon", icon: "ti-device-mobile" },
    { label: "By mail", handle: "Coming soon", icon: "ti-mail" }
  ];
}

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

  // Stay + Music unpublished 2026-07-14 per Carolyn (Stay returns once lodging can be
  // shown per-guest behind sign-in; Music cut from the site). Pages now redirect home.
  nav: [
    { label: "Our Story", url: "/story/" },
    { label: "Schedule", url: "/schedule/" },
    { label: "Travel", url: "/travel/" },
    { label: "Eat", url: "/eat/" },
    { label: "Gallery", url: "/gallery/" },
    { label: "Registry", url: "/registry/" },
    { label: "FAQ", url: "/faq/" },
    { label: "RSVP", url: "/rsvp/" }
  ],

  story: {
    lead: "How Carolyn and Merrick found their way to a tent in the woods and a wedding on the coast.",
    body: "Our story is coming soon: how Carolyn and Merrick met, the proposal, and why Maine. Check back as we get closer to the day."
  },

  // All times TBA per Carolyn (2026-07-14) — the old 4:00/5:00/6:30 were placeholder
  // guesses that read as real. Restore real times only when the couple confirms them.
  schedule: [
    { time: "TBA", title: "Welcome gathering", detail: "Friday evening. Casual, all guests welcome.", day: "Fri, Aug 13" },
    { time: "TBA", title: "Ceremony", detail: "The Harpswell Inn, on the point.", day: "Sat, Aug 14" },
    { time: "TBA", title: "Cocktail hour", detail: "Lawn overlooking Middle Bay.", day: "Sat, Aug 14" },
    { time: "TBA", title: "Dinner & dancing", detail: "Reception under the tent.", day: "Sat, Aug 14" },
    { time: "TBA", title: "Farewell brunch", detail: "Sunday send-off.", day: "Sun, Aug 15" }
  ],

  travel: {
    intro: "Harpswell sits on a string of peninsulas in Casco Bay, classic midcoast Maine. Here's the easiest way in.",
    airport: { name: "Portland International Jetport (PWM)", note: "~45 minutes south. Easiest major airport." },
    alt: { name: "Boston Logan (BOS)", note: "~2.25 hours; more flights, longer drive." },
    drive: "From Portland, take I-295 N to Brunswick, then Rt 123 south down the Harpswell peninsula.",
    parking: "Ample parking at the inn.",
    // Airport-transfer instructions per Carolyn (2026-07-14): Uber works FROM the
    // Jetport; the ride back must be prebooked (Brunswick Taxi). Sources: docs/data-transport.md.
    transfers: {
      toInn: "Flying into Portland? Uber and Lyft pick up right outside baggage claim at the Jetport, and the ride out to Harpswell takes about 45 minutes.",
      toAirport: "The trip back is the one to plan ahead. Ride apps are spotty in Brunswick and out on the peninsula, so schedule your airport ride in advance with Brunswick Taxi. A day or two of notice is plenty, and they run to the Jetport around the clock.",
      taxiName: "Brunswick Taxi",
      taxiPhone: "(207) 729-3688"
    },
    shuttle: "Still TBD. We're working out the details, and the schedule will appear right here as soon as it's set. We'll text you too."
  },

  // Verified ground-transport guidance — sources + backups in docs/data-transport.md
  // (verified 2026-07-02; re-verify phone numbers ~July 2027 before the wedding).
  gettingAround: {
    intro: "A quick word about ride apps: Uber and Lyft work well in Portland, but they thin out in Brunswick after dark and are close to nonexistent on the Harpswell peninsula. You can often get a ride out to the inn; it's the ride home that never shows. Rent a car, share one with friends and a designated driver, or book a pickup time in advance.",
    options: [
      { name: "Brunswick Taxi", phone: "(207) 729-3688", url: "https://www.yelp.com/biz/brunswick-taxi-brunswick",
        note: "The local go-to, family run since 1990 and about 15 minutes from the inn. They cover Harpswell and run to the Jetport around the clock. Book a day or two ahead; they drive until 1am most nights and 2am on Saturdays." },
      { name: "Maine Limousine Service", phone: "1-800-646-0068", url: "https://www.mainelimo.com/",
        note: "A prebooked private car or SUV waiting for you at the airport. The comfortable option if you would rather not watch an app spin." },
      { name: "Amtrak Downeaster", phone: "", url: "https://amtrakdowneaster.com/stations/brunswick/",
        note: "Coming from Boston? Five trains a day run from North Station straight into downtown Brunswick, and it's a 20 minute cab ride from the station to the inn." }
    ]
  },

  // Verified 2026-07-02 → docs/data-lodging.md. NEVER link "harpswellinn.com" (no
  // "the"): that lookalike domain is hijacked. The real site is theharpswellinn.com.
  // NOTE: the /stay/ page is UNPUBLISHED (2026-07-14, Carolyn) until lodging can be
  // shown per-guest behind sign-in. Data kept current here so it's ready to relight.
  stay: [
    { name: "The Harpswell Inn", note: "The venue itself has eight rooms and three suites, so a lucky few can stay steps from the ceremony. Book directly and book early. These will go first.", url: "https://www.theharpswellinn.com/rooms-suites" },
    { name: "The Brunswick Hotel", note: "A boutique hotel at the edge of the Bowdoin campus, steps from Maine Street's restaurants. About 20 minutes from the inn.", url: "https://thebrunswickhotel.com/" },
    { name: "The Federal", note: "A small boutique hotel and restaurant in the historic Captain Daniel Stone house, near downtown Brunswick.", url: "https://www.thefederalmaine.com/" },
    { name: "Fairfield Inn & Suites Brunswick", note: "The reliable chain option: free breakfast, a pool, and easy parking, about 20 minutes away.", url: "https://www.marriott.com/en-us/hotels/pwmbw-fairfield-inn-and-suites-brunswick-freeport/overview/" },
    { name: "Cottages on Bailey & Orr's Island", note: "On the water about half an hour from the inn, across the famous Cribstone Bridge. Your Island Connection has handled rentals out here since 1982, and Vrbo and Airbnb have plenty too. Book many months ahead for a summer Saturday.", url: "https://www.mainerentals.com/" },
    { name: "Group room block: to be announced", note: "If we secure a hotel block, the code will appear here.", url: "#" }
  ],

  // Facts + links verified 2026-07-02 against town/land-trust/official pages →
  // docs/data-attractions.md ("Giant's Stairs" spelling, hedged bridge claim, real drive times).
  thingsToDo: [
    { name: "Cribstone Bridge & Land's End", note: "Drive out to Bailey Island over the Cribstone Bridge, believed to be the only one of its kind in the world: granite slabs stacked like Lincoln Logs, no mortar, so the tide flows right through. Keep going to the open-Atlantic views at Land's End.", url: "https://harpswellmaine.org/cribstone-bridge/" },
    { name: "Mackerel Cove", note: "A postcard working lobster harbor on Bailey Island, one of the most scenic in Maine.", url: "https://hhltmaine.org/get-outdoors/johnson-field-preserve/" },
    { name: "Lobster on the water", note: "Morse's food trailer is a one minute walk from the inn, and Cook's Lobster & Ale House and the Dolphin Marina are local institutions. Our Eat page has the full list.", url: "/eat/" },
    { name: "Giant's Stairs", note: "A short, rocky shore path on Bailey Island with big open ocean views. Ten minutes of easy walking, waves crashing on the rocks, well worth the detour.", url: "https://hhltmaine.org/get-outdoors/giants-stairs-mcintosh/" },
    { name: "Brunswick & Portland", note: "Bowdoin College and Maine Street's shops are about 15 minutes up Route 123. Portland's Old Port is about 45 minutes, and Portland Head Light is about an hour and pairs well with an Old Port lunch.", url: "https://visitportland.com/" }
  ],

  faq: [
    { q: "What's the weather like in August?", a: "Coastal-Maine summer: warm days (mid-70s–80s°F) and cool evenings on the water. Bring a layer for the night." },
    { q: "What should we wear?", a: "Dress code is being finalized. Expect semi-formal / garden party. Comfortable shoes are smart for grass and rocks." },
    { q: "Is the celebration indoors or outdoors?", a: "Most of the day is expected to be outdoors and tented on the point. We'll confirm closer to the date." },
    { q: "Can I bring a plus-one?", a: "Your invitation and RSVP will show who's included. Questions? Just ask." },
    { q: "Parking / is there a shuttle?", a: "Parking is at the inn. A shuttle is in the works, and the schedule will be posted on the <a href='/travel/'>Travel</a> page once it's set. We'll text you too." },
    { q: "Are kids welcome?", a: "Your invitation will note who's included, and you're always welcome to ask us." },
    { q: "What should we do while we're in Maine?", a: "We made pages for that: things to do on the <a href='/travel/'>Travel</a> page and restaurants worth the trip on the <a href='/eat/'>Eat</a> page." },
    { q: "What about gifts?", a: "Your presence is the gift. If you'd like, there's a house fund on the Registry page." },
    { q: "How do I RSVP?", a: "Right here on the site. Once our number is live, you'll be able to RSVP by text too. Note any dietary needs on your RSVP." }
  ],

  // w/h are the intrinsic pixel dims (verified with `identify`) so the masonry can
  // reserve correct boxes before lazy images load; -400/-800 variants feed srcset.
  gallery: [
    { src: "/assets/img/gallery/g01.jpg", w: 1500, h: 995,  alt: "Carolyn & Merrick by the tent in the redwoods" },
    { src: "/assets/img/gallery/g02.jpg", w: 1200, h: 1500, alt: "Carolyn & Merrick, in black & white" },
    { src: "/assets/img/gallery/g03.jpg", w: 995,  h: 1500, alt: "Among the redwoods" },
    { src: "/assets/img/gallery/g04.jpg", w: 1500, h: 995,  alt: "The ring" },
    { src: "/assets/img/gallery/g05.jpg", w: 995,  h: 1500, alt: "A quiet moment" },
    { src: "/assets/img/gallery/g06.jpg", w: 995,  h: 1500, alt: "On the foggy coast" },
    { src: "/assets/img/gallery/g07.jpg", w: 1000, h: 1500, alt: "In the trees" },
    { src: "/assets/img/gallery/g08.jpg", w: 1000, h: 1500, alt: "Autumn in the forest" },
    { src: "/assets/img/gallery/g09.jpg", w: 1000, h: 1500, alt: "Carolyn" },
    { src: "/assets/img/gallery/g10.jpg", w: 1000, h: 1500, alt: "By the sea" },
    { src: "/assets/img/gallery/g11.jpg", w: 1000, h: 1500, alt: "Together on the beach" },
    { src: "/assets/img/gallery/g12.jpg", w: 1000, h: 1500, alt: "The two of them" }
  ],

  // Verified restaurant guide — source of truth + verification detail in
  // docs/data-restaurants.md (verified 2026-07-02; re-verify spring 2027).
  // NEEDS COUPLE: mark Carolyn + Merrick's own favorites → couplesPick: true.
  eat: {
    intro: "There's lobster within ten minutes of the inn in every direction, Brunswick's Maine Street is 15 minutes away, and Portland's Old Port is 45. Every place below is open, checked, and linked to its real site.",
    note: "Planning a special dinner in Portland that weekend? Fore Street and Scales open reservations exactly two months out, so call in mid-June 2027. Most Brunswick kitchens seat until about 8:30, and the Harpswell shacks close by 7 or 8, so late-night food means Brunswick.",
    areas: [
      {
        name: "Harpswell, minutes from the inn",
        blurb: "Nearly everything good out here is seasonal, on the water, and at its peak in mid-August. Come hungry, and bring cash for the shacks.",
        places: [
          { name: "Morse's at Lookout Point", where: "119 Lookout Point Rd, a one minute walk from the inn", url: "https://www.facebook.com/p/Morses-100063692317707/", note: "The Morse family's food trailer on the working wharf below the inn: lobster rolls, seafood tacos, and Kathy's blueberry pie at picnic tables over the harbor. Closed Tuesdays, wraps up around 7." },
          { name: "Dolphin Marina & Restaurant", where: "Basin Point, South Harpswell", url: "https://www.thedolphin.me/", note: "Family run since 1966 at the tip of Basin Point. Lobster stew, fish chowder, and the blueberry muffin that comes with dinner. Busy on August evenings." },
          { name: "Erica's Seafood", where: "Basin Point, next door to the Dolphin", url: "https://www.ericasseafood.com/", note: "A no-frills takeout shack on a working lobster wharf where the boats land the catch out front. Cash only, and there's an ATM on site." },
          { name: "Cook's Lobster & Ale House", where: "Bailey Island, by the Cribstone Bridge", url: "https://www.cookslobster.com/", note: "Shore dinners on Garrison Cove since 1955, right beside the famous bridge. Hours shift with the season, so check before you drive out." },
          { name: "Salt Cod Cafe", where: "Orr's Island", url: "https://saltcodcafe.com/", note: "Coffee, crab rolls, and homemade pie in an old general store overlooking the Cribstone Bridge. Daytime only, roughly 8 to 3." }
        ]
      },
      {
        name: "Brunswick, on and around Maine Street",
        blurb: "An easy pre- or post-wedding outing: a real dinner scene, diner breakfasts, and gelato for the walk back.",
        places: [
          { name: "Maine Street Bistro", where: "148 Maine St", url: "https://mainestreetbistro.com/", note: "An intimate French-style bistro with a raw bar. Book on Resy, start with oysters." },
          { name: "Enoteca Athena", where: "97 Maine St", url: "https://www.enotecaathena.com/", note: "Rustic Greek and Italian cooking, house-made pasta, and a wine list of over 100 mostly organic bottles." },
          { name: "Pomelia", where: "16 Station Ave", url: "https://pomelia.restaurant/", note: "A Sicilian spot from a local couple, opened in 2025. Arancini, square pizza, and save room for cannoli." },
          { name: "The Great Impasta", where: "11 Pleasant St", url: "https://thegreatimpasta.net/", note: "A Brunswick institution since 1984. Comfortable Italian classics, easy with a group." },
          { name: "Brunswick Diner", where: "101 Pleasant St", url: "https://www.brunswickdiner.com/", note: "Breakfast in a real 1940s dining car, tabletop jukeboxes and all, since 1946." },
          { name: "Wild Oats Bakery & Cafe", where: "Brunswick Landing, 5 min from downtown", url: "https://wildoatsbakery.com/", note: "From-scratch bakery and cafe feeding Brunswick since 1991. Bread worth taking back to the inn." },
          { name: "The Abbey", where: "87 Maine St", url: "https://www.theabbeymaine.com/", note: "Coffee by day, cocktails and small plates by night. A 2025 James Beard semifinalist, and Sunday jazz brunch is a treat." },
          { name: "Gelato Fiasco", where: "74 Maine St", url: "https://www.gelatofiasco.com/", note: "The flagship shop of Maine's own gelato makers, open until 11 every night." }
        ]
      },
      {
        name: "Portland",
        blurb: "Make a day of it. Portland's food scene is worth the trip on its own, 45 minutes down the coast.",
        places: [
          { name: "Eventide Oyster Co.", where: "Old Port", url: "https://www.eventideoysterco.com/portland", note: "The famous brown butter lobster roll and the oyster bar people plan trips around. Mostly walk-in; go at an off hour." },
          { name: "Fore Street", where: "Old Port", url: "https://www.forestreet.biz/", note: "Portland's landmark wood-fired dining room since 1996. Reservations essential; they book two months out." },
          { name: "Scales", where: "Maine Wharf", url: "https://www.scalesrestaurant.com/", note: "A big, lively seafood house on a working wharf. Books ahead, but holds a few walk-in tables from 4pm." },
          { name: "Portland Lobster Company", where: "Commercial St", url: "https://www.portlandlobstercompany.com/", note: "The classic on-the-wharf lobster shack: rolls, steamers, and live music on the deck." },
          { name: "Duckfat", where: "Middle St", url: "https://www.duckfat.com/", note: "Belgian fries cooked in duck fat, paninis, and serious milkshakes. First come, first served." },
          { name: "Becky's Diner", where: "Commercial St", url: "https://www.beckysdiner.com/", note: "A true waterfront diner feeding Portland's fishermen since 1992. Opens at 5am, blueberry pancakes mandatory." },
          { name: "The Holy Donut", where: "Old Port + Brunswick", url: "https://www.theholydonut.com/", note: "Maine potato donuts made fresh every morning; they close when they sell out. Their Brunswick shop is 15 minutes from Harpswell." },
          { name: "Standard Baking Co.", where: "Commercial St", url: "https://standardbakingco.com/", note: "The bakery Portland lines up for: baguettes, croissants, and morning buns since 1995." }
        ]
      }
    ]
  },

  // Live-music calendar for the wedding window (Aug 7-21, 2027; nothing on the 14th).
  // Venues announce 2-6 months out; real sweep planned for spring 2027 → docs/08 item 1.
  // Event shape: { day: 8, title: "...", venue: "...", city: "...", time: "8 PM", url: "https://..." }
  // NOTE: the /music/ page is UNPUBLISHED (2026-07-14, Carolyn's call). Data kept in
  // case the couple wants it back once real Aug-2027 listings land in spring 2027.
  music: {
    note: "Maine venues announce shows a few months out, so this calendar fills in starting in spring 2027. Check back when you book your trip. One thing we can promise now: nothing is scheduled for August 14. You're busy that day.",
    events: [],
    // Venue calendars verified live 2026-07-02 → docs/data-music-venues.md
    // (announcement horizons + the spring/summer 2027 sweep plan live there too).
    venues: [
      { name: "State Theatre", url: "https://statetheatreportland.com/events/", note: "Portland's classic downtown theater. National tours play most weeks, 45 minutes from Harpswell." },
      { name: "Thompson's Point", url: "https://thompsonspoint.com/events/", note: "Outdoor summer shows on the Portland waterfront, with food trucks and local beer. The most likely spot for a big August show." },
      { name: "Portland House of Music", url: "https://www.portlandhouseofmusic.com/calendar", note: "A small, lively Old Port club with bands almost every night. A fun stop after dinner." },
      { name: "Aura", url: "https://auramaine.com/aura-calendar-tickets/", note: "A downtown club with rock, country, and comedy. Shows post only a month or two ahead, so check close to your trip." },
      { name: "Merrill Auditorium", url: "https://www.porttix.com/", note: "Portland's grand concert hall and home of the Portland Symphony. Quietest in August, but worth a look." },
      { name: "Bandsintown", url: "https://www.bandsintown.com/c/portland-me", note: "A one-stop search of every show near Portland once listings post. Search your travel dates." }
    ]
  },

  registry: {
    intro: "Your presence is the gift. If you'd like to help us build our first home together, a contribution to our house fund means the world. No registry, no shipping, just thank-yous from us.",
    // Real house-fund handles are personal contact details, so they live in
    // _data/registry.local.json (gitignored — this repo is PUBLIC and git history is
    // forever). They render on the built site as intended; see registry.local.json.example.
    // If that file is missing at build time we warn loudly and fall back to "Coming soon".
    methods: registryMethods,
    note: "Sent something? Let us know below so we can thank you properly."
  },

  rsvp: {
    deadline: "a date we'll announce soon",   // becomes e.g. "June 1, 2027" — page reads "By {deadline}."
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
    { title: "South Harpswell, Maine, panoramic view", author: "Daderot",
      license: "Public domain", licenseUrl: "",
      source: "https://commons.wikimedia.org/wiki/File:South_Harpswell,_Maine_-_panoramic_view.jpg" },
    { title: "Casco Bay, Maine", author: "Dougtone",
      license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      source: "https://commons.wikimedia.org/wiki/File:Casco_Bay_092108_140.jpg" },
    { title: "Bailey Island (Cribstone) Bridge, Harpswell", author: "Daderot",
      license: "Public domain", licenseUrl: "",
      source: "https://commons.wikimedia.org/wiki/File:Bailey_Island_Bridge,_Harpswell,_ME_-_panorama.jpg" },
    { title: "Engagement photos: hero, Our Story, Gallery", author: "Carolyn & Merrick's October 2025 engagement session",
      license: "", licenseUrl: "", source: "" }
  ]
};
