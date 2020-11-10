This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies:

```bash
yarn
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.mdx`. The page auto-updates as you edit the file.

## Running the Tests

```bash
npx cypress run
```

To run just a single spec file, e.g.:

```bash
npx cypress run --spec "cypress/integration/spec.js"
```

### Running the Tests in the Cypress Test Runner

```bash
npx cypress open
```

## MDX Layouts

The `next-mdx-enhanced` package allows us to assign layouts to specific pages as well as a default layout. These are stored in `/src/layouts` and are configurable via frontmatter in `.mdx` files.

```md
---
layout: 'ultimate-guide'
title: 'an Ultimate Guide'
---
```

This will use `/src/layouts/ultimate-guide.tsx` as a layout.
