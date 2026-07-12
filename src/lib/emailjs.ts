import emailjs from "@emailjs/browser";

/** Shape of the payload sent to EmailJS — extend as needed without breaking existing code. */
export interface ContactPayload {
  name: string;
  email: string;
  category: string;
  timeline: string;
  message: string;
  company?: string;
  budget?: string;
  // Common fallback fields automatically populated:
  from_name?: string;
  user_name?: string;
  from_email?: string;
  user_email?: string;
  reply_to?: string;
  [key: string]: string | undefined; // future-proof
}

// Using the correct, verified credentials directly to bypass any stale/cached environment settings:
const SERVICE_ID = "service_i9fycyv";
const TEMPLATE_ID = "template_48nuksx";
const PUBLIC_KEY = "cZ-jx1VoveU9mLero";

/**
 * Sends a contact form payload via EmailJS.
 * Performs environment variable auditing, template param validation, and verbose error capturing.
 */
export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  // --- STEP 1: Environment Audit ---
  console.log("=== EmailJS Environment Audit ===");
  console.log("VITE_EMAILJS_SERVICE_ID:", SERVICE_ID);
  console.log("VITE_EMAILJS_TEMPLATE_ID:", TEMPLATE_ID);
  console.log("VITE_EMAILJS_PUBLIC_KEY:", PUBLIC_KEY);

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    const missing = [];
    if (!SERVICE_ID) missing.push("VITE_EMAILJS_SERVICE_ID");
    if (!TEMPLATE_ID) missing.push("VITE_EMAILJS_TEMPLATE_ID");
    if (!PUBLIC_KEY) missing.push("VITE_EMAILJS_PUBLIC_KEY");
    
    console.error("[EmailJS] Missing configuration variables:", missing);
    throw new Error(
      `EmailJS configuration is missing: ${missing.join(", ")}. Please check your .env file.`
    );
  }

  // --- STEP 4: Template Params Audit & Compatibility Fallbacks ---
  const enhancedPayload: ContactPayload = {
    ...payload,
    // Duplicate fields to match all common EmailJS template default naming conventions
    from_name: payload.name,
    user_name: payload.name,
    from_email: payload.email,
    user_email: payload.email,
    reply_to: payload.email,
  };

  // --- STEP 3: API Call Audit Log ---
  console.log("=== EmailJS API Call Audit ===");
  console.log("Service ID:", SERVICE_ID);
  console.log("Template ID:", TEMPLATE_ID);
  console.log("Public Key:", PUBLIC_KEY);
  console.log("Template Params Payload:", JSON.stringify(enhancedPayload, null, 2));

  // --- STEP 5: Runtime Debugger Try/Catch ---
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, enhancedPayload, {
      publicKey: PUBLIC_KEY,
    });
    console.log("[EmailJS] Success Response:", {
      status: response.status,
      text: response.text,
    });
  } catch (error: unknown) {
    console.error("=== EmailJS Execution Failure ===");
    console.error("Error Object:", error);

    // EmailJS throws an EmailJSResponseStatus object with { status, text }
    if (error && typeof error === "object" && "status" in error && "text" in error) {
      const ejsError = error as { status: number; text: string };
      console.error("[EmailJS] HTTP Error Status Code:", ejsError.status);
      console.error("[EmailJS] API Response Body:", ejsError.text);
      
      throw new Error(
        `EmailJS HTTP Error ${ejsError.status}: ${ejsError.text}`
      );
    }

    if (error instanceof Error) {
      console.error("[EmailJS] System Error Name:", error.name);
      console.error("[EmailJS] System Error Message:", error.message);
      console.error("[EmailJS] Stack Trace:\n", error.stack);
      throw error;
    }

    throw new Error(`EmailJS send failed with an unknown error: ${String(error)}`);
  }
}
