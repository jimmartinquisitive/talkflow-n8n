import React, { useState, useEffect, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { executeJavaScript, executeHTML, executePython } from '@/utils/codeExecutor';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from './playground/EditorHeader';
import { PlaygroundOutput } from './playground/PlaygroundOutput';
import { usePopoutWindow } from '@/hooks/usePopoutWindow';

// Configure Monaco Editor loader with proper typing
type LoaderConfig = {
  paths: {
    vs: string;
    [key: string]: string; // Allow additional path entries
  };
  'vs/nls': {
    availableLanguages: Record<string, string>;
    fallbackLanguage?: string;
  };
};

const config: LoaderConfig = {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs',
    'stackframe': 'https://cdn.jsdelivr.net/npm/stackframe@1.3.1/dist/stackframe.min.js',
    'error-stack-parser': 'https://cdn.jsdelivr.net/npm/error-stack-parser@2.1.4/dist/error-stack-parser.min.js'
  },
  'vs/nls': {
    availableLanguages: {},
    fallbackLanguage: 'en'
  }
};

loader.config(config);

// Preload required Monaco Editor dependencies
loader.init().then(() => {
  console.log('Monaco Editor initialized successfully');
}).catch(error => {
  console.error('Failed to initialize Monaco Editor:', error);
});

interface CodePlaygroundProps {
  defaultLanguage?: string;
  defaultValue?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\nconsole.log("Hello, World!");',
}) => {
  const [code, setCode] = useState(defaultValue);
  const [language, setLanguage] = useState(defaultLanguage);
  const [output, setOutput] = useState<string>('');
  const [isOutputPopped, setIsOutputPopped] = useState(false);
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLDivElement>(null);

  const { handlePopOutput } = usePopoutWindow(
    isOutputPopped,
    setIsOutputPopped,
    language,
    code,
    output
  );

  useEffect(() => {
    const savedCode = localStorage.getItem('playground-code');
    const savedLanguage = localStorage.getItem('playground-language');
    
    if (savedCode) {
      setCode(savedCode);
      localStorage.removeItem('playground-code');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      localStorage.removeItem('playground-language');
    }
  }, []);

  const handleRun = async () => {
    try {
      if (language === 'html') {
        if (iframeRef.current) {
          const iframe = executeHTML(code);
          iframeRef.current.innerHTML = '';
          iframeRef.current.appendChild(iframe);
        }
        return;
      }

      let result;
      if (language === 'python') {
        result = await executePython(code);
      } else {
        result = await executeJavaScript(code);
      }

      const { error, logs = [] } = result;
      const outputText = [
        ...(logs.length > 0 ? logs : []),
        ...(result.result !== undefined ? [result.result] : []),
        ...(error ? [`Error: ${error}`] : [])
      ].join('\n');
      
      setOutput(outputText);
      
      toast({
        description: error ? "Execution failed" : "Code executed successfully",
        variant: error ? "destructive" : "default",
      });
    } catch (err) {
      toast({
        description: "Failed to execute code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-[90vh] mx-auto bg-card shadow-lg">
      <CardHeader className="border-b border-border/20">
        <EditorHeader
          language={language}
          setLanguage={setLanguage}
          code={code}
          onRun={handleRun}
          onPopOutput={handlePopOutput}
          isOutputPopped={isOutputPopped}
        />
      </CardHeader>
      <CardContent className="p-4 pb-8 h-[calc(90vh-5rem)]">
        <ResizablePanelGroup direction="vertical" className="h-full rounded-md border">
          <ResizablePanel defaultSize={isOutputPopped ? 100 : 60}>
            <div className="h-full">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
              />
            </div>
          </ResizablePanel>
          {!isOutputPopped && (
            <ResizablePanel defaultSize={40}>
              <div className="h-full flex flex-col">
                <PlaygroundOutput
                  language={language}
                  output={output}
                  code={code}
                  iframeRef={iframeRef}
                  outputRef={outputRef}
                />
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;