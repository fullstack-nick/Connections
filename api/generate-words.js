const SchemaType = {
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
  STRING: "STRING",
};

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const schema = {
  description: "Object with 16 mixed words and 4 category objects",
  type: SchemaType.OBJECT,
  properties: {
    mixedWords: {
      type: SchemaType.ARRAY,
      description: "An array of exactly 16 words in random order",
      minItems: 16,
      maxItems: 16,
      items: {
        type: SchemaType.STRING,
        description: "A single word",
      },
    },
    categories: {
      type: SchemaType.ARRAY,
      description: "An array of 4 category objects",
      minItems: 4,
      maxItems: 4,
      items: {
        type: SchemaType.OBJECT,
        description: "A category with a 'name' and a 'words' array of length 4",
        properties: {
          name: {
            type: SchemaType.STRING,
            description: "The name of this category",
          },
          words: {
            type: SchemaType.ARRAY,
            description: "Exactly 4 words belonging to this category",
            minItems: 4,
            maxItems: 4,
            items: {
              type: SchemaType.STRING,
              description: "A single word for this category",
            },
          },
        },
        required: ["name", "words"],
      },
    },
  },
  required: ["mixedWords", "categories"],
};

const prompt = `
Generate 4 sets of 4 words, each set representing a distinct topic or category.
The words in each set must be thematically connected. The words and categories should be on a level of a college student. Each next category should be more complicated than the previous one (from straightforward to tricky). The category and the words should always be in English. Do not make grammar, word structure or language rules related categories. Make sure each category differs a lot from the previous. Make sure the category isn't a part of another word. For categories use lifely topics as well as theoretical/scientific topics. Don't use stem sciences for categories. Include some 'single-word' categories as well as multiple. It should be hard to determine which word belongs to which category.
Every letter of every word and category should be capitalized.
First, return all 16 words in a single array called "mixedWords" (in mixed order).
Then, return the words grouped by category in an array called "categories".
Each category object must have:
  - a "name" property (string)
  - a "words" property (array of 4 words)

Example categories and words for illustration only (without brackets):
{ "WANE": ["DWINDLE", "FADE", "PETER", "TAPER"] },
{ "GARDEN TASKS": ["PLANT", "PRUNE", "WATER", "WEED"] },
{ "SHOES": ["FLAT", "MARY JANE", "MULE", "SLIDE"] },
{ "SAND___": ["CASTLE", "PAPER", "PIPER", "STONE"] }
`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    return;
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  };

  try {
    const response = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await response.text();
    if (!response.ok) {
      res.status(response.status).json({ error: "Gemini API error", details: raw });
      return;
    }

    let apiJson;
    try {
      apiJson = JSON.parse(raw);
    } catch (parseError) {
      res.status(500).json({ error: "Invalid JSON from Gemini API", details: raw });
      return;
    }

    const text = apiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      res.status(500).json({ error: "Empty model response" });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (parseError) {
      res
        .status(500)
        .json({ error: "Model response was not valid JSON", details: text });
      return;
    }

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ error: "Request failed", details: error.message });
  }
};
