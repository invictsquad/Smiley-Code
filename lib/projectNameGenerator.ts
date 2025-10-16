import { GoogleGenerativeAI } from "@google/generative-ai";

export class ProjectNameGenerator {
  private static genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY!);

  /**
   * Gera um nome de projeto baseado no prompt do usuário usando IA
   */
  static async generateProjectName(prompt: string): Promise<string> {
    if (!import.meta.env.GEMINI_API_KEY || !prompt.trim()) {
      return this.getFallbackName(prompt);
    }

    try {
      const systemInstruction = `You are a creative project naming assistant. Generate a short, catchy, and descriptive project name based on the user's description. 

Rules:
- Maximum 4 words
- Use title case (e.g., "My Amazing App")
- Be creative but professional
- Reflect the main purpose/theme of the project
- Avoid generic words like "Website", "App", "Project"
- Make it memorable and unique

Examples:
- "Create a portfolio website" → "Creative Portfolio Hub"
- "Build a todo app" → "Task Master Pro"
- "Make a recipe finder" → "Flavor Discovery"
- "Design a blog" → "Story Canvas"
- "Create an e-commerce store" → "Digital Marketplace"

Respond with ONLY the project name, nothing else.`;

      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100, // Project names should be short
          temperature: 0.3,
        }
      });
      const response = await result.response;

      const generatedName = response.text()?.trim();
      
      if (generatedName && generatedName.length <= 50) {
        return generatedName;
      }
      
      return this.getFallbackName(prompt);
    } catch (error) {
      console.warn('Failed to generate project name with AI:', error);
      return this.getFallbackName(prompt);
    }
  }

  /**
   * Gera um nome de fallback baseado em palavras-chave do prompt
   */
  private static getFallbackName(prompt: string): string {
    if (!prompt.trim()) {
      return this.getRandomName();
    }

    const keywords = this.extractKeywords(prompt.toLowerCase());
    
    if (keywords.length === 0) {
      return this.getRandomName();
    }

    // Mapear palavras-chave para nomes criativos
    const nameMap: Record<string, string[]> = {
      'portfolio': ['Creative Portfolio', 'Portfolio Hub', 'Showcase Studio'],
      'blog': ['Story Canvas', 'Content Hub', 'Blog Central'],
      'todo': ['Task Master', 'Todo Pro', 'Task Hub'],
      'task': ['Task Manager', 'Productivity Hub', 'Task Central'],
      'shop': ['Digital Store', 'Shop Hub', 'Commerce Central'],
      'store': ['Retail Hub', 'Store Central', 'Shopping Plaza'],
      'ecommerce': ['Digital Marketplace', 'Commerce Hub', 'Trade Central'],
      'dashboard': ['Control Center', 'Analytics Hub', 'Data Central'],
      'landing': ['Launch Pad', 'Landing Central', 'Welcome Hub'],
      'recipe': ['Flavor Discovery', 'Recipe Hub', 'Culinary Central'],
      'photo': ['Photo Gallery', 'Image Hub', 'Visual Studio'],
      'gallery': ['Gallery Central', 'Visual Hub', 'Art Studio'],
      'game': ['Game Central', 'Play Hub', 'Gaming Studio'],
      'chat': ['Chat Hub', 'Message Central', 'Talk Studio'],
      'social': ['Social Hub', 'Connect Central', 'Community Studio'],
      'weather': ['Weather Central', 'Climate Hub', 'Forecast Studio'],
      'news': ['News Hub', 'Info Central', 'Update Studio'],
      'music': ['Music Hub', 'Audio Central', 'Sound Studio'],
      'video': ['Video Hub', 'Media Central', 'Stream Studio'],
      'fitness': ['Fitness Hub', 'Health Central', 'Wellness Studio'],
      'education': ['Learning Hub', 'Edu Central', 'Study Studio'],
      'booking': ['Booking Central', 'Reserve Hub', 'Schedule Studio'],
      'calendar': ['Calendar Hub', 'Time Central', 'Schedule Studio'],
      'calculator': ['Calc Central', 'Number Hub', 'Math Studio'],
      'converter': ['Convert Hub', 'Transform Central', 'Change Studio']
    };

    // Encontrar a primeira palavra-chave que tem mapeamento
    for (const keyword of keywords) {
      if (nameMap[keyword]) {
        const options = nameMap[keyword];
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    // Se não encontrou mapeamento, criar nome baseado na primeira palavra-chave
    const mainKeyword = keywords[0];
    const capitalizedKeyword = mainKeyword.charAt(0).toUpperCase() + mainKeyword.slice(1);
    
    const suffixes = ['Hub', 'Central', 'Studio', 'Pro', 'Plus', 'Express'];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${capitalizedKeyword} ${randomSuffix}`;
  }

  /**
   * Extrai palavras-chave relevantes do prompt
   */
  private static extractKeywords(prompt: string): string[] {
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
      'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'create', 'make', 'build',
      'design', 'develop', 'app', 'application', 'website', 'site', 'web', 'page', 'simple', 'basic',
      'um', 'uma', 'o', 'a', 'de', 'do', 'da', 'em', 'para', 'com', 'por', 'criar', 'fazer', 'construir'
    ]);

    const words = prompt
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()))
      .map(word => word.toLowerCase());

    return [...new Set(words)].slice(0, 3); // Máximo 3 palavras-chave únicas
  }

  /**
   * Gera um nome aleatório quando não há prompt
   */
  private static getRandomName(): string {
    const adjectives = [
      'Amazing', 'Creative', 'Modern', 'Smart', 'Cool', 'Awesome', 'Brilliant', 'Elegant',
      'Dynamic', 'Innovative', 'Sleek', 'Stylish', 'Professional', 'Advanced', 'Premium'
    ];
    
    const nouns = [
      'Project', 'Studio', 'Hub', 'Central', 'Lab', 'Works', 'Space', 'Zone',
      'Platform', 'Solution', 'System', 'Engine', 'Builder', 'Creator', 'Maker'
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective} ${noun}`;
  }

  /**
   * Gera um nome de projeto de forma síncrona (fallback rápido)
   */
  static generateQuickName(prompt: string): string {
    return this.getFallbackName(prompt);
  }
}