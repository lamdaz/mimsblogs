import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { PenLine, LogIn, Feather } from 'lucide-react';

export function BlogHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Feather className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            Mims Blog
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link 
            to="/" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            About
          </Link>
          
          {user ? (
            <>
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <PenLine className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gap-2 shadow-md">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
