# CLAUDE CODE BUILD PROMPT — FACILITY VISION QUESTIONNAIRE

## PROJECT OVERVIEW

Build a **mobile-first, single-page React web application** — a premium interactive questionnaire for a 60,000 SF high-performance sports training + longevity clinic concept in Phoenix, AZ. This gets sent to a group of investors/operators who hate reading. Every interaction must be tap-friendly, visually striking, and dead simple. They should feel like they're configuring a spaceship, not filling out a Google Form.

**Hosted on Vercel. Use Next.js (App Router) + Tailwind CSS.**

---

## TECH STACK (MANDATORY)

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + custom CSS variables for the theme
- **State/Storage:** localStorage for progress saving + React state
- **Email:** Use Resend (resend.com) via a Next.js API route at `/api/send` for the submission email. Use the Resend npm package. The API key will be set as an environment variable `RESEND_API_KEY`. For now, scaffold the API route so it's ready to plug in the key.
- **Deployment:** Vercel (include vercel.json if needed)
- **Fonts:** Load from Google Fonts via `next/font/google`
- **No database.** localStorage is the persistence layer. Responses are emailed on submit.
- **No authentication.** Name + email is collected on the welcome screen.

---

## DESIGN SYSTEM — "BIOHACKER LAB" AESTHETIC

This is NOT a generic form. This should feel like the UI of a next-gen longevity clinic crossed with a sports science lab. Think: dark mode, glowing accents, subtle data visualization vibes, like Whoop's app meets a Tony Stark interface.

### Color Palette (CSS Variables)
```
--bg-primary: #0A0A0F (near-black with blue undertone)
--bg-secondary: #12121A (card backgrounds)
--bg-tertiary: #1A1A2E (elevated surfaces, hover states)
--accent-cyan: #00F0FF (primary accent — "electric bio" cyan)
--accent-green: #39FF14 (success states, progress, "vital signs" green)
--accent-magenta: #FF006E (alerts, important highlights)
--text-primary: #E8E8F0 (off-white, easy on eyes)
--text-secondary: #8888AA (muted labels, descriptions)
--text-tertiary: #555577 (disabled, placeholder)
--border: #2A2A3E (subtle borders)
--glow-cyan: 0 0 20px rgba(0, 240, 255, 0.3) (box-shadow glow effect)
--glow-green: 0 0 20px rgba(57, 255, 20, 0.2)
```

### Typography
- **Headings:** "Orbitron" (Google Fonts) — techy, geometric, biohacker feel
- **Body / Questions:** "Outfit" (Google Fonts) — clean, modern, highly readable on mobile
- **Monospace accents (section labels, progress):** "JetBrains Mono" (Google Fonts)

### Visual Effects
- Subtle CSS noise/grain texture overlay on the background (very low opacity, like 3-5%)
- Cards have a faint 1px border with `--border` color and a subtle inner glow on hover
- Selected options get a glowing cyan border + slight scale animation
- Progress bar uses a gradient from cyan → green with a subtle pulse animation
- Section transitions: smooth fade + slight upward slide (200-300ms)
- Micro-interactions: checkboxes/radios have a satisfying snap animation on select
- Thin horizontal line accents using cyan gradient (fades from solid to transparent)

### Layout Principles
- **Mobile-first:** Design for 375px width as the base. Scale up for tablet/desktop.
- **One question per view on mobile.** Swipeable or tap-to-advance. Show the question, the options, and a "Next" button. That's it.
- On desktop (768px+), show 2-3 questions per view in a comfortable single-column layout.
- Large tap targets: option buttons should be minimum 48px tall with generous padding.
- No horizontal scrolling ever.

---

## APP STRUCTURE & FLOW

### Screen 1: Welcome / Intake
- Large logo area (placeholder — just styled text: "PRIME FACILITY VISION" in Orbitron)
- Tagline: "60,000 SF | Phoenix, AZ | Sports Performance + Longevity"
- Brief 2-sentence intro: "Help us design a world-class facility. Tap through the questions below — your answers shape every square foot. Takes about 20-25 minutes."
- **Name field** (required)
- **Email field** (required, validated)
- **Role / Title field** (optional — e.g. "Investor", "Partner", "Operations Lead")
- "BEGIN →" button (big, glowing cyan, full-width on mobile)
- If returning user detected in localStorage, show: "Welcome back, [Name]. Pick up where you left off?" with a "CONTINUE" button.

### Screen 2-18: Question Sections (one section per screen)
- Each section has a header with the section icon + title + section number (e.g. "01 / VISION & IDENTITY")
- Progress bar at the top (sticky) showing overall completion across all 17 sections
- Questions within the section scroll vertically on mobile
- "NEXT SECTION →" button at bottom of each section
- "← BACK" link (subtle, top-left) to go to previous section
- **Auto-save to localStorage on every answer change.** No manual save button.
- Section completion indicator (small checkmark icon) appears in progress bar for completed sections

### Screen 19: Review & Submit
- Summary view of all answers organized by section (collapsible accordion)
- User can tap any section to expand and edit answers inline
- Unanswered questions are highlighted with a subtle magenta accent
- Display: "You've answered X of 75 questions"
- Allow submission even if not all questions are answered (show a "Some questions are unanswered — submit anyway?" confirmation)
- **"SUBMIT" button** — big, glowing green, full-width
- On submit: send email via API route, clear localStorage, show confirmation screen

### Screen 20: Confirmation
- Animated checkmark (CSS animation, no library needed)
- "Your vision has been submitted."
- "A copy has been sent to [their email]."
- "We'll be in touch within 48 hours."
- Option to "Start Over" (clears everything)

---

## QUESTION TYPES (Components to Build)

### 1. SingleSelect
- Radio-button style but styled as tappable cards
- Each option is a full-width card with the option text
- Selected state: cyan border glow + filled indicator dot + slight background shift to `--bg-tertiary`
- Only one can be selected
- Some questions have an "Other" option that reveals a text input when selected

### 2. MultiSelect
- Checkbox style but styled as tappable cards (same as above, but allows multiple)
- Selected state: same glow treatment, but with a checkmark indicator instead of dot
- Counter badge showing "X selected" in bottom-right of the question area
- Some questions have an "Other" text field that reveals a text input when selected

### 3. TextInput
- Clean dark input field with subtle border
- Placeholder text in `--text-tertiary` color
- On focus: cyan border glow
- Auto-expanding textarea for longer responses
- Character count shown subtly for free-text fields

### 4. RankInput (for "rank your top 3" questions)
- Numbered slots (1, 2, 3) shown as drop zones
- User taps options to fill slots in order
- Tap a filled slot to remove it
- Slots glow green when filled

### 5. PercentageAllocator (for the space planning question Q34)
- List of zone names with a slider or +/- stepper for each
- Running total shown at bottom (must equal 100%)
- Total glows green when it hits 100%, magenta when over
- Visual bar chart updates in real-time as they adjust

---

## ALL 75 QUESTIONS — FULL DATA

