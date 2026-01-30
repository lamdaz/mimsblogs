import { BlogLayout } from '@/components/blog/BlogLayout';
import { Lightbulb, Heart, PenTool } from 'lucide-react';

export default function About() {
  return (
    <BlogLayout>
      <div className="container max-w-3xl py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="font-heading text-4xl font-bold text-primary">
              M
            </span>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            About Mims Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Written by Mim Monisha
          </p>
        </div>

        {/* About Content */}
        <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
          <p>
            Welcome to <strong className="text-foreground">Mims Blog</strong> —
            a personal writing space by <strong className="text-foreground">Mim Monisha</strong>.
            This blog is a home for poems, short stories, and words shaped by
            emotion, imagination, and lived moments.
          </p>

          <p>
            Mim writes about feelings that are hard to explain, moments that
            linger quietly, and stories inspired by everyday life. Sometimes
            the words are soft and reflective, sometimes raw and honest — but
            they always come from a deeply personal place.
          </p>

          <p>
            Mims Blog exists for readers who love language, who find comfort
            in poetry, and who enjoy getting lost in short stories that feel
            close to the heart.
          </p>
        </div>

        {/* Writing Focus */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <PenTool className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">
              Poetry
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Verses written from emotion, silence, and self-reflection
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">
              Short Stories
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Small stories with deep emotions and meaningful endings
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">
              Personal Writing
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thoughts, feelings, and reflections shared honestly
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center">
          <h2 className="font-heading text-2xl font-bold">
            Words, Feelings, Stories
          </h2>
          <p className="mt-3 text-muted-foreground">
            Thank you for being here and taking the time to read.
            May these words feel like home.
          </p>
        </div>
      </div>
    </BlogLayout>
  );
}
