// Category destinations for the shared navigation.
export const categories = [
  { title: 'NU Issues', slug: 'nu-issues' },
  { title: 'AI', slug: 'ai' },
  { title: 'Wellbeing', slug: 'wellbeing' },
  { title: 'Career', slug: 'career' },
  { title: 'Sports', slug: 'sports' },
  { title: 'National Politics', slug: 'national-politics' },
  
];

export const navigation = [
  { title: 'Home', slug: '' },
  ...categories,
  { title: 'About', slug: 'about' },
];

// Respect the GitHub Pages base; also works if the site is hosted at / later.
export const pageUrl = (slug = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${slug ? `${slug}/` : ''}`;
