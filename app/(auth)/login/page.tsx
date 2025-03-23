import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="mt-2 text-sm text-gray-500">
            AI Podcaster SaaSにログイン
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
} 