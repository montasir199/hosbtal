export default function SignOutButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
    >
      تسجيل الخروج
    </button>
  );
}
