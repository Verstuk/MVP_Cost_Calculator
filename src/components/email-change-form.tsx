"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";

export default function EmailChangeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!email) {
      setMessage({ error: "Please enter a new email address" });
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email });

      if (error) {
        setMessage({ error: error.message });
      } else {
        setMessage({
          success:
            "Verification email sent. Please check your inbox to confirm the email change.",
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({
        error: "An unexpected error occurred. Please try again.",
      });
      console.error("Email change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">New Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your new email address"
          required
        />
      </div>

      {message && <FormMessage message={message} />}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending verification..." : "Change Email"}
        </Button>
      </div>
    </form>
  );
}
