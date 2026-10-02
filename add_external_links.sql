-- Jalankan script ini di menu "SQL Editor" pada dashboard Supabase Anda.
-- Script ini akan menambahkan kolom `external_links` bertipe JSONB ke tabel `projects` dan `certificates`

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]'::jsonb;
