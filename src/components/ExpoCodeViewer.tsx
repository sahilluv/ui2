import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Folder,
  FileCode,
  Terminal,
  Database,
  Server,
  Smartphone,
  Layers,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { MONOREPO_FILES, MonorepoFile } from '../data/monorepoFiles';
import { EXPO_SOURCE_FILES, SourceFile } from '../data/expoSourceFiles';

export const ExpoCodeViewer: React.FC = () => {
  const [selectedSuite, setSelectedSuite] = useState<'monorepo' | 'expo'>('monorepo');
  const [monorepoIndex, setMonorepoIndex] = useState(0);
  const [expoIndex, setExpoIndex] = useState(1);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const activeMonorepoFile: MonorepoFile = MONOREPO_FILES[monorepoIndex];
  const activeExpoFile: SourceFile = EXPO_SOURCE_FILES[expoIndex];

  const currentPath = selectedSuite === 'monorepo' ? activeMonorepoFile.path : activeExpoFile.path;
  const currentDesc = selectedSuite === 'monorepo' ? activeMonorepoFile.description : activeExpoFile.description;
  const currentCode = selectedSuite === 'monorepo' ? activeMonorepoFile.code : activeExpoFile.code;

  const handleCopyFile = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAll = () => {
    const list = selectedSuite === 'monorepo' ? MONOREPO_FILES : EXPO_SOURCE_FILES;
    const allCode = list
      .map(
        (f) => `// ==================================================\n// FILE: ${f.path}\n// ==================================================\n\n${f.code}\n\n`
      )
      .join('\n');
    navigator.clipboard.writeText(allCode);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const monorepoCategories = ['Mobile App', 'NestJS API', 'Prisma & DB', 'Packages & Infra'] as const;
  const expoCategories = ['Root', 'Theme', 'Types', 'Components', 'Screens'] as const;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold">
                <GitBranch size={13} />
                Imported: sahilluv/ui
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold">
                <Code size={13} />
                Monorepo + Expo
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Shadow Monorepo & Mobile Codebase
            </h2>
            <p className="text-neutral-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Explore the full monorepo imported from <code className="text-white font-mono text-xs">sahilluv/ui</code> containing <strong className="text-white">apps/mobile</strong> (React Native Expo), <strong className="text-white">apps/api</strong> (NestJS + Prisma), <strong className="text-white">prisma/schema.prisma</strong>, and infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-neutral-800 border border-neutral-600 text-white shadow-lg hover:bg-neutral-700 active:scale-95 transition-all"
            >
              {copiedAll ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedAll ? 'Copied All!' : 'Copy Entire Suite'}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-neutral-950 border border-white/10 rounded-2xl gap-1">
            <button
              onClick={() => setSelectedSuite('monorepo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSuite === 'monorepo'
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Database size={14} />
              <span>Shadow 0.1 Monorepo (apps/mobile + apps/api)</span>
            </button>
            <button
              onClick={() => setSelectedSuite('expo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSuite === 'expo'
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Expo Prototype UI Code</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
            <Terminal size={14} className="text-neutral-400" />
            <span>npm run start --workspace apps/mobile</span>
          </div>
        </div>
      </div>

      {/* Main File Explorer & Code Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[660px]">
        {/* Sidebar: File Tree */}
        <div className="lg:col-span-4 bg-[#181818] p-4 border-r border-white/10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="px-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Folder size={14} className="text-neutral-400" />
                {selectedSuite === 'monorepo' ? 'Monorepo Files (sahilluv/shadow0.1)' : 'Expo UI Prototype'}
              </h3>
            </div>

            <div className="space-y-4">
              {selectedSuite === 'monorepo' ? (
                monorepoCategories.map((category) => {
                  const categoryFiles = MONOREPO_FILES.filter((f) => f.category === category);
                  if (categoryFiles.length === 0) return null;

                  return (
                    <div key={category} className="space-y-1">
                      <span className="text-[11px] font-semibold text-neutral-400 px-2 block uppercase tracking-wider">
                        {category}
                      </span>
                      <div className="space-y-0.5">
                        {categoryFiles.map((file) => {
                          const globalIdx = MONOREPO_FILES.findIndex((f) => f.path === file.path);
                          const isActive = globalIdx === monorepoIndex;

                          return (
                            <button
                              key={file.path}
                              onClick={() => setMonorepoIndex(globalIdx)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-left transition-colors ${
                                isActive
                                  ? 'bg-neutral-800 text-white font-bold border border-neutral-600'
                                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileCode
                                  size={14}
                                  className={isActive ? 'text-white' : 'text-neutral-500'}
                                />
                                <span className="truncate">{file.path}</span>
                              </div>
                              {isActive && <ChevronRight size={13} className="text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                expoCategories.map((category) => {
                  const categoryFiles = EXPO_SOURCE_FILES.filter((f) => f.category === category);
                  if (categoryFiles.length === 0) return null;

                  return (
                    <div key={category} className="space-y-1">
                      <span className="text-[11px] font-semibold text-neutral-400 px-2 block uppercase tracking-wider">
                        {category}
                      </span>
                      <div className="space-y-0.5">
                        {categoryFiles.map((file) => {
                          const globalIdx = EXPO_SOURCE_FILES.findIndex((f) => f.path === file.path);
                          const isActive = globalIdx === expoIndex;

                          return (
                            <button
                              key={file.path}
                              onClick={() => setExpoIndex(globalIdx)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-left transition-colors ${
                                isActive
                                  ? 'bg-neutral-800 text-white font-bold border border-neutral-600'
                                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileCode
                                  size={14}
                                  className={isActive ? 'text-white' : 'text-neutral-500'}
                                />
                                <span className="truncate">{file.path}</span>
                              </div>
                              {isActive && <ChevronRight size={13} className="text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 px-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>
              {selectedSuite === 'monorepo' ? `${MONOREPO_FILES.length} files` : `${EXPO_SOURCE_FILES.length} files`}
            </span>
            <span className="text-neutral-300 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              TypeScript & Prisma Validated
            </span>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="lg:col-span-8 flex flex-col bg-[#000000]">
          {/* File Tab Header */}
          <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-[#121212] backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <FileCode size={15} className="text-white" />
                <span className="font-bold text-white">{currentPath}</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                {currentDesc}
              </p>
            </div>

            <button
              onClick={handleCopyFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 active:scale-95 shrink-0"
            >
              {copiedFile ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              <span>{copiedFile ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>

          {/* Code Text */}
          <div className="p-6 flex-1 overflow-auto max-h-[640px] font-mono text-xs text-slate-300 leading-relaxed select-text">
            <pre className="whitespace-pre">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
