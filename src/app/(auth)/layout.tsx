export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative flex h-screen flex-col">{children}</div>;
}
