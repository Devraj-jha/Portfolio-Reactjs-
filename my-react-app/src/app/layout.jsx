import './globals.css';
import '../App.css';
import { AppShell } from '../components/AppShell/AppShell';

export const metadata = {
  title: 'Devraj Jha — Portfolio',
  description: 'Devraj Jha — Portfolio. Programmer, problem solver, and web developer.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Theme flash prevention — runs before React hydrates */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem('portfolio-theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            })();
          `
        }} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
