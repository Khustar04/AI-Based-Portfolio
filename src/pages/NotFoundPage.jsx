import { Home } from "lucide-react";
import Button from "../components/Button";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-8xl font-extrabold text-blue-600 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <Button to="/" variant="primary" size="lg" icon={Home}>
          Back to Home
        </Button>
      </div>
    </main>
  );
}
