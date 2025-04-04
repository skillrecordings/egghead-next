import {
  Code2,
  FileText,
  MessageSquare,
  Zap,
  Bug,
  Users,
  Lightbulb,
  GitBranch,
  Layers,
} from 'lucide-react'

export function WorkshopContent() {
  const contentItems = [
    {
      icon: <Zap className="h-5 w-5 text-black dark:text-white" />,
      title: "John Lindquist's AI Workflow:",
      description:
        'Implement a reliable 4-step process (Scaffold → Outline → Instruct → Execute) for tackling complex features and ensuring predictable AI assistance.',
    },
    {
      icon: <FileText className="h-5 w-5 text-black dark:text-white" />,
      title: 'Mastering Context:',
      description:
        'Learn techniques (using tools like FileForge & RepoMix) to feed AI the entire relevant project context, dramatically improving accuracy.',
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-black dark:text-white" />,
      title: 'Precision Prompting:',
      description:
        'Craft detailed, effective instructions using advanced models (like Gemini 2.5!) and web search for up-to-date, context-aware planning.',
    },
    {
      icon: <Code2 className="h-5 w-5 text-black dark:text-white" />,
      title: 'Efficient AI Execution:',
      description:
        'Leverage Cursor agents effectively, including auto-run, monitoring, and strategies for guiding the AI when it stumbles (without derailing progress).',
    },
    {
      icon: <Bug className="h-5 w-5 text-black dark:text-white" />,
      title: 'Debugging AI Failures:',
      description:
        'Systematically analyze agent errors (using cursor-history) and turn setbacks into valuable data for refining prompts and workflows.',
    },
    {
      icon: <Users className="h-5 w-5 text-black dark:text-white" />,
      title: 'Consistent Team Practices:',
      description:
        'Explore Cursor Rules & Modes for defining shared coding standards and persistent guidance (understanding current capabilities and limitations).',
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-black dark:text-white" />,
      title: 'Advanced Techniques:',
      description:
        'Utilize forced context for quick edits, configuration reuse across projects, and codebase exploration patterns.',
    },
    {
      icon: <GitBranch className="h-5 w-5 text-black dark:text-white" />,
      title: 'Parallel Development:',
      description:
        'Manage multiple features simultaneously using Git worktrees and concurrent AI agent sessions.',
    },
    {
      icon: <Layers className="h-5 w-5 text-black dark:text-white" />,
      title: 'Building with AI:',
      description:
        'Apply these concepts hands-on by collaboratively building a Next.js app, CLI, VS Code extension, and even a basic MCP server.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {contentItems.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="mt-1 bg-white dark:bg-[#141823] p-2 rounded-lg shadow-sm h-fit">
            {item.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
