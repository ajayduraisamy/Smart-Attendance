export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="px-6 py-4 flex justify-between items-center text-sm text-slate-400">
        <p>&copy; {currentYear} Smart Attendance System. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-200 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-200 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-200 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