Structure each question as a JSON object. Here is the complete question data to use:

```json
{
  "sections": [
    {
      "id": "vision",
      "number": 1,
      "title": "Vision & Identity",
      "icon": "🎯",
      "description": "Define what this facility IS at its core.",
      "questions": [
        {
          "id": "v1",
          "text": "What is the primary identity of this facility?",
          "type": "single",
          "options": [
            "Sports Performance Center with Longevity Services added on",
            "Longevity & Wellness Clinic with Sports Training added on",
            "Equal 50/50 Hybrid — Both are the brand",
            "Luxury Athletic Country Club with Medical Integration"
          ],
          "hasOther": true
        },
        {
          "id": "v2",
          "text": "Who is the aspirational brand comparison?",
          "type": "multi",
          "options": [
            "EXOS / IMG Academy — Elite Athlete Factory",
            "Equinox / Life Time Fitness — Premium Fitness + Wellness",
            "P3 Sports Science — Cutting-Edge Biomechanics Lab",
            "Mayo Clinic / Cleveland Clinic — Clinical Authority",
            "Bulletproof Labs / Next Health — Biohacker Paradise",
            "Canyon Ranch / SHA Wellness — Luxury Destination Wellness",
            "Aspetar (Qatar) / Tottenham Hotspur Centre — World-Class Sports Medicine"
          ],
          "hasOther": true
        },
        {
          "id": "v3",
          "text": "What is the ONE thing you want people to say after their first visit?",
          "type": "text",
          "placeholder": "e.g. 'I've never seen anything like this in Arizona...'"
        },
        {
          "id": "v4",
          "text": "Facility name direction?",
          "type": "single",
          "options": [
            "Keep 'Prime Reaction' branding across everything",
            "New brand — separate identity from current operations",
            "Sub-brand (e.g. 'Prime Reaction APEX' / 'Prime Longevity')",
            "Open to ideas — decide after concept is locked"
          ],
          "hasOther": true
        },
        {
          "id": "v5",
          "text": "What's the long-term play?",
          "type": "multi",
          "options": [
            "Single flagship — dominate the Phoenix metro",
            "Multi-site rollout across the Southwest (AZ, NV, TX, CO)",
            "Franchise / license the model nationally",
            "Attract acquisition by PE firm or health system",
            "Build a proprietary tech/data platform to license",
            "Create an athlete development pipeline (youth → college → pro)",
            "Become a medical tourism destination"
          ],
          "hasOther": true
        },
        {
          "id": "v6",
          "text": "Relationship to existing Prime Reaction 10k SF facility?",
          "type": "single",
          "options": [
            "This replaces it — consolidate everything into the new build",
            "Keep both — the 10k stays as a satellite / feeder",
            "Phase out the 10k once the 60k is operational",
            "Different brands entirely — no connection"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "demographics",
      "number": 2,
      "title": "Target Market & Demographics",
      "icon": "👥",
      "description": "Who walks through the front door?",
      "questions": [
        {
          "id": "d1",
          "text": "Primary target audiences? (pick your top 4)",
          "type": "multi",
          "maxSelections": 4,
          "options": [
            "Youth Athletes (8-18) — travel ball, club sports families",
            "High School Athletes — college recruiting pipeline",
            "College Athletes — offseason / transfer portal training",
            "Professional / Semi-Pro Athletes — rehab, offseason, maintenance",
            "Weekend Warriors (25-45) — competitive recreational athletes",
            "Executive Athletes (35-55) — high-income performance + longevity seekers",
            "Active Aging / Longevity (50-75) — healthspan optimization",
            "Post-Surgery / Rehab Patients — return to performance",
            "First Responders / Military — tactical athlete performance",
            "Corporate Wellness Groups — company-sponsored programs"
          ],
          "hasOther": true
        },
        {
          "id": "d2",
          "text": "Core household income of your ideal member?",
          "type": "single",
          "options": [
            "$75K-$125K — value-conscious families, need payment plans",
            "$125K-$250K — will invest for results, but price-aware",
            "$250K+ — price is not a factor, want the best",
            "Mixed — tiered pricing to serve multiple income bands"
          ]
        },
        {
          "id": "d3",
          "text": "Geographic draw — how far will people drive?",
          "type": "single",
          "options": [
            "5-10 miles — hyper-local neighborhood hub",
            "15-25 miles — Phoenix metro regional destination",
            "50+ miles — statewide, people make a trip for this",
            "National / international — athletes travel to Phoenix for this",
            "Mix — daily locals + periodic destination visitors"
          ]
        },
        {
          "id": "d4",
          "text": "Expected member / client volume at steady state?",
          "type": "single",
          "options": [
            "500-1,000 members (boutique, high-touch)",
            "1,000-2,500 members (mid-scale, balanced)",
            "2,500-5,000 members (high-volume, tiered access)",
            "Not sure — let the model dictate capacity"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "sports_zones",
      "number": 3,
      "title": "Sports Training Zones",
      "icon": "🏟️",
      "description": "The engine room. What's on the floor?",
      "questions": [
        {
          "id": "s1",
          "text": "Which sport-specific training zones do you want?",
          "type": "multi",
          "options": [
            "Indoor Batting Cages — retractable, 70'×15'×12' (HitTrax equipped)",
            "Pitching Tunnels with Rapsodo / TrackMan",
            "Multi-Court Hall — volleyball, basketball, pickleball convertible",
            "Indoor Turf Field — 50+ yard, multi-sport",
            "Sprint Track / Speed Lane (40-60m with timing gates)",
            "Olympic Lifting Platform Zone (6-12 platforms)",
            "Combat Sports Area (MMA cage, boxing ring, mat space)",
            "Golf Performance Bay (TrackMan, Foresight, Full Swing sim)",
            "Aquatics / Endless Pool / HydroWorx",
            "Rock Climbing / Bouldering Wall",
            "Dedicated Yoga / Mind-Body Studio",
            "Dedicated Group Fitness Studio (spin, HIIT, etc.)",
            "E-Sports / Cognitive Performance Lab"
          ],
          "hasOther": true
        },
        {
          "id": "s2",
          "text": "What sports are your PRIMARY revenue drivers?",
          "type": "rank",
          "rankSlots": 3,
          "options": [
            "Baseball / Softball",
            "Volleyball",
            "Basketball",
            "Soccer / Football",
            "Golf",
            "Combat Sports (MMA, Boxing)",
            "Swimming / Aquatics",
            "Track & Field / Speed Training",
            "Tennis / Pickleball",
            "CrossFit / Functional Fitness",
            "Sport-Agnostic S&C (all sports)"
          ]
        },
        {
          "id": "s3",
          "text": "Strength & Conditioning equipment philosophy?",
          "type": "multi",
          "options": [
            "Traditional Power Racks / Platforms (Sorinex, Eleiko, Rogue)",
            "Full Reaxing Suite (Reax Run, Reax Board, Reax Lights, FluiBalls, FluiKettlebells)",
            "Keiser Pneumatic / Air-Resistance Systems",
            "Velocity-Based Training Hardware (PUSH, GymAware, Perch)",
            "1080 Sprint / 1080 Quantum (motorized resistance)",
            "Vertimax / Proteus Motion (3D resistance)",
            "Exerfly / Flywheel Eccentric Training",
            "Torque Fitness / Functional Training Rigs",
            "Assault / Rogue Cardio Fleet (bikes, rowers, ski ergs)",
            "Sled Track / Prowler Lane (dedicated 40+ yard push/pull lane)",
            "Overspeed / Underspeed Treadmills (Woodway)"
          ],
          "hasOther": true
        },
        {
          "id": "s4",
          "text": "Performance testing & biomechanics lab?",
          "type": "multi",
          "options": [
            "Force Plates (VALD ForceDecks, Hawkin Dynamics, Bertec)",
            "3D Optical Motion Capture (Vicon, OptiTrack)",
            "Markerless Motion Capture (Dari Motion, Simi Reality)",
            "Isokinetic Testing (Biodex, Humac Norm)",
            "VO2 Max / Metabolic Cart (PNOE, Cosmed, Parvo)",
            "DEXA Body Composition Scanner",
            "Blood Lactate / Metabolic Profiling Station",
            "NordBord / VALD Hamstring Testing",
            "Optojump / Timing Gates / Speed Traps",
            "Rapsodo / TrackMan (ball flight / spin analytics)",
            "Proteus Motion (3D strength mapping)",
            "High-Speed Video Analysis (1000+ fps cameras)"
          ],
          "hasOther": true
        },
        {
          "id": "s5",
          "text": "Tournament & event hosting capability?",
          "type": "single",
          "options": [
            "Full tournament setup (4-8 courts, 400-800 spectator capacity)",
            "Moderate event space (2-4 courts, 200-400 spectators)",
            "Minimal — focus on daily training, not events",
            "Multi-use event space (convertible for corporate events, galas, expos too)"
          ],
          "hasOther": true
        },
        {
          "id": "s6",
          "text": "How important is Reaxing technology to the identity of this facility?",
          "type": "single",
          "options": [
            "Centerpiece — it IS the differentiator, front and center",
            "Important tool — featured but not the whole story",
            "One of many technologies — no special emphasis",
            "Not sure yet — open to seeing how it fits"
          ]
        }
      ]
    },
    {
      "id": "longevity",
      "number": 4,
      "title": "Longevity & Regenerative Medicine",
      "icon": "🧬",
      "description": "The clinic side. What science goes in the building?",
      "questions": [
        {
          "id": "l1",
          "text": "What regenerative / longevity treatments do you want to offer?",
          "type": "multi",
          "options": [
            "IV Therapy & Nutrient Infusions (NAD+, Glutathione, Myers' Cocktail, Vitamin C)",
            "Hyperbaric Oxygen Therapy (HBOT) — hard-shell chambers",
            "Whole-Body Cryotherapy (-110°C to -140°C chambers)",
            "Local Cryo / Spot Treatment",
            "Red Light / Photobiomodulation (NovoTHOR full-body beds, TheraLight)",
            "Infrared Sauna Suite (Clearlight, Sunlighten)",
            "Cold Plunge / Ice Bath Pools",
            "Contrast Therapy (hot/cold alternating pools)",
            "PEMF Therapy — Pulsed Electromagnetic Field (BEMER)",
            "Ozone Therapy (IV, insufflation, or sauna)",
            "PRP Injections (Platelet-Rich Plasma)",
            "Stem Cell / Regenerative Injections",
            "Hormone Optimization (TRT / HRT / Thyroid)",
            "Peptide Therapy Programs",
            "Exosome Therapy",
            "Chelation Therapy",
            "Extracorporeal Shockwave Therapy (ESWT)",
            "Class IV Laser Therapy (LightForce, Summus)",
            "NormaTec / Pneumatic Compression Recovery",
            "Dry Needling / Acupuncture"
          ],
          "hasOther": true
        },
        {
          "id": "l2",
          "text": "Diagnostic & testing capabilities?",
          "type": "multi",
          "options": [
            "In-House Blood Draw Lab (full biomarker panels on-site)",
            "Epigenetic / Biological Age Testing (TruAge, TruDiagnostic)",
            "Genetic Testing (whole genome, pharmacogenomics)",
            "Gut Microbiome Analysis",
            "Food Sensitivity / Allergy Panels",
            "Heavy Metal / Environmental Toxin Screening",
            "Cardiac Stress Testing (treadmill / Bruce Protocol)",
            "Coronary Calcium Score Referral Pathway (CT partner)",
            "Continuous Glucose Monitoring Programs (CGM — Levels, Dexcom)",
            "Sleep Study / Polysomnography (in-house or partner)",
            "Neurocognitive Baseline Testing (ImPACT, C3 Logix)",
            "DEXA Scan (body comp + bone density)",
            "Autonomic Nervous System Testing (HRV, tilt table)",
            "Telomere Length Testing",
            "Advanced Lipid Panels (NMR LipoProfile, Apo-B)",
            "Hormone Panels (full thyroid, sex hormones, cortisol rhythm)",
            "Inflammatory Marker Panels (hs-CRP, cytokine profiles)"
          ],
          "hasOther": true
        },
        {
          "id": "l3",
          "text": "Mental performance & brain health?",
          "type": "multi",
          "options": [
            "Sports Psychology / Mental Performance Coaching",
            "Neurofeedback / EEG Brain Mapping",
            "Transcranial Direct Current Stimulation (tDCS)",
            "Vagus Nerve Stimulation (gammaCore, Neuvana Xen)",
            "Biofeedback Training (HRV, EMG, GSR)",
            "Float Tanks / Sensory Deprivation Pods",
            "Meditation & Breathwork Studio (Wim Hof, Box Breathing)",
            "Vibroacoustic Therapy (sound frequency healing beds)",
            "VR Cognitive Training (reaction, decision-making, focus)",
            "Ketamine-Assisted Therapy (licensed clinic partner)"
          ],
          "hasOther": true
        },
        {
          "id": "l4",
          "text": "Level of medical oversight for the longevity clinic?",
          "type": "single",
          "options": [
            "Full MD/DO on-site daily — can prescribe, inject, supervise",
            "MD on-site part-time — NP/PA handles daily operations",
            "Telemedicine MD — protocols set remotely, staff executes",
            "No physician — keep it non-medical wellness only (no Rx)",
            "Not sure — need guidance on licensing / regulatory"
          ],
          "hasOther": true
        },
        {
          "id": "l5",
          "text": "Insurance & payment model for longevity services?",
          "type": "single",
          "options": [
            "100% cash-pay / concierge — no insurance accepted",
            "Primarily cash-pay, but file for reimbursable services (PT, some diagnostics)",
            "Hybrid — insurance for PT/rehab, cash-pay for elective longevity",
            "Maximize insurance — Medicare Advantage, commercial plans, workers comp",
            "Not sure yet"
          ],
          "hasOther": true
        },
        {
          "id": "l6",
          "text": "Approach to regulatory compliance for regenerative/longevity treatments (e.g., stem cells, exosomes, PRP)?",
          "type": "single",
          "options": [
            "Strict FDA/HCT/P compliance — minimal manipulation only, physician-supervised",
            "Partner with licensed MDs/IRB for protocols",
            "Avoid higher-risk treatments (e.g., no allogeneic stem cells)",
            "Consult legal/regulatory experts early",
            "Not sure — need guidance on AZ/federal rules"
          ],
          "hasOther": true
        },
        {
          "id": "l7",
          "text": "Risk tolerance for offering potentially investigational regenerative therapies?",
          "type": "single",
          "options": [
            "High — push boundaries for innovation (with strong medical oversight)",
            "Moderate — stick to established cash-pay treatments with proven track records",
            "Low — focus on non-regulated wellness/recovery only"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "pt_sports_med",
      "number": 5,
      "title": "Physical Therapy & Sports Medicine",
      "icon": "🩺",
      "description": "The rehab-to-performance bridge.",
      "questions": [
        {
          "id": "p1",
          "text": "On-site physical therapy model?",
          "type": "single",
          "options": [
            "Partner with existing brand (e.g. Spooner PT — existing relationship)",
            "Own the PT clinic in-house (hire our own PTs)",
            "Lease space to an independent PT group",
            "No PT clinic — refer out"
          ],
          "hasOther": true
        },
        {
          "id": "p2",
          "text": "What rehab / sports medicine services beyond standard PT?",
          "type": "multi",
          "options": [
            "Return-to-Sport Programming (sport-specific rehab → clearance)",
            "Pre-Hab Programs (injury prevention screens + corrective exercise)",
            "Concussion Management Clinic (baseline testing → return-to-play)",
            "Anti-Gravity Treadmill (AlterG)",
            "Blood Flow Restriction (BFR) Training",
            "Aquatic Therapy / Underwater Treadmill",
            "Orthopedic Surgeon On-Site (part-time consulting hours)",
            "Chiropractic Services",
            "Massage Therapy (sports, deep tissue, manual lymphatic drainage)",
            "Athletic Training Room (taping, acute injury management)",
            "Imaging On-Site (X-ray, ultrasound)"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "recovery",
      "number": 6,
      "title": "Recovery & Wellness Amenities",
      "icon": "♨️",
      "description": "Where the body rebuilds.",
      "questions": [
        {
          "id": "r1",
          "text": "Recovery zone — what is the vibe?",
          "type": "single",
          "options": [
            "Clinical & clean — feels like a high-end medical center",
            "Spa-like & luxurious — Canyon Ranch meets sports science",
            "Industrial-cool — exposed concrete, moody lighting, ice baths",
            "Biohacker lab — tech-forward, screens everywhere, data-driven",
            "Mix — spa feel in recovery, tech feel in testing"
          ],
          "hasOther": true
        },
        {
          "id": "r2",
          "text": "Hydrotherapy & water features?",
          "type": "multi",
          "options": [
            "Hot Plunge Pool (102-104°F)",
            "Cold Plunge Pool (38-42°F)",
            "Contrast Therapy Circuit (hot → cold → hot)",
            "Infrared Sauna Room (4-8 person)",
            "Traditional Steam Room",
            "Endless Pool / Swim Current Pool",
            "HydroWorx Underwater Treadmill Pool",
            "Full Hydrotherapy Suite (all of the above in one zone)",
            "None — keep it a dry facility only"
          ],
          "hasOther": true
        },
        {
          "id": "r3",
          "text": "Locker rooms / changing facilities — what level?",
          "type": "single",
          "options": [
            "Basic — clean, functional, lockers and showers",
            "Upscale — amenities, grooming stations, towel service",
            "Luxury — sauna, steam, premium products, shoe shine, barber",
            "Separate tiers — basic for youth, premium for adult members"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "nutrition",
      "number": 7,
      "title": "Nutrition & Fuel",
      "icon": "🥤",
      "description": "What goes into the body matters.",
      "questions": [
        {
          "id": "n1",
          "text": "On-site nutrition services?",
          "type": "multi",
          "options": [
            "Registered Dietitian / Sports Nutritionist on staff",
            "Smoothie Bar / Juice Bar (post-workout fuel)",
            "Full Café / Kitchen (meals, bowls, grab-and-go)",
            "IV Hydration Bar (integrated with longevity clinic)",
            "Supplement Dispensary (curated, physician-guided)",
            "Meal Prep Service / Partnerships (Trifecta, local chef)",
            "Body Composition-Linked Nutrition Programming (DEXA → meal plan)",
            "Gut Health Testing → Custom Nutrition Protocols",
            "Hydration Testing (urine specific gravity, sweat testing)",
            "Vending / Grab-and-Go Only (minimal footprint)",
            "None — no food or beverage on-site"
          ],
          "hasOther": true
        },
        {
          "id": "n2",
          "text": "Is the nutrition space revenue-generating or an amenity?",
          "type": "single",
          "options": [
            "Major revenue center — branded concept, open to public",
            "Member amenity — included or discounted for members",
            "Breakeven operation — convenience, not profit",
            "Leased to a third-party operator"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "technology",
      "number": 8,
      "title": "Technology & Data",
      "icon": "📡",
      "description": "The digital nervous system of the facility.",
      "questions": [
        {
          "id": "t1",
          "text": "Athlete / client data platform vision?",
          "type": "multi",
          "options": [
            "Unified member dashboard — all training, recovery, medical data in one place",
            "Cloud athlete profiles (parents/agents can view progress remotely)",
            "Wearable integration (Whoop, Garmin, Apple Watch, Oura Ring)",
            "AI-driven programming (auto-adjust training based on data)",
            "Custom mobile app (booking, data, content, community)",
            "Athlete marketplace / recruiting profile integration",
            "HIPAA-compliant medical records (integrated with clinic EMR)",
            "Keep it simple — scheduling and payments, that's it"
          ],
          "hasOther": true
        },
        {
          "id": "t2",
          "text": "Facility management platform preference?",
          "type": "single",
          "options": [
            "Upper Hand (currently considering for HPSC)",
            "Mindbody / ClassPass integration",
            "Pike13 / Zen Planner",
            "Custom-built platform",
            "No preference — need recommendation"
          ],
          "hasOther": true
        },
        {
          "id": "t3",
          "text": "Content & media capabilities?",
          "type": "multi",
          "options": [
            "In-house video production studio (athlete content, social media)",
            "Podcast / recording studio",
            "Photography room (headshots, recruit profiles)",
            "Live streaming infrastructure (training sessions, events)",
            "Digital signage throughout facility (Daktronics, BrightSign)",
            "Athlete highlight reel production services",
            "Social media content wall / 'Instagram moment' installations",
            "LED video wall (lobby, training areas)",
            "None — not a priority"
          ],
          "hasOther": true
        },
        {
          "id": "t4",
          "text": "Facility-wide tech infrastructure?",
          "type": "multi",
          "options": [
            "Gigabit fiber internet (redundant connections)",
            "Facility-wide WiFi 6E mesh",
            "Security camera system (Verkada, Rhombus)",
            "Access control / keycard / biometric entry",
            "Climate zone control (different temps for different zones)",
            "Air quality / filtration system (HEPA, UV-C, fresh air exchange)",
            "Sound system / zone audio (Sonos commercial, QSC)",
            "Automated lighting (training vs. recovery vs. event modes)",
            "EV charging stations in parking lot"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "space_planning",
      "number": 9,
      "title": "Space Planning & Architecture",
      "icon": "📐",
      "description": "The physical blueprint.",
      "questions": [
        {
          "id": "sp1",
          "text": "Building approach?",
          "type": "single",
          "options": [
            "Ground-up new construction (design from scratch)",
            "Conversion of existing industrial/warehouse shell",
            "Retrofit existing commercial building",
            "Haven't identified the site yet — open to all options"
          ],
          "hasOther": true,
          "otherLabel": "Site already secured (address):"
        },
        {
          "id": "sp1b",
          "text": "Preferred sub-market in Phoenix metro for site selection?",
          "type": "single",
          "options": [
            "North Phoenix (high athlete density, near EXOS but accessible)",
            "Scottsdale (luxury/executive draw, proximity to Banner)",
            "Tempe / ASU area (college pipeline, youth/high school access)",
            "East Valley — Gilbert, Mesa, Chandler (more land/affordability for large build)",
            "West Valley / Avondale (tie to existing Prime Reaction, lower costs)",
            "Flexible — open to wherever the best site is"
          ],
          "hasOther": true,
          "otherLabel": "Other area + why:"
        },
        {
          "id": "sp1c",
          "text": "Any must-have site features?",
          "type": "multi",
          "options": [
            "Proximity to major highways / airport for destination visitors",
            "Near universities / pro teams (ASU, U of A affiliates, Suns/Cardinals/Diamondbacks)",
            "Large lot for parking / EV charging / outdoor elements",
            "Industrial / warehouse shell available for cost-effective conversion",
            "Visibility from major road (signage / drive-by traffic)",
            "Adjacent retail / restaurants / hotels for visitor convenience"
          ],
          "hasOther": true
        },
        {
          "id": "sp2",
          "text": "How should the 60,000 SF be roughly allocated?",
          "type": "percentage",
          "zones": [
            "Sports Courts / Fields / Cages",
            "Strength & Conditioning",
            "Performance Testing / Biomechanics Lab",
            "Longevity / Regenerative Clinic",
            "Physical Therapy / Rehab",
            "Recovery & Hydrotherapy",
            "Nutrition / Café",
            "Locker Rooms / Changing",
            "Lobby / Reception / Retail",
            "Offices / Admin / Conference",
            "Storage / Mechanical / IT"
          ]
        },
        {
          "id": "sp3",
          "text": "Ceiling height requirements?",
          "type": "single",
          "options": [
            "24-30 ft clear (standard for volleyball / batting cages)",
            "30-40 ft clear (allows for more sports, better spectator views)",
            "Variable — high ceilings in court areas, lower in clinic/recovery",
            "Not sure — need architect guidance"
          ]
        },
        {
          "id": "sp4",
          "text": "Outdoor elements?",
          "type": "multi",
          "options": [
            "Outdoor turf training area",
            "Outdoor cold/hot plunge pools",
            "Rooftop recovery deck",
            "Outdoor sprint/agility track",
            "Outdoor yoga / meditation garden",
            "Parking lot tailgate / event space",
            "None — fully indoor facility"
          ],
          "hasOther": true
        },
        {
          "id": "sp5",
          "text": "Parking requirements?",
          "type": "single",
          "options": [
            "Standard — 4-5 spaces per 1,000 SF (240-300 spots)",
            "Heavy events — 6+ spaces per 1,000 SF (360+ spots)",
            "Shared parking with adjacent businesses",
            "Valet service for premium members",
            "Not sure — depends on site"
          ]
        },
        {
          "id": "sp6",
          "text": "Architectural vibe?",
          "type": "single",
          "options": [
            "Sleek & modern — glass, steel, clean lines (think Apple Store meets gym)",
            "Industrial-athletic — exposed steel, concrete, raw materials",
            "Resort / hospitality — warm wood, stone, water features",
            "Futuristic / sci-fi — LED accents, dark tones, high-tech feel",
            "Desert-integrated — Arizona materials, earth tones, sustainable"
          ],
          "hasOther": true
        },
        {
          "id": "sp7",
          "text": "How should Arizona's extreme heat / desert climate influence design decisions?",
          "type": "single",
          "options": [
            "Fully indoor focus — minimize outdoor training to avoid heat risks",
            "Limited outdoor (shaded turf only, no exposed plunges/pools)",
            "High-efficiency HVAC / air filtration emphasized throughout",
            "Water conservation priorities (low-flow systems, recycled water for pools)",
            "No change — outdoor elements still valuable for select programs (early AM / evening)"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "staffing",
      "number": 10,
      "title": "Staffing & Operations",
      "icon": "👔",
      "description": "The people who run this machine.",
      "questions": [
        {
          "id": "st1",
          "text": "Clinical staff model?",
          "type": "multi",
          "options": [
            "Medical Director (MD/DO) — full-time or part-time",
            "Nurse Practitioners / Physician Assistants",
            "Registered Nurses (IV therapy, injections)",
            "Licensed Physical Therapists",
            "Athletic Trainers (ATC)",
            "Registered Dietitians",
            "Sports Psychologists / Mental Performance Consultants",
            "Licensed Massage Therapists",
            "Chiropractor",
            "Exercise Physiologists",
            "Certified Strength & Conditioning Specialists (CSCS)",
            "Reaxing-Certified Trainers"
          ],
          "hasOther": true
        },
        {
          "id": "st2",
          "text": "Sport coaching staff model?",
          "type": "single",
          "options": [
            "Full-time coaching staff across all sports (in-house)",
            "Contract / 1099 coaches (per session, flexible)",
            "Hybrid — core full-time staff + contracted specialists",
            "Partner organizations provide coaching (clubs, academies)"
          ],
          "hasOther": true
        },
        {
          "id": "st3",
          "text": "Operating hours vision?",
          "type": "single",
          "options": [
            "Standard (6 AM - 10 PM)",
            "Extended (5 AM - 11 PM)",
            "24/7 access for premium members",
            "Split — sports zone has different hours than clinic"
          ],
          "hasOther": true
        },
        {
          "id": "st4",
          "text": "Expected total headcount at full operations?",
          "type": "single",
          "options": [
            "15-25 (lean and tech-enabled)",
            "25-50 (moderate, specialized staff)",
            "50-75 (fully built out across all departments)",
            "75+ (enterprise-level operation)",
            "Not sure — let the plan dictate"
          ]
        }
      ]
    },
    {
      "id": "revenue",
      "number": 11,
      "title": "Revenue Model & Pricing",
      "icon": "💰",
      "description": "How this thing makes money.",
      "questions": [
        {
          "id": "rev1",
          "text": "Primary revenue streams?",
          "type": "rank",
          "rankSlots": 3,
          "options": [
            "Monthly memberships (recurring)",
            "Training packages / session bundles",
            "Longevity clinic services (cash-pay medical)",
            "Physical therapy (insurance-billed)",
            "Tournament / event hosting fees",
            "Facility rentals (courts, fields, spaces)",
            "Retail / pro shop",
            "Nutrition / café sales",
            "Corporate wellness contracts",
            "Medicare Advantage / insurance wellness reimbursement",
            "Content / digital products (online training programs)"
          ]
        },
        {
          "id": "rev2",
          "text": "Monthly membership pricing range you're comfortable with?",
          "type": "single",
          "options": [
            "$99-$199/mo (accessible, high-volume)",
            "$199-$399/mo (premium, mid-market)",
            "$399-$699/mo (luxury, comprehensive)",
            "$699+/mo (ultra-premium concierge)",
            "Tiered — different levels at different price points"
          ],
          "hasOther": true
        },
        {
          "id": "rev3",
          "text": "What does a 'membership' include vs. what is à la carte?",
          "type": "text",
          "placeholder": "Describe what you think base membership covers vs. paid add-ons..."
        },
        {
          "id": "rev4",
          "text": "Annual revenue target at stabilization (Year 3)?",
          "type": "single",
          "options": [
            "$2-4M (conservative, lean)",
            "$4-8M (strong performance)",
            "$8-12M (aggressive, full utilization)",
            "$12M+ (world-class destination facility)",
            "Not sure — need financial modeling"
          ]
        },
        {
          "id": "rev5",
          "text": "How important are corporate / B2B partnerships?",
          "type": "single",
          "options": [
            "Critical — want 20%+ of revenue from corporate contracts",
            "Important — nice to have, actively pursue",
            "Minor — focus is on individual consumers",
            "Not interested in corporate"
          ]
        }
      ]
    },
    {
      "id": "partnerships",
      "number": 12,
      "title": "Partnerships & Affiliations",
      "icon": "🤝",
      "description": "Who do we build this with?",
      "questions": [
        {
          "id": "par1",
          "text": "Which existing partnerships carry over?",
          "type": "multi",
          "options": [
            "Spooner Physical Therapy",
            "Oasis Volleyball Academy",
            "Ottawa University (AZ)",
            "Reaxing (exclusive equipment partnership)",
            "None — starting fresh for this concept"
          ],
          "hasOther": true
        },
        {
          "id": "par2",
          "text": "What NEW partnerships would be valuable?",
          "type": "multi",
          "options": [
            "Pro sports team affiliation (AZ Diamondbacks, Suns, Cardinals, Coyotes)",
            "University sports medicine program (ASU, U of A)",
            "Hospital / health system (Banner, HonorHealth, Mayo AZ)",
            "Insurance carriers (Medicare Advantage, United, Aetna)",
            "Youth sports leagues / clubs (Little League, AZ Volleyball clubs)",
            "Tech companies (wearable sponsors — Whoop, Garmin, Apple)",
            "Supplement / nutrition brand (Momentous, Thorne, AG1)",
            "Recovery tech brands (Hyperice, Therabody, NormaTec)",
            "Real estate developer / landlord incentive partner",
            "Military / VA partnership (veteran wellness)"
          ],
          "hasOther": true
        },
        {
          "id": "par3",
          "text": "Anchor tenant model — would you lease space to partners?",
          "type": "single",
          "options": [
            "Yes — PT clinic, nutrition, other tenants lease space (de-risks buildout)",
            "Maybe — open to it for the right partner",
            "No — we own and operate everything under one brand"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "marketing",
      "number": 13,
      "title": "Marketing & Brand",
      "icon": "📣",
      "description": "How the world finds out.",
      "questions": [
        {
          "id": "m1",
          "text": "Pre-launch strategy?",
          "type": "multi",
          "options": [
            "Founder memberships (discounted, lifetime rate lock)",
            "Influencer / athlete ambassador program",
            "Grand opening event (community day, free assessments)",
            "Physician / medical referral network buildout",
            "Corporate partnership pitches pre-opening",
            "Waitlist / VIP early access campaign",
            "Documentary / behind-the-scenes content series",
            "Strategic PR (local news, sports media, health/wellness press)"
          ],
          "hasOther": true
        },
        {
          "id": "m2",
          "text": "Ongoing marketing budget expectation?",
          "type": "single",
          "options": [
            "$5K-$10K/month (lean, organic-heavy)",
            "$10K-$25K/month (moderate, paid + organic)",
            "$25K-$50K/month (aggressive growth)",
            "$50K+/month (dominant market presence)",
            "Not sure — need guidance"
          ]
        },
        {
          "id": "m3",
          "text": "What should the website and digital presence feel like?",
          "type": "single",
          "options": [
            "Clean, clinical, trust-building (like a medical practice)",
            "Bold, athletic, high-energy (like a Nike campaign)",
            "Warm, aspirational, lifestyle (like a luxury resort)",
            "Tech-forward, data-rich (like a SaaS product)"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "capital",
      "number": 14,
      "title": "Capital & Financial",
      "icon": "🏦",
      "description": "The money side.",
      "questions": [
        {
          "id": "c1",
          "text": "Total project budget range?",
          "type": "single",
          "options": [
            "$4-6M (lean buildout, phased equipment)",
            "$6-10M (strong buildout, full equipment Day 1)",
            "$10-15M (premium buildout, all amenities)",
            "$15-25M (world-class, no compromises)",
            "$25M+ (destination-level, architectural statement)",
            "Not established yet — need feasibility study first"
          ]
        },
        {
          "id": "c2",
          "text": "Funding sources?",
          "type": "multi",
          "options": [
            "Private equity / venture capital",
            "Angel investors / HNW individuals",
            "SBA loan",
            "Commercial bank loan",
            "Owner equity / self-funded",
            "Strategic partner investment (health system, pro team)",
            "Real estate developer / TI allowance",
            "City / economic development incentives",
            "Crowdfunding / community investment",
            "Not sure — open to all options"
          ],
          "hasOther": true
        },
        {
          "id": "c3",
          "text": "Target timeline?",
          "type": "single",
          "options": [
            "Open within 12 months",
            "Open within 18 months",
            "Open within 24 months",
            "Phased — soft open in 12 months, full build in 24",
            "No rush — get it right"
          ],
          "hasOther": true
        },
        {
          "id": "c4",
          "text": "Financial return expectations?",
          "type": "single",
          "options": [
            "Breakeven within 12 months, 15%+ IRR",
            "Breakeven within 18-24 months, 10-15% IRR",
            "Longer horizon ok — building a legacy asset",
            "Need to model this out before setting targets"
          ],
          "hasOther": true
        },
        {
          "id": "c5",
          "text": "Any preliminary thoughts on Phoenix commercial real estate / construction costs for 60k SF?",
          "type": "text",
          "placeholder": "e.g. warehouse conversion at $80-120/SF vs. ground-up at $200+/SF, land costs by sub-market, TI expectations..."
        }
      ]
    },
    {
      "id": "community",
      "number": 15,
      "title": "Community & Impact",
      "icon": "🌍",
      "description": "Beyond the bottom line.",
      "questions": [
        {
          "id": "com1",
          "text": "Community programming?",
          "type": "multi",
          "options": [
            "Youth scholarships for underserved athletes",
            "Free community combine days / fitness testing",
            "STEM + sports education programs with schools",
            "Internship pipeline with local universities",
            "First responder / veteran discounted programs",
            "Senior wellness outreach (fall prevention for community)",
            "Charity events / fundraiser hosting",
            "Youth mentorship program (athletes → role models)",
            "Not a priority right now"
          ],
          "hasOther": true
        },
        {
          "id": "com2",
          "text": "Sustainability & ESG priorities?",
          "type": "multi",
          "options": [
            "LED sport lighting throughout",
            "Solar panels / renewable energy",
            "Low-flow plumbing / water recycling",
            "Recycled / sustainable building materials",
            "LEED certification target",
            "EV charging stations",
            "Green cleaning products / low-VOC materials",
            "Not a priority for this project"
          ],
          "hasOther": true
        }
      ]
    },
    {
      "id": "wildcard",
      "number": 16,
      "title": "Wild Card",
      "icon": "⚡",
      "description": "The stuff we can't predict. Speak freely.",
      "questions": [
        {
          "id": "w1",
          "text": "What keeps you up at night about this project?",
          "type": "text",
          "placeholder": "Your biggest concerns, fears, unknowns..."
        },
        {
          "id": "w2",
          "text": "What feature would make this facility truly one-of-a-kind?",
          "type": "text",
          "placeholder": "Dream big — no budget constraints..."
        },
        {
          "id": "w3",
          "text": "Is there a facility ANYWHERE in the world you've visited or seen that made you say 'I want THAT'?",
          "type": "text",
          "placeholder": "Name it, link it, describe it..."
        },
        {
          "id": "w4",
          "text": "What is the ONE thing you absolutely do NOT want in this facility?",
          "type": "text",
          "placeholder": "Dealbreakers, pet peeves, hard no's..."
        },
        {
          "id": "w5",
          "text": "Anything else we haven't asked that you're thinking about?",
          "type": "text",
          "placeholder": "Open floor..."
        },
        {
          "id": "w6",
          "text": "Any specific market validation you've done so far?",
          "type": "text",
          "placeholder": "e.g. surveys, competitor visits, demand studies, conversations with potential partners, LOIs..."
        }
      ]
    },
    {
      "id": "competitive",
      "number": 17,
      "title": "Competitive Landscape & Market Positioning",
      "icon": "🏁",
      "description": "Know the battlefield before you build.",
      "questions": [
        {
          "id": "comp1",
          "text": "Which Phoenix-area facilities do you view as primary competitors or comparables?",
          "type": "multi",
          "options": [
            "EXOS Phoenix (strong sports performance + recovery)",
            "Synergy Sport Medicine & Wellness (hybrid recovery/longevity)",
            "Banner Sports Medicine High Performance Center — Scottsdale (sports science focus)",
            "Spooner Sports Institute / existing Spooner PT partnership",
            "Mach 1 Sports Performance / Redline Athletics / other boutique training gyms",
            "Local longevity clinics (HealthspanMD, Shafa, Bassi, etc.)",
            "Life Time Fitness / Equinox (premium general fitness)",
            "None significant — we see a major market gap for large-scale hybrid"
          ],
          "hasOther": true
        },
        {
          "id": "comp2",
          "text": "What are the biggest strengths and weaknesses of these competitors relative to your vision?",
          "type": "text",
          "placeholder": "e.g. 'EXOS has great sports training but limited regenerative; Synergy has longevity but small scale / no turf fields...'"
        },
        {
          "id": "comp3",
          "text": "What is your core differentiation strategy for this facility?",
          "type": "multi",
          "maxSelections": 4,
          "options": [
            "Largest scale in AZ — 60k SF hybrid under one roof",
            "Deeper longevity / regenerative medicine integration (MD oversight, full diagnostics)",
            "Exclusive emphasis on Reaxing technology as centerpiece differentiator",
            "Broader audience (youth pipeline + executive longevity + medical tourism)",
            "Superior data / tech platform (unified dashboard, AI programming)",
            "Strategic partnerships (pro teams, universities, Ottawa University carryover)",
            "Luxury / spa-like experience combined with elite performance",
            "Price competitiveness — premium quality at accessible price points"
          ],
          "hasOther": true
        },
        {
          "id": "comp4",
          "text": "How concerned are you about direct competition from EXOS or similar facilities?",
          "type": "single",
          "options": [
            "High — need strong differentiation to pull market share",
            "Moderate — opportunity to coexist / complement (e.g., refer complex longevity cases)",
            "Low — different enough positioning (more medical / longevity focus)",
            "Not sure — need more market data before assessing"
          ]
        }
      ]
    }
  ]
}
```

