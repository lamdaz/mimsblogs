import { ReactNode } from 'react';
import { BlogHeader } from './BlogHeader';
import { BlogFooter } from './BlogFooter';

interface BlogLayoutProps {
  children: ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
