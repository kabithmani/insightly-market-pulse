CREATE TABLE public.scraped_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_query text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  radius_km integer NOT NULL DEFAULT 25,
  properties jsonb NOT NULL DEFAULT '[]'::jsonb,
  source text NOT NULL DEFAULT 'osm',
  scraped_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '1 hour')
);

CREATE INDEX idx_scraped_properties_location ON public.scraped_properties (lat, lng, radius_km);
CREATE INDEX idx_scraped_properties_expires ON public.scraped_properties (expires_at);

ALTER TABLE public.scraped_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached properties"
  ON public.scraped_properties FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert cached properties"
  ON public.scraped_properties FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete expired cache"
  ON public.scraped_properties FOR DELETE
  TO service_role
  USING (true);