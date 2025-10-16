// React types are handled by @types/react, we just need to extend them
declare namespace React {
  interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
}

// ReactDOM types are handled by @types/react-dom

declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: { model: string; systemInstruction?: string }): any;
  }
}

// Vite environment variables
interface ImportMetaEnv {
  readonly GEMINI_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'lucide-react' {
  export const Bot: any;
  export const Code: any;
  export const Zap: any;
  export const Globe: any;
  export const LayoutTemplate: any;
  export const Edit: any;
  export const Eye: any;
  export const GitFork: any;
  export const Trash2: any;
  export const GitBranch: any;
  export const Share2: any;
  export const Lock: any;
  export const Unlock: any;
  export const ImageUp: any;
  export const Briefcase: any;
  export const NotebookText: any;
  export const Rocket: any;
  export const LayoutDashboard: any;
  export const Wand2: any;
  export const LoaderCircle: any;
  export const Search: any;
  export const X: any;
  export const Send: any;
  export const BrainCircuit: any;
  export const Plus: any;
  export const History: any;
  export const Home: any;
  export const Github: any;
  export const Undo2: any;
  export const Redo2: any;
  export const TrendingUp: any;
  export const AlertTriangle: any;
  export const CheckCircle: any;
  export const Loader: any;
  export const CheckCircle2: any;
  export const ListChecks: any;
  export const FolderGit2: any;
  export const User: any;
  export const Clipboard: any;
  export const ThumbsUp: any;
  export const ThumbsDown: any;
  export const Check: any;
  export const Palette: any;
  export const Database: any;
  export const Sidebar: any;
  export const ExternalLink: any;
  export const Smartphone: any;
  export const Tablet: any;
  export const Monitor: any;
  export const RefreshCw: any;
  export const Upload: any;
  export const SidebarClose: any;
  export const SidebarOpen: any;
  export const Link: any;
  export const Copy: any;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface ElementAttributesProperty {
    props: {};
  }
  interface ElementChildrenAttribute {
    children: {};
  }
}