---

## EMAIL SUBMISSION (API Route: `/api/send`)

When the user hits SUBMIT, fire a POST to `/api/send` with the full response payload:

```json
{
  "respondent": {
    "name": "...",
    "email": "...",
    "role": "..."
  },
  "responses": {
    "v1": { "selected": "Equal 50/50 Hybrid — Both are the brand", "other": null },
    "v2": { "selected": ["EXOS / IMG Academy", "Bulletproof Labs"], "other": null },
    "v3": { "text": "I've never seen anything like this..." }
  },
  "completionRate": 87,
  "submittedAt": "2026-02-09T14:30:00Z"
}
```

The API route should:
1. Send a **formatted HTML email to the facility owner** at: `RECIPIENT_EMAIL` env var — with a clean summary of all responses organized by section, respondent name/email at the top, and completion percentage.
2. Send a **confirmation email to the respondent** thanking them, confirming receipt, and including a copy of their responses.
3. Use **Resend** (`npm install resend`) with env variable `RESEND_API_KEY`.
4. The "from" address should use Resend's default onboarding domain initially: `onboarding@resend.dev`.
5. Return `{ success: true }` or `{ error: "..." }` from the API route.
6. The email HTML should be dark-themed to match the app aesthetic — dark backgrounds, cyan accents, clean typography. Use inline CSS for email compatibility.

