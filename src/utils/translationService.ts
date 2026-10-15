/**
 * Translation service for English-to-Hindi auto-translation across form controls.
 * Uses a comprehensive dictionary for instant political & organizational terminology,
 * with network fallback to the free MyMemory translation API.
 */

const DICTIONARY: Record<string, string> = {
  // Roles and Designations
  'Super Admin': 'सुपर एडमिन',
  'superadmin': 'सुपर एडमिन',
  'State President': 'प्रदेश अध्यक्ष',
  'State Vice President': 'प्रदेश उपाध्यक्ष',
  'State General Secretary': 'प्रदेश महासचिव',
  'State Secretary': 'प्रदेश सचिव',
  'State Treasurer': 'प्रदेश कोषाध्यक्ष',
  'District President': 'ज़िला अध्यक्ष',
  'District General Secretary': 'ज़िला महासचिव',
  'District Secretary': 'ज़िला सचिव',
  'District In-Charge': 'ज़िला प्रभारी',
  'Tehsil President': 'तहसील अध्यक्ष',
  'Block President': 'ब्लॉक अध्यक्ष',
  'Cadre Volunteer': 'कैडर स्वयंसेवक',
  'Volunteer': 'स्वयंसेवक',
  'Press & Media Secretary': 'प्रेस एवं मीडिया प्रभारी',
  'Content & Ideology Desk': 'कंटेंट एवं वैचारिक प्रभाग',
  'Office Secretary': 'कार्यालय सचिव',
  'Public Citizen': 'आम नागरिक',
  'Public Visitor': 'सार्वजनिक आगंतुक',

  // Wings
  'Muslim Youth League': 'मुस्लिम यूथ लीग (MYL)',
  'Muslim Youth League (MYL)': 'मुस्लिम यूथ लीग (MYL)',
  'Muslim Students Federation': 'मुस्लिम स्टूडेंट्स फेडरेशन (MSF)',
  'Muslim Students Federation (MSF)': 'मुस्लिम स्टूडेंट्स फेडरेशन (MSF)',
  'White Guard': 'व्हाइट गार्ड आपदा राहत स्वयंसेवक',
  'White Guard (Disaster Relief & Cadre)': 'व्हाइट गार्ड (आपदा राहत एवं कैडर)',
  'Vanitha League': 'महिला लीग (वनिता लीग)',
  'Vanitha League (Women Wing)': 'महिला लीग (वनिता लीग)',
  'Advocates & Legal Cell': 'अधिवक्ता एवं विधिक प्रकोष्ठ',
  'Teachers & Education Cell': 'शिक्षक एवं शिक्षा प्रकोष्ठ',
  'Youth & Cadre Wing': 'युवा एवं कैडर विंग',
  'Student Wing': 'छात्र संगठन',

  // Zones
  'Rohilkhand': 'रोहिलखंड',
  'Western UP': 'पश्चिमी उत्तर प्रदेश',
  'Awadh / Central UP': 'अवध / मध्य उत्तर प्रदेश',
  'Purvanchal': 'पूर्वांचल',
  'Bundelkhand': 'बुंदेलखंड',
  'Braj': 'ब्रज',

  // Districts
  'Moradabad': 'मुरादाबाद',
  'Sambhal': 'संभल',
  'Rampur': 'रामपुर',
  'Bareilly': 'बरेली',
  'Meerut': 'मेरठ',
  'Muzaffarnagar': 'मुज़फ़्फ़रनगर',
  'Saharanpur': 'सहारनपुर',
  'Aligarh': 'अलीगढ़',
  'Agra': 'आगरा',
  'Lucknow': 'लखनऊ',
  'Kanpur Nagar': 'कानपुर नगर',
  'Varanasi': 'वाराणसी',
  'Bijnor': 'बिजनौर',
  'Amroha': 'अमरोहा',
  'Shahjahanpur': 'शाहजहांपुर',
  'Budaun': 'बदायूं',
  'Gorakhpur': 'गोरखपुर',
  'Prayagraj': 'प्रयागराज',
  'Ayodhya': 'अयोध्या',
  'Faizabad': 'फैजाबाद',

  // Status and Common Terms
  'Active': 'सक्रिय',
  'active': 'सक्रिय',
  'Pending': 'लंबित',
  'pending': 'लंबित',
  'Approved': 'स्वीकृत',
  'approved': 'स्वीकृत',
  'Present': 'वर्तमान',
  'Past': 'पूर्व',
  'Forming': 'गठन प्रक्रिया में',
  'Restructuring': 'पुनर्गठन',
  'State Level': 'राज्य स्तर',
  'District Level': 'ज़िला स्तर',
  'Tehsil / Block Level': 'तहसील / ब्लॉक स्तर',
  'Village / Ward Level': 'ग्राम / वार्ड स्तर',
  'Press Release': 'प्रेस विज्ञप्ति',
  'Public Rally': 'सार्वजनिक रैली',
  'Convention': 'राज्य सम्मेलन',
  'Study Circle': 'अध्ययन मंडल',
  'Cadre Training': 'कैडर प्रशिक्षण शिविर',
};

export async function translateEnglishToHindi(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // 1. Direct dictionary lookup
  if (DICTIONARY[trimmed]) {
    return DICTIONARY[trimmed];
  }

  // 2. Case-insensitive dictionary lookup
  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(DICTIONARY)) {
    if (key.toLowerCase() === lower) {
      return val;
    }
  }

  // 3. Check for partial matches in dictionary (e.g. "District President (MYL)")
  for (const [key, val] of Object.entries(DICTIONARY)) {
    if (trimmed.includes(key) && key.length > 5) {
      // replace known key
      const partial = trimmed.replace(key, val);
      return partial;
    }
  }

  // 4. Fallback to free MyMemory API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|hi`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const result = data.responseData.translatedText;
        // Clean out HTML entities if any
        const cleaned = result
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
        return cleaned;
      }
    }
  } catch {
    // network timeout or offline
  }

  return trimmed;
}
