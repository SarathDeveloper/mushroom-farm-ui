UPDATE ""public"".""Product""
SET ""images"" = array_replace(""images"", 'https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=1000&auto=format&fit=crop', '/gallery/products/button-mushrooms-Dj92oXDo.jpg')
WHERE ""images"" @> ARRAY['https://images.unsplash.com/photo-1611105637889-3fa70db2b271?q=80&w=1000&auto=format&fit=crop']::text[];
