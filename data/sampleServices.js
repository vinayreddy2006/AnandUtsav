// // /data/sampleServices.js
// export const services = [
//   {
//     name: 'Intricate Bridal Mehndi Package',
//     description: 'Full bridal mehndi for both hands and feet, using 100% organic henna.',
//     images: ['/images/services/bridalmehndi.jpg'],
//     priceInfo: { amount: 15000, unit: 'per package' },
//   },
//   {
//     name: 'Luxury Laser-Cut Wedding Invitations',
//     description: 'Design and printing of 200 premium laser-cut invitation cards with custom wax seals.',
//     images: ['/images/services/lasercards.jpg'],
//     priceInfo: { amount: 25000, unit: 'per 200 cards' },
//   },
//   {
//     name: 'Grand Wedding Fireworks Display',
//     description: 'A spectacular 15-minute aerial fireworks show to celebrate your special occasion.',
//     images: ['/images/services/weddingshow.jpg'],
//     priceInfo: { amount: 90000, unit: 'per show' },
//   },
// ];
export const services = [
  { name: 'Bridal Mehndi Package', description: 'Full bridal mehndi for both hands and feet.', images: ['/images/services/mehndi1.jpg'], priceInfo: { amount: 15000, unit: 'per package' }, categorySlug: 'mehndi-artists' },
  { name: 'Luxury Wedding Invitations', description: '200 premium wedding invitations with wax seals.', images: ['/images/services/invites.jpg'], priceInfo: { amount: 25000, unit: 'per 200 cards' }, categorySlug: 'invitations' },
  { name: 'Grand Fireworks Show', description: '15-minute aerial fireworks display.', images: ['/images/services/fireworks.jpg'], priceInfo: { amount: 90000, unit: 'per show' }, categorySlug: 'fireworks' },
  { name: 'Royal Catering Buffet', description: 'Multi-cuisine buffet for 300 guests.', images: ['/images/services/catering.jpg'], priceInfo: { amount: 150000, unit: 'per event' }, categorySlug: 'catering' },
  { name: 'Wedding Photography Package', description: 'Full wedding photography + album.', images: ['/images/services/photography.jpg'], priceInfo: { amount: 120000, unit: 'per wedding' }, categorySlug: 'photography' },
  { name: 'Stage Decorations', description: 'Elegant decoration with flowers, lights, and drapes.', images: ['/images/services/decorations.jpg'], priceInfo: { amount: 80000, unit: 'per event' }, categorySlug: 'decorations' }, // ✅ fixed
  { name: 'Bridal Makeup', description: 'Complete bridal makeup package with trial.', images: ['/images/services/makeup.jpg'], priceInfo: { amount: 25000, unit: 'per package' }, categorySlug: 'makeup' },
  { name: 'Rock Band Live Show', description: '4-hour live music performance.', images: ['/images/services/musicband.jpg'], priceInfo: { amount: 60000, unit: 'per show' }, categorySlug: 'music-bands' },
  { name: 'Luxury Wedding Venue', description: 'Banquet hall with seating for 500 guests.', images: ['/images/services/venue.jpg'], priceInfo: { amount: 200000, unit: 'per event' }, categorySlug: 'venues' },
  { name: 'Luxury Car Rentals', description: 'Premium cars with chauffeur service.', images: ['/images/services/car.jpg'], priceInfo: { amount: 30000, unit: 'per car per day' }, categorySlug: 'transport' },
];
