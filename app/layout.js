import "./globals.css";

export const metadata = {
  title: "Movie Finder",
  description:
    "Browse, search, and save your favourite movies. Powered by OMDb. Built for Jeevan — Rishabh Chaudhary.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
