import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-primary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo/Brand section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary-100">
            <Lock className="w-7 h-7 text-primary-700" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
            <p className="text-neutral-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>
        </div>

        {/* Login card */}
        <Card className="shadow-lg border-neutral-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-neutral-900">Sign In</CardTitle>
            <p className="text-sm text-neutral-500">Use your Kimi account to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors h-11"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Sign in with Kimi
            </Button>
            <p className="text-xs text-neutral-400 text-center mt-4">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </CardContent>
        </Card>

        {/* Security note */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-xs text-primary-800 flex items-center gap-2">
            <Lock className="w-4 h-4" strokeWidth={2} />
            Your login is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
