
-- Tighten coverage_requests: only service role may read/write directly.
-- Public submissions must go through the submit-coverage-request edge function.
DROP POLICY IF EXISTS "Anyone can request coverage" ON public.coverage_requests;
DROP POLICY IF EXISTS "Authenticated users can view requests" ON public.coverage_requests;

-- Revoke broad grants; only service_role retains access.
REVOKE ALL ON public.coverage_requests FROM anon;
REVOKE ALL ON public.coverage_requests FROM authenticated;
GRANT ALL ON public.coverage_requests TO service_role;

-- Validation constraints for data integrity
ALTER TABLE public.coverage_requests
  ADD CONSTRAINT coverage_requests_lat_range CHECK (lat >= -90 AND lat <= 90),
  ADD CONSTRAINT coverage_requests_lng_range CHECK (lng >= -180 AND lng <= 180),
  ADD CONSTRAINT coverage_requests_location_len CHECK (char_length(location_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT coverage_requests_email_len CHECK (email IS NULL OR char_length(email) <= 255),
  ADD CONSTRAINT coverage_requests_email_format CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- Service-role-only policies (edge function uses service role)
CREATE POLICY "Service role manages coverage requests"
  ON public.coverage_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
