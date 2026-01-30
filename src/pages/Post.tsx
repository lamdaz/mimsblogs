import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface PostData {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  published_at: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  } | null;
}

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        cover_image,
        published_at,
        profiles (
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <BlogLayout>
        <article className="container max-w-3xl py-12">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="mb-8 h-4 w-1/4" />
          <Skeleton className="mb-4 aspect-video w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </article>
      </BlogLayout>
    );
  }

  if (notFound || !post) {
    return (
      <BlogLayout>
        <div className="container flex flex-col items-center justify-center py-24">
          <h1 className="font-heading text-4xl font-bold">Post Not Found</h1>
          <p className="mt-4 text-muted-foreground">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="mt-8">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const authorName = post.profiles?.full_name || 'Anonymous';
  const publishDate = post.published_at
    ? format(new Date(post.published_at), 'MMMM d, yyyy')
    : '';

  return (
    <BlogLayout>
      <article className="container max-w-3xl py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-2">
              {post.profiles?.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={authorName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium">
                  {authorName.charAt(0)}
                </div>
              )}
              <span className="font-medium text-foreground">{authorName}</span>
            </div>
            <span>·</span>
            <time>{publishDate}</time>
          </div>
          <div className="mt-4">
            <ShareButtons title={post.title} />
          </div>
        </header>

        {post.cover_image && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={post.cover_image}
              alt={post.title}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-4 leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            )
          ))}
        </div>

        {/* Author Bio */}
        {post.profiles?.bio && (
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex items-start gap-4">
              {post.profiles?.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={authorName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium">
                  {authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium">{authorName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.profiles.bio}
                </p>
              </div>
            </div>
          </div>
        )}
      </article>
    </BlogLayout>
  );
}
