import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Multilingual Mandi - Real-time linguistic bridge for local trade" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%2310b981'/><stop offset='100%' style='stop-color:%23059669'/></linearGradient></defs><circle cx='16' cy='16' r='15' fill='url(%23g)' stroke='%23047857'/><g fill='white'><path d='M6 6h2l1.68 8.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L25 8H8'/><path d='M6 6L4 4'/><circle cx='12' cy='24' r='1.5'/><circle cx='22' cy='24' r='1.5'/></g><rect x='2' y='2' width='2' height='6' fill='%23FF9933' rx='1'/><rect x='2' y='8' width='2' height='6' fill='white' rx='1'/><rect x='2' y='14' width='2' height='6' fill='%23138808' rx='1'/></svg>" type="image/svg+xml" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#10b981" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}