const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Sentiment & Keyword Sentiment Dictionary
const POSITIVE_KEYWORDS = ['safe', 'lit', 'fixed', 'clean', 'good', 'repaired', 'great', 'peaceful', 'awesome', 'helped'];
const NEGATIVE_KEYWORDS = ['unsafe', 'dark', 'broken', 'accident', 'danger', 'hazard', 'garbage', 'flood', 'harassment', 'scary', 'spill', 'jam'];

export const analyzeReportNLP = async (text, category, existingReports = []) => {
  if (!text) {
    return {
      category: category || 'other',
      sentiment: 'neutral',
      severity: 3,
      summary: 'Citizen report submitted.',
      verified: false,
      verificationScore: 50,
      isDuplicate: false,
    };
  }

  // Tier 1: Try Gemini API if key is available
  if (GEMINI_API_KEY) {
    try {
      const prompt = `Analyze this urban citizen report text: "${text}". Category hint: "${category}". 
Return a JSON object with: 
"category" (one of: hazard, accident, harassment, lighting, garbage, flooding, traffic, other),
"sentiment" ("positive", "neutral", "negative"),
"severity" (integer 1 to 5),
"summary" (1 sentence summary). ONLY output raw JSON.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          return {
            ...parsed,
            verificationScore: 65,
            verified: false,
            isDuplicate: false,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini NLP call failed, using client fallback classifier:', err);
    }
  }

  // Tier 2: Client-side NLP Classifier
  const lowerText = text.toLowerCase();

  let posCount = 0;
  let negCount = 0;
  POSITIVE_KEYWORDS.forEach(k => { if (lowerText.includes(k)) posCount++; });
  NEGATIVE_KEYWORDS.forEach(k => { if (lowerText.includes(k)) negCount++; });

  let sentiment = 'neutral';
  if (negCount > posCount) sentiment = 'negative';
  else if (posCount > negCount) sentiment = 'positive';

  // Severity 1-5 heuristic
  let severity = 3;
  if (lowerText.includes('harassment') || lowerText.includes('severe') || lowerText.includes('injury')) severity = 5;
  else if (lowerText.includes('accident') || lowerText.includes('flood')) severity = 4;
  else if (lowerText.includes('garbage') || lowerText.includes('litter')) severity = 2;

  // Duplicate Check
  const isDuplicate = existingReports.some(
    r => r.description && r.description.toLowerCase().includes(lowerText.substring(0, 15))
  );

  return {
    category: category || 'other',
    sentiment,
    severity,
    summary: text.length > 80 ? `${text.substring(0, 80)}...` : text,
    verified: false,
    verificationScore: isDuplicate ? 30 : 60,
    isDuplicate,
  };
};
