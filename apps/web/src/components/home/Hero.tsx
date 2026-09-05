"use client";

import Badge from "../common/Badge";
import Button from "../common/button";
import Container from "../common/container";

export default function Hero() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-col items-center gap-8 text-center">
          <Badge>Built for Modern Development Teams</Badge>

          <h1 className="max-w-4xl text-4xl font-bold leading-none tracking-tight md:text-6xl lg:text-7xl">
            Build Better Software,
            <br />
            Together.
          </h1>

          <p className="max-w-xl text-lg leading-8 text-zinc-400">
            Create projects, manage tasks, collaborate with your team, and ship
            products faster from one workspace.
          </p>

          <div className="flex items-center gap-10">
            <Button
              variant="primary"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Get Started
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                document.getElementById("dashboard-preview")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Live Demo
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
