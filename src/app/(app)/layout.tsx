export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <div className="relative flex min-h-screen flex-1 flex-col">
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}
