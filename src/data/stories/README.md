# Editing poll stories

Each topic has its own `.js` file in this directory. Only AI currently contains supplied editorial content. Every bracketed placeholder should be replaced with approved copy.

Edit `headline`, `blurb`, and `reporter` at the top of the file. Add, remove, or reorder entries in `sections`. Use unique section IDs within a page.

```js
{
  id: 'ai-section-1',
  subheading: '[Approved subheading]',
  paragraphs: [
    '[Approved paragraph]',
    [
      'Text before a link ',
      { text: 'link label', href: 'https://example.com/article' },
      ' and text after it.'
    ]
  ],
  flourishId: null,
  flourishUrl: null
}
```

Paragraph strings render as plain text. For inline links, use an array of strings and `{ text, href }` objects as shown above. Raw HTML is not needed.

Set `flourishId` to a published visualization's numeric ID (a string is fine), OR set `flourishUrl` to its public Flourish visualization or embed URL. Leave both null to display an explicit visualization placeholder. Publish the visualization on Flourish first.

## Layout controls

- `src/styles/story.scss`: `--story-text-width` and `--story-chart-width` define the desktop proportions (45fr / 55fr). `--story-column-gap` sets the gutter.
- `--chart-min-height` sets placeholder / stage minimum size. Charts that fit below the headers remain sticky. Taller charts use normal page scrolling instead of a nested scroll area.
- `src/components/story/Scrollytelling.astro`: The chart animation duration (220ms) controls the section fade; `rootMargin` sets the observer reading band. Keep its band and the `nearestStep()` reading line consistent.
- The desktop breakpoint is 901px in the component and stylesheet; update both together.
- Each chart stays inside its corresponding section at every screen size, avoiding duplicate embeds and hidden initialization. Desktop chart containers stick within their section when they fit below the headers; taller charts use ordinary page scrolling. Mobile pairs text and chart in one column.

Charts use Flourish’s official responsive embed script, which manages iframe height:
https://helpcenter.flourish.studio/hc/en-us/articles/8761559763343-Understanding-the-difference-between-Flourish-s-embed-options

Actual chart dimensions and interactions should be checked after real published visualization IDs are supplied.

## Intro paragraphs

`blurb` accepts a string or an array of paragraphs, just like section copy:

```js
blurb: [
  'First introductory paragraph.',
  'Second introductory paragraph.'
],
```

Blank lines inside a string also create separate paragraphs. Arrays can include inline-link segments using the same format as section paragraphs.
