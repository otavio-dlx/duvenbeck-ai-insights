# Next.js Framework Documentation

## Introduction

Next.js is a powerful React framework for building full-stack web applications developed by Vercel. It extends React's capabilities with features like server-side rendering (SSR), static site generation (SSG), and hybrid approaches, all optimized through Rust-based JavaScript tooling for high-performance builds. Next.js enables developers to create production-ready applications with automatic code splitting, built-in routing, API routes, and seamless integration between frontend and backend code. The framework supports both the modern App Router (introduced in Next.js 13+) and the traditional Pages Router, offering flexibility for different project needs.

Next.js addresses common challenges in modern web development by providing solutions for routing, data fetching, image optimization, internationalization, and SEO out of the box. It supports React Server Components for efficient server-side rendering, Client Components for interactive UI, and Server Actions for server-side mutations without needing separate API endpoints. The framework's architecture is designed to enable optimal performance with automatic optimizations like lazy loading, prefetching, and intelligent caching strategies while maintaining developer productivity through conventions and best practices.

## Core APIs and Functions

### App Router - Basic Page Structure

The App Router uses a file-system based routing where folders define routes and special files (page.tsx, layout.tsx) define UI components.

```typescript
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Dynamic Routes with generateStaticParams

Create dynamic routes and pre-render pages at build time using generateStaticParams for static site generation.

```typescript
// app/posts/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={content} />
      </article>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Next.js Blog Example`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

### Internationalization with Dynamic Routes

Implement i18n by using dynamic route segments and generateStaticParams to create localized pages.

```typescript
// app/[lang]/layout.tsx
import { i18n, type Locale } from "@/i18n-config";

export const metadata = {
  title: "i18n within app router - Vercel Examples",
  description: "How to do i18n in Next.js 15 within app router",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const { children } = props;

  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}
```
