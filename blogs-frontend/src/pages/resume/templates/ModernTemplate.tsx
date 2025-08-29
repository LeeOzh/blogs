import { ResumeData } from '../types';

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const skillColors = {
    languages: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    frameworks: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    ui: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    tools: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    ai: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
  };

  const skillLabels = {
    languages: '语言基础',
    frameworks: '前端框架',
    ui: 'UI/样式框架',
    tools: '工程化工具',
    ai: 'AI开发助手'
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {data.personalInfo.avatar}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {data.personalInfo.name}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
              {data.personalInfo.title}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{data.personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎂</span>
                <span>{data.personalInfo.birth}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>{data.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>{data.personalInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🧠</span>
          个人简介
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Technical Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>🛠</span>
          技术技能
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <span>👉</span>
              主力技术栈
            </h3>
            <div className="grid gap-4">
              {Object.entries(data.skills).map(([category, skills]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {skillLabels[category as keyof typeof skillLabels]}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full text-sm ${skillColors[category as keyof typeof skillColors]}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>💼</span>
          工作经历
        </h2>
        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <div key={index} className={`border-l-4 pl-6 ${exp.current ? 'border-blue-500' : 'border-gray-300'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.company} | {exp.position}
                </h3>
                <span className={`text-sm font-medium ${exp.current ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {exp.period}{exp.current ? '（在职）' : ''}
                </span>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-2">
                    <span className={`mt-1 ${exp.current ? 'text-blue-500' : 'text-gray-400'}`}>•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Project Experience */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>💼</span>
          项目经历
        </h2>
        <div className="space-y-8">
          {data.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧾</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">时间：</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.period}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">技术栈：</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.tech}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">项目背景</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {project.background}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">关键贡献</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {project.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};