export default function DashboardPage(): React.ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome! You have successfully logged in or signed up.
        </p>
      </div>
    </main>
  );
}