---

## LOCAL STORAGE SCHEMA

Key: `facility_vision_progress`

```json
{
  "respondent": { "name": "...", "email": "...", "role": "..." },
  "responses": { "v1": {...}, "v2": {...} },
  "currentSection": 3,
  "lastUpdated": "2026-02-09T14:30:00Z"
}
```

- **Auto-save on every answer change** (debounced 500ms).
- On app load, check for existing progress. If found, show "Welcome back" with option to continue or start fresh.
- On successful submission, clear localStorage.

---

## MOBILE UX REQUIREMENTS (CRITICAL — THIS IS THE PRIMARY DEVICE)

1. **Touch targets:** All tappable option cards must be minimum 48px tall with 12-16px padding.
2. **One section per screen.** Questions within a section scroll vertically.
3. **Sticky progress bar** at top of screen (thin, 4px, gradient cyan→green).
4. **Sticky section header** below progress bar with section number, icon, title.
5. **Bottom navigation bar** (sticky): "← BACK" on left, "NEXT →" on right, centered section dots.
6. **No horizontal scrolling. Ever.**
7. **Button navigation only** — no swipe gestures required.
8. **Large readable text:** Question text 18-20px, option text 15-16px, all Outfit font.
9. **Haptic-style feedback:** Selected options should have a visible snap animation (scale 1.02 → 1.0 with border glow).
10. **Scroll to top** on section change.
11. **Safe area insets** — account for iPhone notch and home indicator.
12. **Viewport height** — use `dvh` units where needed to avoid iOS Safari toolbar issues.

