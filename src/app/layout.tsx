import "./globals.css";
export const metadata = {
  title: "จัดเก็บและสืบค้นโครงงาน คณะบริหารธุรกิจ มทร.อีสาน",
  description: "Delicious meals, shared by a food-loving community.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
