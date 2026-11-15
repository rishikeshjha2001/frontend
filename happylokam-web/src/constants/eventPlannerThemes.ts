export interface PlannerTheme {
  id: string;
  name: string;
  category: 'wedding' | 'pre-wedding' | 'birthday' | 'anniversary' | 'corporate';
  tagline: string;
  description: string;
  recommendedGuests: { min: number; max: number; optimal: number };
  perPlateEstimate: { veg: number; nonVeg: number };
  decorMultiplier: number;
  bannerImage: string;
  colorPalette: string[];
  vibeTags: string[];
  foodOptions: { id: string; label: string; priceDelta: number; desc: string }[];
  decorLevels: { id: string; label: string; priceDelta: number; desc: string }[];
  mediaTiers: { id: string; label: string; priceDelta: number; desc: string }[];
  aiTips: string[];
  suggestedAddons: { id: string; name: string; price: number; icon: string }[];
}

export const EVENT_PLANNER_THEMES: PlannerTheme[] = [
  {
    id: 'vedic-royal',
    name: 'Vedic Vivah & Royal Rajasthani',
    category: 'wedding',
    tagline: 'Regal heritage mandap with brass diyas, rajwadi feasts & traditional shehnai',
    description: 'Immerse your wedding in centuries of royal timelessness with handcrafted carved mandaps, marigold & rajnigandha arches, traditional welcoming nagadas, and an opulent royal thali spread.',
    recommendedGuests: { min: 200, max: 1500, optimal: 450 },
    perPlateEstimate: { veg: 1100, nonVeg: 1350 },
    decorMultiplier: 1.35,
    bannerImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    colorPalette: ['#991b1b', '#d97706', '#fef08a', '#1e293b'],
    vibeTags: ['Royal Heritage', 'Vedic Chants', 'Opulent Mandap', 'Rajwadi Feast'],
    foodOptions: [
      { id: 'satvik-royal', label: 'Satvik Royal Feast', priceDelta: -100, desc: 'Pure Desi Ghee Satvik delights, paneer makhani, authentic sweets' },
      { id: 'rajwadi-classic', label: 'Rajwadi Deluxe Spread', priceDelta: 0, desc: '14 hot starters, 6 live chaat counters, dum biryani & artisanal halwas' },
      { id: 'maharaja-gourmet', label: 'Maharaja Imperial Grand Buffet', priceDelta: 250, desc: 'Pan-Indian live counters, organic farm salads, 12 royal desserts & mocktail bar' },
    ],
    decorLevels: [
      { id: 'classic-marigold', label: 'Classic Temple Floral', priceDelta: 0, desc: 'Fresh Marigold, mogra cascades, brass bell chandeliers' },
      { id: 'palace-illumination', label: 'Palace Night Illumination', priceDelta: 45000, desc: 'Fairy tunnel driveway, carved wooden backdrop & royal throne chairs' },
      { id: 'sheesh-mahal', label: 'Sheesh Mahal Grand Mandap', priceDelta: 95000, desc: 'Mirrorwork glass pavilions, hydraulic revolving stage, imported floral domes' },
    ],
    mediaTiers: [
      { id: 'classic-capture', label: 'Dual Traditional Photo + Video', priceDelta: 0, desc: '2 Senior candid photographers, full traditional 4K coverage' },
      { id: 'cinematic-teaser', label: 'Cinematic Drone + 4K Wedding Film', priceDelta: 35000, desc: '3 Cinematographers, 4K Drone flyovers, 3-minute Instagram teaser & raw reels' },
      { id: 'celebrity-crew', label: 'Celebrity Crew + Live LED Wall Streaming', priceDelta: 75000, desc: 'Top tier celebrity studio, same-night edit video, live multi-camera broadcast' },
    ],
    aiTips: [
      'Choosing a Sunday lunch or weekday mahurat can save ~18% on venue and decorator bookings.',
      'A combo booking of floral entrance with stage reduces independent transport and labor expenses by up to ₹15,000.',
    ],
    suggestedAddons: [
      { id: 'shehnai-nagada', name: 'Live Shehnai & Nagada Welcoming Troupe', price: 18000, icon: 'Music' },
      { id: 'fireworks-pyro', name: 'Cold-Pyro & Hydraulic Varmala Machine', price: 22000, icon: 'Sparkles' },
      { id: 'royal-turban-stall', name: 'Safa / Turban Tying Station for Baratis', price: 12000, icon: 'Crown' },
    ],
  },
  {
    id: 'pastel-garden',
    name: 'Pastel Romance & Modern Garden',
    category: 'wedding',
    tagline: 'Chic European florals, fairy light canopies & artisanal live dining stations',
    description: 'Designed for couples who adore elegance, subtlety, and modern aesthetics. Features blush pink drapery, imported hydrangea centerpieces, acoustic string quartet melodies, and continental fusion counters.',
    recommendedGuests: { min: 100, max: 800, optimal: 300 },
    perPlateEstimate: { veg: 1250, nonVeg: 1500 },
    decorMultiplier: 1.25,
    bannerImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80',
    colorPalette: ['#f43f5e', '#ec4899', '#fbcfe8', '#38bdf8'],
    vibeTags: ['Modern Chic', 'Fairy Light Canopy', 'Hydrangea Mandap', 'Artisanal Pasta'],
    foodOptions: [
      { id: 'garden-bistro', label: 'Garden Bistro Grazing Table', priceDelta: -100, desc: 'Cheese wheels, woodfired pizzas, bruschettas & fresh mocktail bar' },
      { id: 'continental-fusion', label: 'Indo-Continental Grand Fusion', priceDelta: 0, desc: '10 live counters, sushi bar, Lebanese mezze & Indian main course' },
      { id: 'michelin-curated', label: 'Celebrity Chef Signature Course', priceDelta: 300, desc: 'Gourmet molecular gastronomy, French pastry counter & artisan gelatos' },
    ],
    decorLevels: [
      { id: 'pergola-lights', label: 'Edison Bulb Wooden Pergola', priceDelta: 0, desc: 'Romantic fairy lights, rustic wooden tables, blush drapes' },
      { id: 'hydrangea-arch', label: 'Imported Floral Arch & Glass Stage', priceDelta: 50000, desc: 'Dutch hydrangeas, roses, elevated transparent acrylic stage' },
      { id: 'celestial-canopy', label: 'Celestial Glass Pavilion & Starlight Dome', priceDelta: 110000, desc: 'Enclosed AC glass tenting, hanging crystal chandeliers, 3D floral tunnel' },
    ],
    mediaTiers: [
      { id: 'candid-duo', label: 'Candid Editorial Photography', priceDelta: 0, desc: 'Magazine-style candid portraits, photobook album & teaser' },
      { id: 'drone-cinematic', label: 'High-Fashion 4K Film + Drone', priceDelta: 40000, desc: 'Dual 4K drone cinematography, editorial fashion shoot & color graded movie' },
      { id: 'instant-reels-team', label: 'Instant Social Reel Creators + Crew', priceDelta: 65000, desc: 'Dedicated viral reel creator delivering 5 polished reels on the event day' },
    ],
    aiTips: [
      'Daytime sundowner weddings save up to 40% on heavy generator power and night lighting rigs.',
      'Substituting exotic peonies with local baby breath and blush carnations preserves beauty while shaving ₹30,000 off decor.',
    ],
    suggestedAddons: [
      { id: 'acoustic-band', name: 'Live Acoustic String Duo / Flute Master', price: 25000, icon: 'Music' },
      { id: '360-photo-booth', name: 'Motorized 360 Video Spin Booth', price: 16000, icon: 'Camera' },
      { id: 'dry-ice-fog', name: 'Dry Ice Cloud Fog Machine for First Dance', price: 14000, icon: 'Cloud' },
    ],
  },
  {
    id: 'bollywood-sangeet',
    name: 'Bollywood Sangeet & Grand Gala',
    category: 'pre-wedding',
    tagline: 'Concert stage, dynamic moving beams, celebrity DJ & high-voltage entertainment',
    description: 'Transform your pre-wedding night into an electrifying concert experience! Built with massive P3 LED visual backdrops, haze atmospherics, choreographed flashmobs, and energetic cocktail hospitality.',
    recommendedGuests: { min: 150, max: 1000, optimal: 350 },
    perPlateEstimate: { veg: 950, nonVeg: 1200 },
    decorMultiplier: 1.2,
    bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    colorPalette: ['#7c3aed', '#ec4899', '#06b6d4', '#0f172a'],
    vibeTags: ['Concert Lighting', 'P3 LED Wall', 'Celebrity DJ', 'Live Cocktail Bar'],
    foodOptions: [
      { id: 'party-tapas', label: 'Global Tapas & Finger Bites', priceDelta: -80, desc: 'Slider stations, tandoori skewers, nacho bars & dim sum carts' },
      { id: 'sangeet-buffet', label: 'Midnight Biryani & Grill Buffet', priceDelta: 0, desc: 'Live barbecue grill, Amritsari kulcha counter & slow-cooked biryani' },
      { id: 'gourmet-mixology', label: 'VIP Lounge Dining & Molecular Sips', priceDelta: 220, desc: 'Smoked nitrogen mocktails, gourmet live pasta & dessert jars' },
    ],
    decorLevels: [
      { id: 'club-lighting', label: 'Nightclub Truss & Beam Setup', priceDelta: 0, desc: '12 Sharpy moving heads, DJ backdrop, smoke blasters' },
      { id: 'concert-led', label: 'Concert Stage & 30ft Curved LED Wall', priceDelta: 55000, desc: 'Synchronized visual loops, hydraulic DJ riser, CO2 jets' },
      { id: 'arena-production', label: 'Grand Arena Production & Laser Show', priceDelta: 120000, desc: 'Festival-grade line arrays, synchronized RGB lasers & sparkler waterfall' },
    ],
    mediaTiers: [
      { id: 'dance-video', label: 'Dual Action Sangeet Coverage', priceDelta: 0, desc: 'Fast-paced audio sync, stage coverage & party snaps' },
      { id: 'gimbal-pro', label: 'Smooth Gimbal Master Video & Highlights', priceDelta: 30000, desc: 'Ronin 4K stabilized dance tracking, crisp multitrack sound' },
      { id: 'multi-cam-crane', label: 'Jib Crane + 4-Cam Live Production', priceDelta: 60000, desc: 'Full broadcast crane with live director switching for big stage performances' },
    ],
    aiTips: [
      'Serving finger foods and live counters on the dance floor speeds service and curbs wasted sit-down buffet costs by 22%.',
      'Bundle sound and stage lighting from a single vendor to avoid duplicate trucking and power board levies.',
    ],
    suggestedAddons: [
      { id: 'dhol-players', name: 'High-Octane Punjabi Dhol Troupe (4 Artists)', price: 15000, icon: 'Drum' },
      { id: 'co2-confetti', name: 'Stage CO2 Blaster & Confetti Cannons', price: 14000, icon: 'Sparkles' },
      { id: 'choreographer-assist', name: 'On-Ground Stage Management Coordinator', price: 10000, icon: 'UserCheck' },
    ],
  },
  {
    id: 'vibrant-haldi',
    name: 'Vibrant Haldi & Mehendi Mela',
    category: 'pre-wedding',
    tagline: 'Carnival vibes, floral jewelry, poolside splashes & colorful umbrella installations',
    description: 'A joy-packed carnival celebration featuring yellow marigold backdrops, traditional Rajasthani puppets, bangle counters, customized photo booths, and zesty street food stations.',
    recommendedGuests: { min: 80, max: 500, optimal: 200 },
    perPlateEstimate: { veg: 800, nonVeg: 950 },
    decorMultiplier: 1.0,
    bannerImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&auto=format&fit=crop&q=80',
    colorPalette: ['#eab308', '#f97316', '#22c55e', '#ffffff'],
    vibeTags: ['Carnival Colors', 'Poolside Splash', 'Mehendi Artists', 'Live Chaat Mela'],
    foodOptions: [
      { id: 'street-mela', label: 'Delhi 6 Chaat Mela & Street Bites', priceDelta: 0, desc: 'Gol gappe, dahi bhalla, pav bhaji, live jalebi & rabdi counter' },
      { id: 'punjabi-dhaba', label: 'Punjabi Dhaba & Kulcha Station', priceDelta: 120, desc: 'Tandoori parathas, lassi bar in clay kulhads, chole bhature' },
    ],
    decorLevels: [
      { id: 'marigold-canopy', label: 'Marigold Tassels & Colorful Umbrellas', priceDelta: 0, desc: 'Handcrafted fabric drapes, earthen pots, swing for bride & groom' },
      { id: 'poolside-carnival', label: 'Poolside Carnival with Photo Booths', priceDelta: 35000, desc: 'Floating floral rings, customized name boards, sunglasses stall' },
      { id: 'luxury-floral-tub', label: 'Carved Brass Urli & Rose Petal Bath Setup', priceDelta: 65000, desc: 'Grand brass tub, 50kg fresh rose petals, overhead floral umbrella' },
    ],
    mediaTiers: [
      { id: 'candid-haldi', label: 'Bright Daylight Candid Photography', priceDelta: 0, desc: 'Action candid moments, splash shots & family fun photos' },
      { id: 'slow-mo-reels', label: 'Super Slow-Mo Splash Reel Specialist', priceDelta: 25000, desc: 'High-speed 120fps drone and camera captures of turmeric splashes' },
    ],
    aiTips: [
      'Scheduling Haldi between 10:00 AM and 3:00 PM utilizes free natural sun illumination with crisp photo contrast.',
      'Clay kulhads and eco-leaf bowls look ultra-authentic and eliminate disposable plastic fee penalties.',
    ],
    suggestedAddons: [
      { id: 'mehendi-trio', name: 'Master Mehendi Artists (Team of 3)', price: 12000, icon: 'Palette' },
      { id: 'puppet-folk', name: 'Rajasthani Folk Singers & Puppet Masters', price: 16000, icon: 'Music' },
      { id: 'sunglasses-stall', name: 'Funky Celebration Sunglasses & Floral Props', price: 6000, icon: 'Smile' },
    ],
  },
  {
    id: 'milestone-birthday',
    name: 'Milestone Birthday & Glow Gala',
    category: 'birthday',
    tagline: 'Neon arches, custom backdrop arches, gourmet mocktails & energetic dancefloor',
    description: 'Perfect for 1st, 18th, 25th, or 50th birthdays, themed anniversaries, and family milestones. Features custom acrylic signage, organic balloon cascades, dessert table styling, and a party DJ.',
    recommendedGuests: { min: 40, max: 300, optimal: 120 },
    perPlateEstimate: { veg: 750, nonVeg: 900 },
    decorMultiplier: 0.9,
    bannerImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80',
    colorPalette: ['#8b5cf6', '#ec4899', '#f59e0b', '#0f172a'],
    vibeTags: ['Neon Glow', 'Organic Balloons', 'Dessert Table', 'Party DJ'],
    foodOptions: [
      { id: 'bday-classic', label: 'Party Favorites & Multi-Cuisine', priceDelta: 0, desc: 'Chinese live wok, pasta station, momos, rolls & pizza' },
      { id: 'bday-premium', label: 'Barbecue Live Grills & Dessert Extravaganza', priceDelta: 150, desc: 'Paneer tikka, grilled pineapple, chocolate fountain, cupcake tower' },
    ],
    decorLevels: [
      { id: 'neon-backdrop', label: 'Custom Neon Sign & Double Arch', priceDelta: 0, desc: 'Personalized LED name light, shimmer wall, organic balloon garland' },
      { id: 'glow-party', label: 'UV Glow Room & Themed Entrance', priceDelta: 25000, desc: 'Blacklight ambiance, neon face paint corner, LED cocktail tables' },
    ],
    mediaTiers: [
      { id: 'portrait-pro', label: 'Celebration Photographer & Mini Reel', priceDelta: 0, desc: '1 Candid photographer, instant polaroid station, 1-min reel' },
      { id: 'studio-cinematic', label: 'Dual Camera Studio & 4K Aftermovie', priceDelta: 22000, desc: 'Comprehensive event coverage with interview snippets & family wishes' },
    ],
    aiTips: [
      'Pre-ordering customized tier cakes from our verified baker partners gets you free delivery and damage warranty.',
      'Weekday birthday hall bookings qualify for flat 15% off standard package tariffs.',
    ],
    suggestedAddons: [
      { id: 'magic-show', name: 'Master Illusionist / Kids Entertainer', price: 9000, icon: 'Sparkles' },
      { id: 'chocolate-fountain', name: '3-Tier Warm Belgian Chocolate Fountain', price: 7500, icon: 'Coffee' },
      { id: 'tattoo-station', name: 'Airbrush Glitter & Temporary Tattoo Corner', price: 5000, icon: 'Star' },
    ],
  },
  {
    id: 'eco-courtyard',
    name: 'Eco-Courtyard & Intimate Gathering',
    category: 'wedding',
    tagline: 'Sustainable cane furniture, terracotta warmth, earthen pottery & zero-waste beauty',
    description: 'A celebration celebrating heritage authenticity with zero plastic, organic banana leaf banquets, handwoven wicker lamps, fresh jasmine strings, and serene sitar notes.',
    recommendedGuests: { min: 50, max: 250, optimal: 120 },
    perPlateEstimate: { veg: 850, nonVeg: 1050 },
    decorMultiplier: 0.95,
    bannerImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?w=1200&auto=format&fit=crop&q=80',
    colorPalette: ['#15803d', '#a16207', '#fef3c7', '#78350f'],
    vibeTags: ['Eco-Friendly', 'Clay Terracotta', 'Handwoven Wicker', 'Zero Single-Use Plastic'],
    foodOptions: [
      { id: 'earthen-patra', label: 'Authentic Banana Leaf Traditional Feast', priceDelta: 0, desc: '16 regional items served on fresh plantain leaves with copper drinkware' },
      { id: 'farm-to-table', label: 'Organic Farm-to-Table Gourmet Spread', priceDelta: 160, desc: 'Locally grown organic produce, millets, artisanal ghee & fresh cold-pressed syrups' },
    ],
    decorLevels: [
      { id: 'wicker-terracotta', label: 'Terracotta Pots & Handwoven Bamboo', priceDelta: 0, desc: 'Earthen oil lamps, jute runners, fresh tulsi and marigold touches' },
      { id: 'courtyard-haven', label: 'Heritage Haveli Courtyard Canopy', priceDelta: 28000, desc: 'Upcycled fabric awnings, brass planters, live sitar platform' },
    ],
    mediaTiers: [
      { id: 'earth-candid', label: 'Natural Light Candid Storytelling', priceDelta: 0, desc: 'Raw, documentary style photography without harsh intrusive flash' },
      { id: 'documentary-film', label: 'Artisanal 4K Documentary Wedding Film', priceDelta: 32000, desc: 'Short documentary style film highlighting personal stories and eco details' },
    ],
    aiTips: [
      'Banana leaf traditional seating saves on expensive cutleries, service labor, and cleaning logistics.',
      'Sourcing seasonal regional flowers from nearby farmers cuts transport carbon footprint and vendor costs.',
    ],
    suggestedAddons: [
      { id: 'live-sitar', name: 'Master Sitar & Santoor Duo', price: 16000, icon: 'Music' },
      { id: 'seed-bombs-favor', name: 'Eco-Seed Favors & Potted Plants for Guests', price: 8000, icon: 'Heart' },
      { id: 'pottery-workshop', name: 'Interactive Live Pottery Wheel Experience', price: 7000, icon: 'Sparkles' },
    ],
  },
];

