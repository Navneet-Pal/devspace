import Link from "next/link";
import Container from "./container";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-zinc-800">
      <Container>
        <div className="flex flex-col gap-12 py-16">
          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-bold">
              DevSpace
            </Link>

            <p className="mt-3 max-w-md text-zinc-400">
              Build better software, collaborate with your team, and manage your
              entire development workflow from one workspace.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 font-semibold">Product</h3>

              <Link
                href="#dashboard-preview"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Workspaces
              </Link>

              <Link
                href="#dashboard-preview"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Projects
              </Link>

              <Link
                href="#dashboard-preview"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Tasks & Kanban
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Documentation
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                File Management
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Git Integration
              </Link>
            </div>

            {/* Collaboration */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 font-semibold">Collaboration</h3>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Team Members
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Invitations
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Comments
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Communication
              </Link>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Notifications
              </Link>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-3">
              <h3 className="mb-2 font-semibold">Resources</h3>

              <Link
                href="#features"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Features
              </Link>

              <Link
                href="#dashboard-preview"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Product Preview
              </Link>

              <Link
                href="/register"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                Login
              </Link> 
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-zinc-800 pt-6">
            <p className="text-sm text-zinc-500">
              © 2026 DevSpace. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
