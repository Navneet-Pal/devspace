import { NAV_LINKS } from "@/constant/Navbar";
import Button from "../UI/Button";
import Link from "next/link";
import Container from "../UI/container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090B]/80 backdrop-blur-xl">
      <Container>
        <nav className="flex h-18 items-center justify-between ">
          <h1 className="text-2xl font-bold">DevSpace</h1>
          <img />

          <div className="flex gap-10">
            {NAV_LINKS?.map((item) => (
              <Link
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                key={item?.label}
                href={item?.href}
              >
                {item?.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-6 items-center">
            <Button variant="primary">Login</Button>
            <Button variant="secondary">Get Started</Button>
          </div>
        </nav>
      </Container>
    </header>
  );
}
