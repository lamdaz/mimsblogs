import { Link } from 'react-router-dom';
import { Feather, Github, Heart } from 'lucide-react';

export function BlogFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                <Feather className="h-5 w-5" />
              </div>
            <span className="font-heading text-xl font-bold">Mims Blog</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Thoughts, stories, and ideas worth sharing.
            </p>
          </div>

          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>

          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border/40 pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Developed with</span>
            <Heart className="h-4 w-4 fill-primary text-primary" />
            <span>by</span>
            <a 
              href="https://github.com/ragibcs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              Ragib
            </a>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Mims Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
