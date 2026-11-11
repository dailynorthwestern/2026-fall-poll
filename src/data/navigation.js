// Category destinations for the shared navigation.
export const categories = [
  { title: 'Sports', slug: 'sports' },
  { title: 'Wellbeing', slug: 'wellbeing' },
  { title: 'Career', slug: 'career' },
  { title: 'AI', slug: 'ai' },
  { title: 'National Politics', slug: 'national-politics' },
  { title: 'NU Issues', slug: 'nu-issues' },
];

export const navigation = [
  { title: 'Home', slug: '' },
  ...categories,
  { title: 'About', slug: 'about' },
];

// Respect the GitHub Pages base; also works if the site is hosted at / later.
export const pageUrl = (slug = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${slug ? `${slug}/` : ''}`;
