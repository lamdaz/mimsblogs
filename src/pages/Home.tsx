import { useEffect, useState } from 'react';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { PostCard } from '@/components/blog/PostCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, BookOpen, TrendingUp } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        slug,
        title,
        excerpt,
        cover_image,
        published_at,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Welcome to Mims
            </div>
            <h1 className="animate-fade-in font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
              Thoughts, Stories &{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Ideas
              </span>
            </h1>
            <p className="mt-6 animate-slide-up text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.1s' }}>
              A personal space for exploring technology, design, and the art of 
              building beautiful things. Join me on this journey of discovery.
            </p>
            
            {/* Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                <span><strong className="text-foreground">{posts.length}</strong> Articles</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Always Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container py-16 md:py-24">
        {loading ? (
          <div className="space-y-8">
            <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="font-heading text-2xl font-semibold">
              No posts yet
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              The blog is still warming up. Check back soon for insightful articles and stories!
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post */}
            {featuredPost && (
              <div>
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Featured Article
                  </h2>
                </div>
                <PostCard post={featuredPost} featured />
              </div>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div>
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent Posts
                  </h2>
                </div>
                <div className="space-y-2">
                  {recentPosts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Newsletter/CTA Section */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Thanks for Reading!
            </h2>
            <p className="mt-4 text-muted-foreground">
              If you enjoyed the articles, feel free to explore more or connect with me on GitHub.
            </p>
            <a 
              href="https://github.com/ragibcs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Follow on GitHub
            </a>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
}
