This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Download Latest Static Data from the egghead API into the `./data` Directory

The following commands download data into json files and place them into the `./data` directory:

```bash
yarn load-instructors
```

Other types of data can also be downloaded by following that pattern:

> See the egghead v1 API for available "types": `https://egghead.io/api/v1/${type}`

```bash
yarn load-lessons
yarn load-series
```

## How Static Data is Loaded

1.  Utilities in `./lib` read the json files from the `./data` directory (see `./lib/courses.js`)
2.  Routes access these utilities to load the json data (see `./pages/courses.js` )
3.  The [https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation](`getStaticPaths` static function) pre-renders pages with the data (again, see `./pages/courses.js`)
