import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Save, ArrowLeft } from 'lucide-react';

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load post',
        variant: 'destructive',
      });
    } else if (data) {
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || '');
      setContent(data.content);
      setCoverImage(data.cover_image || '');
      setPublished(data.published);
    }
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // If slug is empty (non-ASCII text like Bengali), generate a timestamp-based slug
    if (!slug) {
      return `post-${Date.now()}`;
    }
    return slug;
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!postId && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to save posts',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Get user's profile id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        throw new Error('Profile not found');
      }

      const postData = {
        title,
        slug: slug || generateSlug(title),
        excerpt: excerpt || null,
        content,
        cover_image: coverImage || null,
        published,
        published_at: published ? new Date().toISOString() : null,
        author_id: profile.id,
      };

      if (postId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Post updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('posts')
          .insert(postData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Post created successfully',
        });
        navigate('/admin/posts');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save post',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/posts')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">
              {published ? 'Published' : 'Draft'}
            </Label>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter post title..."
            className="font-heading text-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of your post..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {coverImage && (
            <div className="mt-2 aspect-video overflow-hidden rounded-md">
              <img 
                src={coverImage} 
                alt="Cover preview" 
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows={15}
            className="font-body"
          />
        </div>
      </div>
    </div>
  );
}
