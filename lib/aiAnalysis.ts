import { GoogleGenerativeAI } from "@google/generative-ai";
import { FileTree, Language } from '../types';

export interface AnalysisResult {
  performance: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  accessibility: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  seo: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  design: {
    score: number;
    suggestions: string[];
  };
}

export interface OptimizationSuggestion {
  type: 'performance' | 'accessibility' | 'seo' | 'design';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  code?: string;
  fileChanges?: Record<string, string>;
}

export class AIAnalysisEngine {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeProject(fileTree: FileTree, language: Language): Promise<AnalysisResult> {
    const systemInstruction = `You are an expert web developer and UX analyst. Analyze the provided web application files and return a comprehensive analysis in JSON format.

Analyze these aspects:
1. Performance - loading speed, code efficiency, image optimization
2. Accessibility - ARIA labels, semantic HTML, keyboard navigation, color contrast
3. SEO - meta tags, semantic structure, content optimization
4. Design - UI/UX patterns, responsiveness, visual hierarchy

Return ONLY a JSON object with this exact structure:
{
  "performance": {
    "score": 85,
    "issues": ["Large CSS file size", "Missing image optimization"],
    "suggestions": ["Minify CSS", "Compress images", "Use lazy loading"]
  },
  "accessibility": {
    "score": 70,
    "issues": ["Missing alt attributes", "Poor color contrast"],
    "suggestions": ["Add alt text to images", "Increase color contrast ratio"]
  },
  "seo": {
    "score": 60,
    "issues": ["Missing meta description", "No structured data"],
    "suggestions": ["Add meta description", "Implement structured data"]
  },
  "design": {
    "score": 80,
    "suggestions": ["Improve mobile responsiveness", "Add loading states"]
  }
}`;

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent({
        contents: [{ parts: [{ text: `Analyze this web application:\n\n${JSON.stringify(fileTree, null, 2)}` }] }],
        generationConfig: {
          maxOutputTokens: 8192, // Analysis should be detailed but not huge
          temperature: 0.2,
        }
      });
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Analysis failed:', error);
      return this.getDefaultAnalysis();
    }
  }

  async generateOptimizations(fileTree: FileTree, analysisResult: AnalysisResult, language: Language): Promise<OptimizationSuggestion[]> {
    const systemInstruction = `You are an expert web developer. Based on the analysis results, generate specific optimization suggestions with code examples.

Return ONLY a JSON array of optimization suggestions with this structure:
[
  {
    "type": "performance",
    "priority": "high",
    "title": "Optimize CSS",
    "description": "Minify CSS and remove unused styles",
    "code": "/* Optimized CSS code */",
    "fileChanges": {
      "styles/style.css": "optimized css content"
    }
  }
]`;

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent({
        contents: [{ parts: [{ text: `Files: ${JSON.stringify(fileTree, null, 2)}\n\nAnalysis: ${JSON.stringify(analysisResult, null, 2)}` }] }],
        generationConfig: {
          maxOutputTokens: 16384, // Suggestions can be longer
          temperature: 0.3,
        }
      });
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      
      return [];
    } catch (error) {
      console.error('Optimization generation failed:', error);
      return [];
    }
  }

  private getDefaultAnalysis(): AnalysisResult {
    return {
      performance: {
        score: 75,
        issues: ['Analysis temporarily unavailable'],
        suggestions: ['Try again later']
      },
      accessibility: {
        score: 75,
        issues: ['Analysis temporarily unavailable'],
        suggestions: ['Try again later']
      },
      seo: {
        score: 75,
        issues: ['Analysis temporarily unavailable'],
        suggestions: ['Try again later']
      },
      design: {
        score: 75,
        suggestions: ['Analysis temporarily unavailable']
      }
    };
  }
}