export const DESTINATION_CITIES = [
  { id: 'Patna', name: 'Patna', state: 'Bihar', multiplier: 1.0, popularVenues: 'Ganga Lawns, Bailey Road Palaces' },
  { id: 'Ranchi', name: 'Ranchi', state: 'Jharkhand', multiplier: 0.98, popularVenues: 'Morabadi Resorts, Kanke Lake Lawns' },
  { id: 'Varanasi', name: 'Varanasi', state: 'Uttar Pradesh', multiplier: 1.08, popularVenues: 'Ghat Heritage Palaces, Cantt Resorts' },
  { id: 'Bodh Gaya', name: 'Bodh Gaya', state: 'Bihar', multiplier: 0.95, popularVenues: 'Zen Garden Hotels, Heritage Retreats' },
  { id: 'Kolkata', name: 'Kolkata', state: 'West Bengal', multiplier: 1.15, popularVenues: 'New Town Banquets, Rajbari Estates' },
  { id: 'Lucknow', name: 'Lucknow', state: 'Uttar Pradesh', multiplier: 1.12, popularVenues: 'Gomti Nagar Lawns, Nawabi Kothis' },
  { id: 'Jaipur', name: 'Jaipur', state: 'Rajasthan', multiplier: 1.25, popularVenues: 'Kukas Royal Havelis, Amer Fort Resorts' },
];