---

## DESKTOP ENHANCEMENTS (768px+)

- Max-width container: 720px, centered.
- Sidebar navigation showing all 17 sections with completion status (dots → checkmarks).
- Questions display in a comfortable single-column flow (not one-at-a-time).
- Cards can be slightly wider with more horizontal padding.
- Hover states on option cards (subtle background shift + border glow preview).

---

## ANIMATIONS & MICRO-INTERACTIONS

- **Page load:** Staggered fade-in of welcome screen elements (100ms delay between each).
- **Section transitions:** Fade out (150ms) → fade in with slight translateY (200ms).
- **Option select:** Border transitions from `--border` to `--accent-cyan` (200ms ease), background shifts, scale micro-pop (1.00 → 1.02 → 1.00, 150ms).
- **Progress bar:** Smooth width transitions (300ms ease-out) with subtle pulse glow on the leading edge.
- **Submit button:** Pulse glow animation (green) when all sections are visited.
- **Confirmation checkmark:** Draw-on SVG animation (like the checkmark draws itself, 800ms).
- Use CSS animations/transitions only. No external animation libraries needed.

---

## FILE STRUCTURE

```
/app
  /layout.tsx          (root layout, fonts, metadata)
  /page.tsx            (main questionnaire page — client component)
  /api
    /send
      /route.ts        (Resend email API)
/components
  /WelcomeScreen.tsx
  /QuestionSection.tsx
  /SingleSelect.tsx
  /MultiSelect.tsx
  /TextInput.tsx
  /RankInput.tsx
  /PercentageAllocator.tsx
  /ProgressBar.tsx
  /SectionNav.tsx
  /ReviewScreen.tsx
  /ConfirmationScreen.tsx
  /OptionCard.tsx       (shared card component for single/multi select)
/data
  /questions.ts         (all question data exported as typed const)
/lib
  /storage.ts           (localStorage read/write/clear helpers)
  /types.ts             (TypeScript interfaces for all data shapes)
/public
  (any static assets if needed)
tailwind.config.ts
next.config.js
package.json
.env.local.example      (RESEND_API_KEY=re_xxx  RECIPIENT_EMAIL=you@email.com)
```

