import Badge from "../common/Badge"; 
import Button from "../common/button";
import Container from "../common/container"; 

export default function Hero() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-col items-center gap-8 text-center">
          <Badge>Built for Modern Development Teams</Badge>

          <h1 className="md:text-6xl lg:text-7xl max-w-4xl text-4xl leading-none font-bold tracking-tight">
            Build Better Software, 
            <br/>
            Together.
            </h1>

          <p className="max-w-xl text-lg leading-8 text-zinc-400">
            Create projects, manage tasks, collaborate with your team, and ship
            products faster from one workspace.
          </p>

          <div className="flex sm:flex-row gap-10 items-center">
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">Live Demo</Button>
          </div>
        </div> 

      </Container>
    </section>
  );
}
