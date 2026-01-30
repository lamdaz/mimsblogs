import { BlogLayout } from '@/components/blog/BlogLayout';
import { Github, Code, Lightbulb, Heart } from 'lucide-react';

export default function About() {
  return (
    <BlogLayout>
      <div className="container max-w-3xl py-16 md:py-24">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="font-heading text-4xl font-bold text-primary">M</span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            About Mims Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A personal blog by Ragib
          </p>
        </div>
        
        <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
          <p>
            Welcome to <strong className="text-foreground">Mims Blog</strong>, a digital space dedicated to 
            sharing thoughts, stories, and ideas about technology, design, and the 
            craft of building beautiful things.
          </p>
          
          <p>
            This blog serves as a canvas for exploring new concepts, documenting 
            learnings, and connecting with like-minded individuals who share a 
            passion for creating and innovating in the tech space.
          </p>
          
          <p>
            Whether you're a developer, designer, or simply someone curious about 
            the world of technology, you'll find something here that resonates 
            with your interests.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">Tech Insights</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Deep dives into programming, frameworks, and best practices
            </p>
          </div>
          
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">Ideas & Thoughts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Personal perspectives on technology and creativity
            </p>
          </div>
          
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">Passion Projects</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Showcasing builds and experiments along the way
            </p>
          </div>
        </div>

        {/* Connect Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center">
          <h2 className="font-heading text-2xl font-bold">Let's Connect</h2>
          <p className="mt-3 text-muted-foreground">
            Have a question or just want to say hello? Feel free to reach out!
          </p>
          <a 
            href="https://github.com/ragibcs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:scale-105"
          >
            <Github className="h-4 w-4" />
            @ragibcs on GitHub
          </a>
        </div>
      </div>
    </BlogLayout>
  );
}
