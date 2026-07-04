import Link from "next/link";
import Container from "./container";

export default function Footer() {
  return (
    <footer className=" mt-32 border-t border-zinc-800">
      <Container>
        <div className="flex flex-col gap-10 py-16">
          <h3 className="text-3xl font-bold">DevSpace</h3>

          <p className="text-zinc-400">Build better software, together.</p>

          <div className="grid grid-cols-1 md:grid-cols-3" >
            <div className="flex flex-col gap-2">
              <Link className="font-semibold mb-4" href="">
                Product
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Features
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Pricing
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Roadmap
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link className="font-semibold mb-4" href="">
                Company
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                About
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Contact
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Privacy
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link className="font-semibold mb-4" href="">
                Resource
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Document
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Github
              </Link>
              <Link
                className="text-zinc-400 hover:text-white transition-colors"
                href=""
              >
                Support
              </Link>
            </div>
          </div>
          <p>@ 2026 DevSpace. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
