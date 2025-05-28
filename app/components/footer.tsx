export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-500 text-sm px-6 py-4 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Watchtower. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Crafted with ❤️ by Nattkarn</p>
      </div>
    </footer>
  );
}