---

## CRITICAL IMPLEMENTATION NOTES

1. **TypeScript throughout.** Strongly type all question data, response shapes, and component props.
2. **The question data JSON above is the source of truth.** Put it into `/data/questions.ts` and type it properly.
3. **Do NOT use any UI component library** (no shadcn, no MUI, no Chakra). Build all components from scratch with Tailwind. This ensures the biohacker aesthetic is 100% custom and cohesive.
4. **Accessibility:** All form elements need proper labels, role attributes, and keyboard navigation. aria-selected on chosen options. Focus rings in cyan.
5. **The percentage allocator (sp2)** is the most complex component. Build it with increment/decrement buttons (+5/-5) for each zone, a running total display, and a simple horizontal bar chart that updates live. Total must show clearly and change color: cyan at 0-99%, green at exactly 100%, magenta at 101%+.
6. **The rank input (s2, rev1)** should let users tap options to fill numbered slots (1, 2, 3). Tapping a filled slot removes it. Simple, visual, and satisfying.
7. **Test assumptions for iPhone Safari** — this is the most likely device for the recipients. Use `-webkit-` prefixes where needed, handle safe areas, use `dvh` for viewport.
8. **Performance:** Keep bundle size small. CSS transitions/animations only.
9. **The email HTML template** should be clean, dark-themed (matching the app), and render well in Gmail, Apple Mail, and Outlook. Use inline styles for email HTML. Tables for layout (email compatibility).
10. **Error handling:** If localStorage is full or unavailable, gracefully degrade (still works, just doesn't save progress). If email send fails, show error with "Try Again" button and also provide a "Copy Responses to Clipboard" fallback so no data is lost.
11. **The "Other" fields:** When a question has `hasOther: true`, render an "Other" option card at the bottom of the list. When tapped/selected, it expands to reveal a text input inline. The typed text gets saved as the `other` value in the response object. Some questions also have `otherLabel` (e.g. "Site already secured (address):") — use this as the placeholder text for the Other input instead of the default "Other...".

---

## ENVIRONMENT VARIABLES

```
RESEND_API_KEY=re_xxxxxxxxxxxx
RECIPIENT_EMAIL=your@email.com
```

Create a `.env.local.example` file with these keys and placeholder values.

---

## FINAL CHECKLIST BEFORE DEPLOYING

- [ ] All 75 questions render correctly with proper input types
- [ ] localStorage save/restore works (close tab, reopen, progress intact)
- [ ] Welcome screen captures name + email, validates email format
- [ ] All 5 question types work: single, multi, text, rank, percentage
- [ ] "Other" text fields appear/hide when "Other" option is selected/deselected
- [ ] Progress bar accurately reflects completion across all 17 sections
- [ ] Section navigation works (forward, back, jump via sidebar on desktop)
- [ ] Review screen shows all answers organized by section, allows editing
- [ ] Submit sends email via Resend API route
- [ ] Respondent receives confirmation email with copy of answers
- [ ] Owner receives formatted summary email
- [ ] Confirmation screen displays after successful submit
- [ ] Mobile responsive: tested at 375px, 390px, 414px, 768px, 1024px, 1440px
- [ ] No horizontal overflow on any screen size
- [ ] Dark theme consistent throughout — no white flashes, no unstyled states
- [ ] Fonts load correctly (Orbitron, Outfit, JetBrains Mono)
- [ ] Animations are smooth (60fps), not janky
- [ ] Deploys cleanly to Vercel with zero build errors
- [ ] .env.local.example file exists with both env var keys

---

Build this as a production-ready application. No placeholders, no TODOs, no "implement later" comments. Every component fully functional. Ship it.
