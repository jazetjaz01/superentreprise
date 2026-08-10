import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-4">
      <div className="flex items-center justify-center px-6 py-16 lg:col-span-3">
        {children}
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/images/magasin1.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
