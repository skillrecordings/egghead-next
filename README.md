This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

We are using ui-devtools, which is awesome for Tailwind apps, but it requires a license. If you have a license, no changes
are required, but if you don't have a license you'll want to run Yarn without installing optional dependencies:

```bash
yarn install --ignore-optional
```

Now, run the development server:

```bash
vercel dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.mdx`. The page auto-updates as you edit the file.

## MDX Layouts

The `next-mdx-enhanced` package allows us to assign layouts to specific pages as well as a default layout. These are stored in `/src/layouts` and are configurable via frontmatter in `.mdx` files.

```md
---
layout: 'ultimate-guide'
title: 'an Ultimate Guide'
---
```

This will use `/src/layouts/ultimate-guide.tsx` as a layout.
