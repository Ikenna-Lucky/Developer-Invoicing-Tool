import { BilldLogo } from "@/components/ui/BilldLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <BilldLogo href="/" size="md" />
        </div>
        {children}
      </div>
    </div>
  );
}
