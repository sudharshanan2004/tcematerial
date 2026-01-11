-- Create categories table for organizing materials
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  material_type TEXT NOT NULL CHECK (material_type IN ('notes', 'question_paper', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  uploaded_by UUID NOT NULL,
  subject TEXT,
  semester INTEGER,
  year INTEGER,
  college TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_materials table for bookmarks
CREATE TABLE public.saved_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, material_id)
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_materials ENABLE ROW LEVEL SECURITY;

-- Categories are readable by everyone
CREATE POLICY "Categories are viewable by everyone"
ON public.categories
FOR SELECT
USING (true);

-- Materials policies
CREATE POLICY "Materials are viewable by everyone"
ON public.materials
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload materials"
ON public.materials
FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own materials"
ON public.materials
FOR UPDATE
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own materials"
ON public.materials
FOR DELETE
USING (auth.uid() = uploaded_by);

-- Saved materials policies
CREATE POLICY "Users can view their own saved materials"
ON public.saved_materials
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save materials"
ON public.saved_materials
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave materials"
ON public.saved_materials
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updating updated_at on materials
CREATE TRIGGER update_materials_updated_at
BEFORE UPDATE ON public.materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Handwritten Notes', 'notes', 'Handwritten class notes and study materials', 'PenTool'),
('Question Papers', 'question-papers', 'Previous year examination papers', 'FileQuestion'),
('Assignments', 'assignments', 'Assignment solutions and references', 'ClipboardList'),
('Lab Manuals', 'lab-manuals', 'Laboratory practical manuals', 'FlaskConical'),
('Reference Books', 'reference-books', 'Digital reference materials', 'BookOpen'),
('Other', 'other', 'Miscellaneous study materials', 'FolderOpen');

-- Create storage bucket for materials
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true);

-- Storage policies for materials bucket
CREATE POLICY "Materials files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'materials');

CREATE POLICY "Authenticated users can upload materials files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'materials' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own materials files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'materials' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own materials files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'materials' AND auth.role() = 'authenticated');