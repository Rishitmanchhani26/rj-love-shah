#!/usr/bin/env python3
"""Writes the three static event pages (events/<slug>/index.html) from one template.
Run:  python3 tools/build-event-pages.py   (output is plain HTML; nothing runs on the live site)."""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://www.rjloveshah.com"
WA = "917383972757"

PAGES = [
  {
    "slug": "corporate", "nav": "Corporate",
    "title": "Corporate Event Anchor in Ahmedabad | Award Nights, Family Day & Launches | RJ Love Shah",
    "desc": "Book RJ Love Shah to host your corporate show: award nights, team building, family days and product launches across India. Hindi, English and Gujarati.",
    "crumb": "Corporate shows",
    "h1": 'Your annual night, <em class="grad-text">switched on.</em>',
    "lede": "Award nights, team building, family days and launches, hosted with a Chartered Accountant's precision and a showman's energy.",
    "hero_img": "/assets/img/events/corp-team.webp", "hero_video": "/assets/video/events/corp-team.mp4",
    "hero_alt": "RJ Love Shah running a tug-of-war challenge at a corporate team-building event",
    "stage_kicker": "The corporate line-up",
    "stage_h2": 'Pick the night. <em class="grad-text">Watch it come alive.</em>',
    "cases": [
      {"title": "Awards Night", "kicker": "Recognise", "video": "corp-awards", "yt": "ZQAv5U1U4D8", "yt_shape": "tall", "pos": "62%", "tint": "rgb(255 190 110 / .55)",
       "alt": "RJ Love Shah on stage at a company's annual meet and awards night",
       "text": "Every name pronounced right, every winner's walk timed, and a room that cheers for colleagues like they are celebrities.",
       "tags": ["Award ceremonies", "Annual meets", "R&R nights"]},
      {"title": "Team Building", "kicker": "Engage", "video": "corp-team", "yt": "iUI_PwmD6fM", "yt_shape": "tall", "pos": "70%", "tint": "rgb(120 170 255 / .55)",
       "alt": "Employees in a tug of war hosted by RJ Love Shah at a corporate event",
       "text": "Games that get the whole office off its chairs: tug of war, floor challenges and live leaderboards, all run to the clock.",
       "tags": ["Team games", "Offsites", "Engagement days"]},
      {"title": "Family Day", "kicker": "Celebrate", "video": "corp-family", "yt": "yZI6Ggl9RTM", "yt_shape": "wide", "pos": "50%", "tint": "rgb(255 120 160 / .55)",
       "alt": "RJ Love Shah hosting floor games for employees and families",
       "text": "Kids, parents and the leadership team on the same floor. Games for every age, prizes for every family, nobody left on the sidelines.",
       "tags": ["Family day", "Fun Fridays", "Festive celebrations"]},
      {"title": "Product Launch", "kicker": "Reveal", "video": "corp-launch", "yt": "qUmF9uT589A", "yt_shape": "tall", "pos": "40%", "tint": "rgb(255 107 91 / .6)",
       "alt": "Guests dancing at a brand activation hosted by RJ Love Shah",
       "text": "The reveal lands, the brand message sticks and the whole floor reaches for their phones to film it.",
       "tags": ["Launches", "Dealer meets", "Brand activations"]},
    ],
    "steps": [
      ("The brief call", "Love learns your company, the leadership names, the awards list and what the night has to achieve."),
      ("A script for your crowd", "Show flow, games and lines written for your audience, in Hindi, English or Gujarati."),
      ("Show night", "Run-of-show held to the minute. Sponsors, names and winners never missed."),
    ],
    "faq": [
      ("Does RJ Love Shah host corporate events in English?", "Yes. He hosts in English, Hindi and Gujarati, and mixes them for pan-India teams."),
      ("Can he design the games for a team-building or family day?", "Yes. He plans the engagement segments and games with your event team so they fit the venue, the time slot and the audience."),
      ("Does he travel for corporate events outside Ahmedabad?", "Yes. He is based in Ahmedabad and hosts corporate shows across India."),
    ],
  },
  {
    "slug": "weddings", "nav": "Weddings",
    "title": "Wedding Anchor in Ahmedabad | Haldi, Sangeet & Baraat Host | RJ Love Shah",
    "desc": "RJ Love Shah hosts luxury and destination weddings across India: carnival and haldi, sangeet, baraat on wheels and reception, in Hindi, English and Gujarati.",
    "crumb": "Luxury weddings",
    "h1": 'Every function, <em class="grad-text">its own show.</em>',
    "lede": "He learns the families, the inside jokes and the love story, then turns every function into the one your guests talk about.",
    "hero_img": "/assets/img/events/wed-haldi.webp", "hero_video": "/assets/video/events/wed-haldi.mp4",
    "hero_alt": "Guests dancing through clouds of colour at a haldi celebration",
    "stage_kicker": "The wedding line-up",
    "stage_h2": 'Every function. <em class="grad-text">Its own mood.</em>',
    "cases": [
      {"title": "Carnival & Haldi", "kicker": "Colour", "video": "wed-haldi", "img": "/assets/img/wed-carnival-1200.webp", "yt": "RUrSS4cqIF0", "yt_shape": "tall", "pos": "50%", "tint": "rgb(255 200 80 / .6)",
       "alt": "RJ Love Shah in a pink blazer hosting a wedding carnival game with a giant dice",
       "text": "Colour, games and a carnival on the lawns. He keeps both families playing, laughing and getting the shots the photographers need.",
       "tags": ["Haldi", "Carnival", "Mehendi", "Pool parties"]},
      {"title": "Sangeet", "kicker": "Perform", "img": "/assets/img/wmg-sangeet-1200.webp", "yt": "yBJ0mJpY1ek", "yt_shape": "tall", "pos": "50%", "tint": "rgb(255 107 140 / .6)",
       "alt": "RJ Love Shah hosting with a microphone on a red-draped sangeet stage",
       "text": "Family performances introduced like headline acts, surprise segments between them and a dance floor that fills the second the last act ends.",
       "tags": ["Sangeet", "Cocktail", "Family performances"]},
      {"title": "Baraat on Wheels", "kicker": "Arrive", "img": "/assets/img/wmg-baraat-1200.webp", "yt": "4apaIc3am6k", "yt_shape": "tall", "pos": "50%", "tint": "rgb(160 140 255 / .6)",
       "alt": "RJ Love Shah with arms open at a decorated wedding venue",
       "text": "A baraat that arrives like a show. He leads the energy from the first dhol beat to the varmala, and keeps the timing on track for the pheras.",
       "tags": ["Baraat", "Varmala", "Reception", "Destination weddings"]},
      {"title": "NRI & Destination Weddings", "kicker": "Travel", "img": "/assets/img/wed-nri-720.webp", "pos": "50%", "yt": "YVkzI0gv_Rc", "yt_shape": "tall",
       "alt": "Bride and groom in orange and red wedding outfits at an Indo-Italian wedding hosted by RJ Love Shah",
       "text": "From an Indo-Italian wedding to NRI families flying in from abroad, he blends both cultures on the mic so every guest feels part of the celebration.",
       "tags": ["Indo-Italian wedding", "NRI families", "Bilingual hosting"]},
    ],
    "steps": [
      ("Meet the families", "A call with the couple and families to learn names, stories and who will (and won't) dance."),
      ("Function by function", "A different script for haldi, sangeet and baraat, built around your planner's timeline."),
      ("On the day", "He holds the mic and the clock, so you can enjoy your own wedding."),
    ],
    "faq": [
      ("Does RJ Love Shah host destination weddings?", "Yes. He is based in Ahmedabad, travels across India for weddings and is open to destination weddings abroad."),
      ("Has RJ Love Shah hosted NRI or international weddings?", "Yes, including an Indo-Italian wedding. He hosts in English, Hindi and Gujarati so families and guests from abroad can follow every moment."),
      ("Can he host in Gujarati for family functions?", "Yes. He hosts in Gujarati, Hindi and English and switches between them for mixed families."),
      ("How early should we book him for a wedding?", "As early as possible. Wedding-season dates go first, so send your dates on WhatsApp to check availability."),
    ],
  },
  {
    "slug": "live", "nav": "Sports & Live",
    "title": "Live Event & Sports Anchor | Navratri, Concerts & Sports Hosting | RJ Love Shah",
    "desc": "RJ Love Shah hosts Navratri nights, concerts, sports events and college shows for crowds of thousands. Host of the Reliance Navratri. Book across India.",
    "crumb": "Sports & live events",
    "h1": 'Thousands of people. <em class="grad-text">One host.</em>',
    "lede": "Navratri grounds, concerts, sports properties and college fests. Big crowds, open skies, and a host who makes them move as one.",
    "hero_img": "/assets/img/events/live-crowd.webp", "hero_video": "/assets/video/events/live-crowd.mp4",
    "hero_alt": "RJ Love Shah pointing at a packed open-air Navratri crowd at night",
    "stage_kicker": "The live line-up",
    "stage_h2": 'Big grounds. <em class="grad-text">Bigger energy.</em>',
    "cases": [
      {"title": "Navratri & Garba", "kicker": "Reliance Navratri", "video": "live-navratri", "yt": "h3TcUziqsVs", "yt_shape": "tall", "pos": "30%", "tint": "rgb(255 140 60 / .6)",
       "alt": "RJ Love Shah with Bollywood stars on the Reliance Navratri stage",
       "text": "Host of the Ambani family's Reliance Navratri in Jamnagar, welcoming stars like Vicky Kaushal, Varun Dhawan and Disha Patani onto the garba stage.",
       "tags": ["Reliance Navratri", "NUVOCO Sauthi Khaas Garba", "Celebrity guests"]},
      {"title": "Sports Events", "kicker": "Play", "video": "live-sports", "img": "/assets/img/sports-kapil-1200.webp", "pos": "50%", "tint": "rgb(90 200 140 / .55)",
       "alt": "RJ Love Shah in a mustard blazer with cricket legend Kapil Dev at the Adani PGTI golf event",
       "text": "From the Adani × PGTI golf pre-tournament event with Kapil Dev to brand nights for Gujarat Titans, he speaks the language of sport and sponsors.",
       "tags": ["Golf", "Cricket leagues", "Sponsor nights"]},
      {"title": "Public & Government Events", "kicker": "Sardar Patel Jayanti", "video": "live-public", "pos": "35%", "yt": "bOjP3X-52Ls", "yt_shape": "wide",
       "alt": "RJ Love Shah speaking at the podium at the Sardar Patel Jayanti celebration",
       "text": "Hosted the Sardar Patel Jayanti celebration with chief guests Union Home Minister Amit Shah and Gujarat Chief Minister Bhupendrabhai Patel on stage.",
       "tags": ["Sardar Patel Jayanti", "Amit Shah", "CM Bhupendrabhai Patel", "Public gatherings"]},
      {"title": "College & Festivals", "kicker": "Party", "video": "live-college", "pos": "0%", "tint": "rgb(255 90 140 / .6)",
       "alt": "RJ Love Shah dancing on stage in front of a huge college Holi crowd",
       "text": "Holi bashes and college fests with thousands of students. He gets the whole ground jumping and keeps it safe and on schedule.",
       "tags": ["College shows", "Holi", "Festivals"]},
      {"title": "Concerts", "kicker": "Live music", "img": "/assets/img/wmg-concert-1200.webp", "yt": "_6wW9BsNKt0", "yt_shape": "wide", "pos": "50%", "tint": "rgb(150 120 255 / .6)",
       "alt": "RJ Love Shah with a microphone on a purple-lit concert stage",
       "text": "Opening and holding the stage for artists like Neha Kakkar and Piyush Mishra, so the crowd is warm before the first song.",
       "tags": ["Neha Kakkar Live", "Piyush Mishra Live", "Song & movie launches"]},
    ],
    "steps": [
      ("Read the ground", "Crowd size, artist line-up, sponsors and security cues, all agreed before the gates open."),
      ("Build the night", "Warm-ups, crowd games and artist intros planned to peak at the right moment."),
      ("Hold thousands", "Clear, loud and in control from the first announcement to the last song."),
    ],
    "faq": [
      ("Has RJ Love Shah hosted large Navratri events?", "Yes. He hosted the Ambani family's Reliance Navratri in Jamnagar and NUVOCO Sauthi Khaas Garba, with Bollywood guests on stage."),
      ("Does he host sports events?", "Yes, including the Adani × PGTI golf pre-tournament event with Kapil Dev, and brand events for sports properties."),
      ("Has he hosted government or public events?", "Yes. He hosted the Sardar Patel Jayanti celebration attended by Union Home Minister Amit Shah and Gujarat Chief Minister Bhupendrabhai Patel."),
      ("Can he host concerts and college fests?", "Yes. He has hosted Neha Kakkar and Piyush Mishra live in concert and large college shows."),
    ],
  },
]

