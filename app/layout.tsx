import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'Jeena Baby Tracker',
  description: 'Minimal baby log with realtime sync',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', maxWidth:900, margin:'0 auto'}}>
        <Nav />
        <main style={{padding:16}}>{children}</main>
      </body>
    </html>
  );
}
