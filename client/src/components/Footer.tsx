import { Link } from "wouter";
import { Volleyball } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-6 py-4 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-primary font-bold text-lg flex items-center">
              <Volleyball className="mr-2 h-5 w-5" />
              <span>SportConnect</span>
            </Link>
            <span className="text-neutral-300 text-sm ml-2">© 2023 SportConnect, Inc.</span>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-6">
            <Link href="#" className="text-neutral-300 hover:text-primary text-sm">About</Link>
            <Link href="#" className="text-neutral-300 hover:text-primary text-sm">Privacy</Link>
            <Link href="#" className="text-neutral-300 hover:text-primary text-sm">Terms</Link>
            <Link href="#" className="text-neutral-300 hover:text-primary text-sm">Help Center</Link>
            <Link href="#" className="text-neutral-300 hover:text-primary text-sm">Cookies</Link>
            <Link href="#" className="text-neutral-300 hover:text-primary text-sm">Advertising</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
