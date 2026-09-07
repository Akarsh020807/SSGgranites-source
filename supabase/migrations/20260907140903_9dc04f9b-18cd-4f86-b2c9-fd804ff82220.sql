DROP POLICY "Admins can read leads" ON public.leads;
DROP POLICY "Admins can update leads" ON public.leads;
DROP POLICY "Admins can delete leads" ON public.leads;
DROP FUNCTION IF EXISTS public.is_admin(UUID);

CREATE POLICY "Admins can read leads" ON public.leads
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()));
CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()));
CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()));