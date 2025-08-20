import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: ConfirmationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "AutoCheck Pro <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to AutoCheck Pro!",
      html: `
        <h1>Welcome to AutoCheck Pro${name ? `, ${name}` : ''}!</h1>
        <p>Thank you for signing up. Your account has been created successfully.</p>
        <p>You can now access our powerful automotive inspection platform with features like:</p>
        <ul>
          <li>Digital check-in processes</li>
          <li>Parts and service management</li>
          <li>Client portal access</li>
          <li>Real-time vehicle inspection tracking</li>
        </ul>
        <p>Get started by logging into your account.</p>
        <p>Best regards,<br>The AutoCheck Pro Team</p>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);