export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.__DEBUG_LOG = window.__DEBUG_LOG || [];',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
