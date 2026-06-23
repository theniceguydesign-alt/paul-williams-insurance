import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-neutral-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-50 mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-secondary-600" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-4xl font-bold text-neutral-900">404</CardTitle>
          <p className="text-neutral-500 text-sm mt-2">Page not found</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-neutral-600 text-sm">
            Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
          </p>
          <Button asChild className="w-full bg-primary-600 hover:bg-primary-700 text-white h-10 rounded-lg">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
