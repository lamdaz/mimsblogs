import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PostsTable } from '@/components/admin/PostsTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function Posts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
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

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, published, published_at, created_at')
      .eq('author_id', profile.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    const updateData = {
      published,
      published_at: published ? new Date().toISOString() : null,
    };

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: published ? 'Post published' : 'Post unpublished',
      });
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, ...updateData } : p
        )
      );
    }
  };

  return (
    <AdminLayout title="All Posts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage all your blog posts here.
          </p>
          <Link to="/admin/posts/new">
            <Button className="gap-2">
              <PenSquare className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <PostsTable
            posts={posts}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
          />
        )}
      </div>
    </AdminLayout>
  );
}
