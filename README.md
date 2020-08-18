This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
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
