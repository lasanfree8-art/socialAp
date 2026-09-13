import "./globals.css";

export const metadata = {
  title: "SocialAp",
  description: "Your own social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
