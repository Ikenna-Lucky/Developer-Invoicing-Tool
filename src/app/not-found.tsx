import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card text-center max-w-md w-full">
        <div className="text-6xl font-bold text-brand-600 mb-2">404</div>
        <h2 className="mb-2">Page not found</h2>
        <p className="text-gray-500 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
