const HF_ENDPOINT = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

interface TryOnOptions {
  image: string; // base64 string without metadata prefix
  prompt?: string;
  strength?: number;
  steps?: number;
}

export async function generateTryOnImage({
  image,
  prompt = "realistic fashion overlay",
  strength = 0.7,
  steps = 20,
}: TryOnOptions) {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    throw new Error("Missing HF_API_KEY environment variable");
  }

  const payload = {
    inputs: image,
    parameters: {
      prompt,
      strength,
      num_inference_steps: steps,
      guidance_scale: 7.5,
    },
  };

  const response = await fetch(HF_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorText = response.statusText;
    try {
      const errorBody = await response.json();
      errorText = JSON.stringify(errorBody);
    } catch {
      // ignore json parse errors
    }
    throw new Error(`Hugging Face request failed: ${response.status} ${errorText}`);
  }

  const contentType = response.headers.get("content-type") ?? "image/png";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    if (data.error) {
      throw new Error(`Hugging Face returned error: ${data.error}`);
    }
    throw new Error("Unexpected Hugging Face response payload");
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  return {
    base64,
    mimeType: contentType,
  };
}
