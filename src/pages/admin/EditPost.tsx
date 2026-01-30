import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PostEditor } from '@/components/admin/PostEditor';

export default function EditPost() {
  const { id } = useParams();

  return (
    <AdminLayout title={id ? 'Edit Post' : 'New Post'}>
      <PostEditor postId={id} />
    </AdminLayout>
  );
}
