import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, PenSquare, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    // Get profile id
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      setLoading(false);
      return;
    }

    // Get post counts
    const { data: posts } = await supabase
      .from('posts')
      .select('published')
      .eq('author_id', profile.id);

    if (posts) {
      const published = posts.filter((p) => p.published).length;
      setStats({
        totalPosts: posts.length,
        publishedPosts: published,
        draftPosts: posts.length - published,
      });
    }
    setLoading(false);
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Welcome back!
            </h2>
            <p className="mt-1 text-muted-foreground">
              Here's an overview of your blog.
            </p>
          </div>
          <Link to="/admin/posts/new">
            <Button className="gap-2">
              <PenSquare className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Posts"
            value={loading ? '...' : stats.totalPosts}
            icon={<FileText className="h-4 w-4" />}
            description="All your posts"
          />
          <StatsCard
            title="Published"
            value={loading ? '...' : stats.publishedPosts}
            icon={<Eye className="h-4 w-4" />}
            description="Live on your blog"
          />
          <StatsCard
            title="Drafts"
            value={loading ? '...' : stats.draftPosts}
            icon={<TrendingUp className="h-4 w-4" />}
            description="Work in progress"
          />
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-heading text-lg font-semibold">Quick Actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/posts/new">
              <Button variant="outline" size="sm">
                Write a new post
              </Button>
            </Link>
            <Link to="/admin/posts">
              <Button variant="outline" size="sm">
                Manage posts
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                View your blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
