interface UnicornStudioInstance {
  destroy: () => void;
}

interface UnicornStudioInitOptions {
  filePath?: string;
  elementId?: string;
  projectId?: string;
  scale?: number;
  lazyLoad?: boolean;
  interElement?: HTMLElement;
}

interface UnicornStudio {
  init: (options: UnicornStudioInitOptions) => Promise<UnicornStudioInstance>;
  destroy: () => void;
}

interface Window {
  UnicornStudio?: UnicornStudio;
}
