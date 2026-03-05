import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const CenterPanel: React.FC = () => {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Write your code here')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const runCode = () => {
    setIsRunning(true)
    // Simulated remote execution delay
    setTimeout(() => {
      setOutput(`> Running in ECS Sandbox...
      
Test Case 1: PASS (2ms)
Test Case 2: PASS (1ms)
Test Case 3: FAIL (Expected 5, got 0)

Execution completed. Memory used: 12MB`)
      setIsRunning(false)
    }, 1500)
  }

  return (
    <div
      className={`flex flex-col border-r border-zinc-800 bg-zinc-950 ${isFullscreen ? 'fixed inset-0 z-50 p-4' : 'h-full p-4'}`}
    >
      {/* Top Bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px] border-zinc-800 bg-zinc-900 text-sm">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
              <SelectItem value="javascript">Node.js</SelectItem>
              <SelectItem value="python">Python 3</SelectItem>
              <SelectItem value="java">Java 21</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-50"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="gap-2 bg-emerald-500 font-bold text-zinc-950 hover:bg-emerald-600"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      {/* Monaco Editor Area */}
      <div className="mb-4 min-h-[400px] flex-1 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/50">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 24,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>

      {/* Output Console */}
      <div className="flex h-48 flex-col overflow-hidden rounded-md border border-zinc-800 bg-[#1e1e1e] shadow-inner">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Output Console
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-zinc-300">
          {output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <span className="text-zinc-600 italic">Code execution results will appear here...</span>
          )}
        </div>
      </div>
    </div>
  )
}
