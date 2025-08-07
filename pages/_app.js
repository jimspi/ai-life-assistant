import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const { session, ...otherPageProps } = pageProps;
  
  return (
    <SessionProvider session={session}>
      <Component {...otherPageProps} />
    </SessionProvider>
  );
}
