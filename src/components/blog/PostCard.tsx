import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image: string | null;
    published_at: string | null;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const authorName = post.profiles?.full_name || 'Anonymous';
  const publishDate = post.published_at 
    ? format(new Date(post.published_at), 'MMMM d, yyyy')
    : 'Draft';

  if (featured) {
    return (
      <Link to={`/post/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-card shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
          <div className="aspect-[16/9] overflow-hidden">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
                <span className="font-heading text-6xl font-bold text-primary/20">M</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {authorName}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/50" />
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {publishDate}
              </span>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="line-clamp-2 text-white/70 md:text-lg">
                {post.excerpt}
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
              Read Article
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} className="group block">
      <article className="flex gap-5 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-md">
        {post.cover_image ? (
          <div className="hidden h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl sm:block">
            <img
              src={post.cover_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="hidden h-28 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-transparent sm:flex">
            <span className="font-heading text-3xl font-bold text-primary/30">M</span>
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {authorName}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {publishDate}
            </span>
          </div>
          <h3 className="mb-2 font-heading text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="hidden items-center self-center sm:flex">
          <ArrowRight className="h-5 w-5 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </article>
    </Link>
  );
}
