import { useState } from "react";
import { MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  location: string;
  lat: number;
  lng: number;
}

export default function CoverageRequestForm({ location, lat, lng }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Use type assertion since table may not be in generated types yet
      const { error } = await (supabase as any).from("coverage_requests").insert({
        location_name: location,
        lat,
        lng,
        email: email || null,
      });
      if (error) console.error("Coverage request error:", error);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl bg-green-50 border border-green-200 p-6 text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <h4 className="font-bold text-foreground text-sm">Coverage Requested!</h4>
        <p className="text-xs text-muted-foreground mt-1">
          We've noted your interest in <strong>{location}</strong>. Detailed property data for this area will be added in upcoming updates.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-bold text-foreground text-sm">Limited Coverage Area</h4>
          <p className="text-xs text-muted-foreground mt-1">
            We don't have verified property pricing data for <strong>{location}</strong> yet. 
            The map above shows real places discovered via OpenStreetMap. 
            Request full coverage and we'll add detailed property intelligence for this area.
          </p>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Your email (optional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 rounded-xl text-xs flex-1 max-w-[250px]"
            />
            <Button onClick={handleSubmit} disabled={loading} size="sm" className="h-9 rounded-xl gradient-primary text-primary-foreground shadow-button gap-1.5">
              <Send className="h-3 w-3" /> Request Coverage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
