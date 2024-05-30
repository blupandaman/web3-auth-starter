import { Footer } from "../_components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      {children}

      <Footer />
    </div>
  );
}