ALL = [(p["slug"], p["nav"], p["crumb"]) for p in PAGES]
e = html.escape


def case_html(i, c):
    poster = c.get("img") or f"/assets/img/events/{c['video']}.webp"
    video_src = f"/assets/video/events/{c['video']}.mp4" if c.get("video") else ""
    tags = "".join(f"<span>{e(t)}</span>" for t in c["tags"])
    return f'''
        <button class="case" type="button" style="--pos:{c['pos']}"
                data-title="{e(c['title'])}" data-kicker="{e(c['kicker'])}" data-poster="{poster}" data-video="{video_src}" data-yt="{c.get('yt', '')}" data-yt-shape="{c.get('yt_shape', 'wide')}">
          <span class="case__media"><img src="{poster}" width="960" height="540" loading="lazy" decoding="async" alt="{e(c['alt'])}">{'<span class="case__play" aria-hidden="true">▶</span>' if (video_src or c.get('yt')) else ''}</span>
          <span class="case__body">
            <span class="case__kicker">{i + 1:02d} · {e(c['kicker'])}</span>
            <span class="case__title">{e(c['title'])}</span>
            <span class="case__text">{e(c['text'])}</span>
            <span class="case__tags">{tags}</span>
            <span class="case__open">{'Watch &amp; read more ↗' if (video_src or c.get('yt')) else 'Read more ↗'}</span>
          </span>
        </button>'''


