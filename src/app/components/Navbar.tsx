"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";
import ShoppingCart from "./ShoppingCart";

type NavbarProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");

  const searchValue = searchQuery ?? localQuery;
  const setSearchValue = onSearchChange ?? setLocalQuery;

  const handleSearchSubmit = () => {
    router.push(`/?search=${encodeURIComponent(searchValue)}`);
    setSearchValue("");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 w-full bg-black text-white flex items-center justify-between h-16 py-5 px-10 gap-10">
      <Link
        href="/"
        className="text-green-500 text-2xl font-bold no-underline transition duration-300 hover:scale-110"
      >
        LOGO
      </Link>

      <div className="md:flex hidden min-w-0 flex-1 max-w-md">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSubmit={handleSearchSubmit}
          compact
        />
      </div>

      <ul className="md:flex gap-10 justify-start text-lg hidden">
        <Link
          href="/about"
          className="text-white no-underline transition duration-300 hover:scale-110"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-white no-underline transition duration-300 hover:scale-110"
        >
          Contact
        </Link>
        <ShoppingCart />
      </ul>

      <div className="flex items-center gap-4 md:hidden">
        <ShoppingCart />
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="flex cursor-pointer flex-col justify-center items-center gap-1 w-8 h-8 transition duration-300 hover:scale-110 md:hidden"
        >
          <span className="block w-6 h-0.5 bg-white transition duration-300 hover:scale-120"></span>
          <span className="block w-6 h-0.5 bg-white transition duration-300 hover:scale-120"></span>
          <span className="block w-6 h-0.5 bg-white transition duration-300 hover:scale-120"></span>
        </button>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 right-0 top-full mt-0 flex flex-col gap-4 bg-black py-5 px-10 shadow-lg md:hidden"
        >
          <Link
            href="/"
            className="origin-left text-white no-underline transition duration-300 hover:scale-110"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="origin-left text-white no-underline transition duration-300 hover:scale-110"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="origin-left text-white no-underline transition duration-300 hover:scale-110"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <div
            className="origin-left flex items-center gap-2 text-white no-underline transition duration-300 hover:scale-110"
            onClick={closeMenu}
          ></div>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={() => {
              handleSearchSubmit();
              closeMenu();
            }}
            compact
          />
        </div>
      )}
    </nav>
  );
}
