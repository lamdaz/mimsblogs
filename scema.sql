-- ============================================
-- MIMS PERSONAL BLOGS - DATABASE SCHEMA
-- ============================================
-- This file contains all the SQL queries needed to set up
-- the database for the Mims Personal Blogs project.
-- Run these in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================
-- ============================================
-- 1. CREATE PROFILES TABLE
-- ============================================
-- Stores user profile information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
-- ============================================
-- 2. CREATE POSTS TABLE
-- ============================================
-- Stores blog posts
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- RLS Policies for posts
CREATE POLICY "Published posts are viewable by everyone" 
  ON public.posts FOR SELECT 
  USING (published = true);
CREATE POLICY "Authors can view their own posts" 
  ON public.posts FOR SELECT 
  USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Authors can create posts" 
  ON public.posts FOR INSERT 
  WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Authors can update their own posts" 
  ON public.posts FOR UPDATE 
  USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Authors can delete their own posts" 
  ON public.posts FOR DELETE 
  USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
-- ============================================
-- 3. CREATE USER ROLES SYSTEM
-- ============================================
-- For managing admin and user roles
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- RLS Policy for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
-- ============================================
-- 4. SECURITY DEFINER FUNCTION FOR ROLE CHECK
-- ============================================
-- This function checks if a user has a specific role
-- Used to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
-- ============================================
-- 5. AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
-- Automatically updates the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
-- Apply trigger to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- Apply trigger to posts table
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- ============================================
-- 6. AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================
-- Automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
-- ============================================
-- ============================================
-- HOW TO ADD AN ADMIN USER
-- ============================================
-- ============================================
-- STEP 1: First, find the user's ID from auth.users table
-- Replace 'user@example.com' with the actual email
SELECT id, email FROM auth.users WHERE email = 'user@example.com';
-- STEP 2: Add the admin role using the user_id from Step 1
-- Replace 'USER_ID_HERE' with the actual UUID from Step 1
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_HERE', 'admin');
-- ============================================
-- QUICK ADMIN SETUP (Combined Query)
-- ============================================
-- This adds admin role to a user by their email address
-- Replace 'admin@example.com' with the actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'admin@example.com';
-- ============================================
-- EXAMPLE: Add admin for admin@droqai.tech
-- ============================================
-- This is the actual query used to make you admin:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'admin@droqai.tech';
-- ============================================
-- USEFUL QUERIES
-- ============================================
-- View all users with their roles
SELECT 
  u.email,
  u.id as user_id,
  p.full_name,
  r.role
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN public.user_roles r ON r.user_id = u.id;
-- View all admins
SELECT 
  u.email,
  p.full_name
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
JOIN public.profiles p ON p.user_id = u.id
WHERE r.role = 'admin';
-- Remove admin role from a user
DELETE FROM public.user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND role = 'admin';
-- View all posts with author info
SELECT 
  p.title,
  p.slug,
  p.published,
  p.published_at,
  pr.full_name as author
FROM public.posts p
JOIN public.profiles pr ON pr.id = p.author_id
ORDER BY p.created_at DESC;
-- Count posts by status
SELECT 
  published,
  COUNT(*) as count
FROM public.posts
GROUP BY published;
