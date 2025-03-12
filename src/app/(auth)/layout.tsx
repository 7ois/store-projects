import { Noto_Sans_Thai } from "next/font/google";

const noto = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <div
        className={`${noto.className} font-[400] h-screen flex items-center px-5
        lg:px-40
        2xl:px-60`}
      >
        {children}
      </div>
    </main>
  );
}
