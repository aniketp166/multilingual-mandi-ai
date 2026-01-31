import type { AppProps } from 'next/app';
import '../src/styles/globals.css';
import '../src/i18n/config';
import ErrorBoundary from '../src/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}