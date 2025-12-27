export async function generateWords() {
  const response = await fetch("/api/generate-words", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const payload = await response.json();
  if (!response.ok) {
    const message = payload?.error || "Failed to generate words";
    throw new Error(message);
  }

  return payload;
}

// Run the function
// generateWords();
