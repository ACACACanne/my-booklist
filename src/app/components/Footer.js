// app/components/Footer.js

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t border-gray-200 bg-white text-sm text-gray-600">
      <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
}
