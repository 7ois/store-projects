export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <div className="h-screen px-60 flex items-center">
                {children}
            </div>
        </main>
    );
}
