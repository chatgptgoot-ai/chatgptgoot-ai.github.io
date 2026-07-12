// Profanity list for clean campus community standard
const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'crap', 'damn', 'bastard', 'slut', 'whore', 
  'fag', 'retard', 'cunt', 'dick', 'pussy', 'nigger', 'nigga', 'chink', 'spic'
];

export function cleanCommentText(text: string): { cleaned: string; hadProfanity: boolean } {
  let cleaned = text;
  let hadProfanity = false;

  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(cleaned)) {
      hadProfanity = true;
      cleaned = cleaned.replace(regex, (match) => '*'.repeat(match.length));
    }
  });

  return { cleaned, hadProfanity };
}

export function validateRespectfulFeedback(text: string): { isValid: boolean; message?: string } {
  if (!text || text.trim().length < 3) {
    return { isValid: false, message: 'Feedback must be at least 3 characters long.' };
  }
  if (text.length > 500) {
    return { isValid: false, message: 'Feedback cannot exceed 500 characters.' };
  }
  return { isValid: true };
}
