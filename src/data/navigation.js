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
  ...['nu-issues','ai', 'wellbeing', 'career', 'sports', 'national-politics']
    .map(slug => categories.find(category => category.slug === slug)),
  { title: 'Methodology', slug: 'methodology' },
  { title: 'Quiz', href: 'https://dailynorthwestern.com/2026/11/09/games/polling-quiz-how-well-do-you-know-your-peers-2/' },
];

// Respect the GitHub Pages base; also works if the site is hosted at / later.
export const pageUrl = (slug = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${slug ? `${slug}/` : ''}`;