def page(p):
    url = f"{SITE}/events/{p['slug']}/"
    cases = "".join(case_html(i, c) for i, c in enumerate(p["cases"]))
    steps = "".join(f'''
          <li class="step" data-reveal><span class="step__num">{i + 1:02d}</span><h3>{e(t)}</h3><p>{e(d)}</p></li>''' for i, (t, d) in enumerate(p["steps"]))
    faq = "".join(f'''
          <details data-reveal><summary>{e(q)}</summary><p>{e(a)}</p></details>''' for q, a in p["faq"])
    others = "".join(f'<a href="/events/{s}/"><span><small>Also hosts</small>{e(c)}</span><span aria-hidden="true">→</span></a>' for s, n, c in ALL if s != p["slug"])
    nav = "".join(f'<li><a href="/events/{s}/"{" aria-current=\"page\"" if s == p["slug"] else ""}>{e(n)}</a></li>' for s, n, _ in ALL)
    ld = {
      "@context": "https://schema.org",
      "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
          {"@type": "ListItem", "position": 2, "name": p["crumb"], "item": url}]},
        {"@type": "Service", "name": f"{p['crumb']} hosting by RJ Love Shah", "serviceType": p["crumb"],
         "provider": {"@type": "Person", "@id": SITE + "/#person", "name": "RJ Love Shah"},
         "areaServed": "India", "url": url, "description": p["desc"],
         "hasOfferCatalog": {"@type": "OfferCatalog", "name": p["crumb"], "itemListElement": [
           {"@type": "Offer", "itemOffered": {"@type": "Service", "name": c["title"], "description": c["text"]}} for c in p["cases"]]}},
        {"@type": "FAQPage", "mainEntity": [
          {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]},
      ]}
    wa_text = f"Hi Love, I'd like to book you for a {p['crumb'].lower()} event."
    return f'''<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{e(p['title'])}</title>
  <meta name="description" content="{e(p['desc'])}">
  <link rel="canonical" href="{url}">
  <meta name="theme-color" content="#070C18">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="RJ Love Shah">
  <meta property="og:locale" content="en_IN">
  <meta property="og:title" content="{e(p['crumb'])} | RJ Love Shah">
  <meta property="og:description" content="{e(p['desc'])}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}{p['hero_img']}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="/assets/fonts/playfair-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/playfair-italic-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" as="image" href="{p['hero_img']}" fetchpriority="high">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/events.css">
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="ep">
  <!-- Generated by tools/build-event-pages.py – edit the data there, then re-run. -->
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="site-header" data-header>
    <div class="site-header__inner">
      <a class="logo" href="/" aria-label="RJ Love Shah, home"><span class="logo__kicker">Anchor · Host</span><span class="logo__name">RJ Love Shah</span></a>
      <nav class="nav" aria-label="Main"><ul>
        <li><a href="/">Home</a></li>{nav}
        <li><a href="/#celebrities">Celebrities</a></li><li><a href="/#about">About</a></li><li><a href="/#contact">Contact</a></li>
      </ul></nav>
      <a class="btn btn--grad btn--sm header-cta" href="https://wa.me/{WA}?text={e(wa_text)}" rel="noopener">Book Love</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-btn>
        <span class="menu-btn__bars" aria-hidden="true"></span><span class="visually-hidden">Menu</span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" hidden data-menu>
      <ul><li><a href="/">Home</a></li>{nav}<li><a href="/#celebrities">Celebrities</a></li><li><a href="/#about">About</a></li><li><a href="/#contact">Contact</a></li></ul>
      <a class="btn btn--grad" href="https://wa.me/{WA}?text={e(wa_text)}" rel="noopener">Book Love</a>
    </div>
  </header>

  <main id="main">
    <!-- 1 · Opening -->
    <section class="ep-hero" aria-labelledby="ep-title">
      <div class="ep-hero__sticky">
        <div class="ep-hero__frame">
          <img src="{p['hero_img']}" width="960" height="540" fetchpriority="high" decoding="async" alt="{e(p['hero_alt'])}">
          <video muted loop playsinline preload="none" aria-hidden="true" data-hero-video data-src="{p['hero_video']}"></video>
        </div>
        <div class="ep-hero__dim" aria-hidden="true"></div>
        <div class="ep-hero__copy">
          <p class="ep-hero__crumb" data-ep-intro><a href="/">RJ Love Shah</a> · {e(p['crumb'])}</p>
          <h1 class="ep-hero__title" id="ep-title" data-ep-intro><span class="visually-hidden">{e(p['crumb'])} by RJ Love Shah: </span>{p['h1']}</h1>
          <p class="ep-hero__lede" data-ep-intro>{e(p['lede'])}</p>
        </div>
        <p class="ep-hero__cue" aria-hidden="true">Scroll to open</p>
      </div>
    </section>

    <!-- 2 · Event cards -->
    <section class="stage" aria-labelledby="stage-title">
      <header class="stage__head container">
        <p class="eyebrow">{e(p['stage_kicker'])}</p>
        <h2 class="h2" id="stage-title">{p['stage_h2']}</h2>
        <p class="stage__hint">Open any event to watch it and see what is included.</p>
      </header>
      <div class="cases{' cases--3' if len(p['cases']) in (3, 5) else ''}" data-cases>{cases}
      </div>
    </section>

    <!-- How it works -->
    <section class="steps section" aria-labelledby="steps-title">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow" data-reveal>How Love runs it</p>
          <h2 class="h2" id="steps-title" data-reveal>From first call <em class="grad-text">to final bow.</em></h2>
        </header>
        <ol class="steps__grid">{steps}
        </ol>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq section" aria-labelledby="faq-title">
      <div class="container faq__grid">
        <header><p class="eyebrow" data-reveal>Good to know</p><h2 class="h2" id="faq-title" data-reveal>Questions, <em class="grad-text">answered.</em></h2></header>
        <div class="faq__list">{faq}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ep-cta" aria-labelledby="cta-title">
      <div class="container">
        <p class="eyebrow" data-reveal>Book Love</p>
        <h2 class="h2" id="cta-title" data-reveal>Ready to switch <em class="grad-text">your night on?</em></h2>
        <p data-reveal>Send the date, city and crowd size. Advance booking recommended.</p>
        <div class="ep-cta__actions" data-reveal>
          <a class="btn btn--grad" href="https://wa.me/{WA}?text={e(wa_text)}" rel="noopener">WhatsApp Love <span aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" href="/#contact">Booking form</a>
          <a class="btn btn--ghost" href="tel:+917383972757">+91 73839 72757</a>
        </div>
        <nav class="other-events" aria-label="Other event types" data-reveal>{others}</nav>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__grid" style="margin-top:0;border-top:0;padding-top:0">
        <div class="footer__brand">
          <p class="logo"><span class="logo__kicker">Anchor · Host</span><span class="logo__name">RJ Love Shah</span></p>
          <p>Celebrity anchor for weddings, corporate shows and live events. Based in Ahmedabad, hosting across India.</p>
          <address><a href="tel:+917383972757">+91 73839 72757</a><br><a href="mailto:rjloveshah12@gmail.com">rjloveshah12@gmail.com</a><br>Ahmedabad, Gujarat, India</address>
        </div>
        <nav aria-label="Footer: events"><ul>{nav}</ul></nav>
        <nav aria-label="Footer: site"><ul><li><a href="/">Home</a></li><li><a href="/#about">About</a></li><li><a href="/#faq">FAQ</a></li><li><a href="/#contact">Contact</a></li></ul></nav>
        <nav aria-label="Footer: social"><ul>
          <li><a href="https://www.instagram.com/rjlove_shah" rel="noopener">Instagram</a></li>
          <li><a href="https://www.facebook.com/share/1CkYNs7Qu3/" rel="noopener">Facebook</a></li>
          <li><a href="https://youtube.com/@loveshah117" rel="noopener">YouTube</a></li>
          <li><a href="https://www.linkedin.com/in/rj-love-anchor-host-9b65aa155" rel="noopener">LinkedIn</a></li>
        </ul></nav>
      </div>
      <p class="footer__legal">© 2026 RJ Love Shah. All rights reserved.</p>
    </div>
  </footer>

  <div class="action-bar" role="region" aria-label="Quick booking">
    <a class="btn btn--grad" href="/#contact">Book Love</a>
    <a class="btn btn--ghost glass" href="https://wa.me/{WA}?text={e(wa_text)}" rel="noopener">WhatsApp</a>
  </div>

  <!-- 3 · Opener -->
  <div class="opener" role="dialog" aria-modal="true" aria-labelledby="op-title" aria-hidden="true" data-opener>
    <div class="opener__media">
      <img src="{p['hero_img']}" alt="" data-op-img>
      <video muted loop playsinline preload="none" aria-hidden="true" data-op-video></video>
    </div>
    <p class="opener__soon" data-op-soon hidden>Video coming soon</p>
    <div class="opener__yt" data-op-yt hidden>
      <div class="opener__yt-frame" data-op-yt-frame></div>
      <button class="opener__yt-close" type="button" data-op-yt-close aria-label="Close video">×</button>
    </div>
    <button class="opener__close" type="button" aria-label="Close" data-op-close>×</button>
    <div class="opener__body">
      <div class="opener__inner">
        <p class="opener__kicker" data-op-anim data-op-kicker></p>
        <h2 class="opener__title" id="op-title" data-op-anim data-op-title></h2>
        <p class="opener__text" data-op-anim data-op-text></p>
        <ul class="tags" data-op-anim data-op-tags></ul>
        <div class="opener__actions" data-op-anim>
          <button class="btn btn--ghost" type="button" data-op-watch hidden><span class="play-dot" aria-hidden="true"></span> Watch the full clip</button>
          <a class="btn btn--grad" href="#" rel="noopener" data-op-book><span>Book Love</span></a>
        </div>
      </div>
    </div>
    <div class="opener__nav">
      <button class="round-btn" type="button" aria-label="Previous" data-op-prev>←</button>
      <span class="opener__count" data-op-count></span>
      <button class="round-btn" type="button" aria-label="Next" data-op-next>→</button>
    </div>
  </div>

  <script>document.documentElement.classList.add('js')</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
  <script src="/assets/js/events.js" defer></script>
</body>
</html>
'''


for p in PAGES:
    out = ROOT / "events" / p["slug"] / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(p), encoding="utf-8")
    print("wrote", out.relative_to(ROOT))

# keep every link relative so the site works on any host (GitHub Pages, Netlify, final domain)
import runpy
runpy.run_path(str(ROOT / "tools" / "make-relative.py"))
