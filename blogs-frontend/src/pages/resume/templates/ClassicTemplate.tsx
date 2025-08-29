import { ResumeData } from '../types';

interface ClassicTemplateProps {
  data: ResumeData;
}

export const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center border-b border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {data.personalInfo.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          {data.personalInfo.title}
        </p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <span>{data.personalInfo.birth}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.email}</span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-900 dark:border-gray-300">
            个人简介
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-900 dark:border-gray-300">
            技术技能
          </h2>
          <div className="space-y-4">
            {Object.entries(data.skills).map(([category, skills]) => (
              <div key={category} className="flex">
                <div className="w-24 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  {category === 'languages' ? '语言基础' :
                   category === 'frameworks' ? '前端框架' :
                   category === 'ui' ? 'UI框架' :
                   category === 'tools' ? '工程化' : 'AI助手'}:
                </div>
                <div className="flex-1 text-gray-600 dark:text-gray-400 text-sm">
                  {skills.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-900 dark:border-gray-300">
            工作经历
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{exp.company}</h3>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{exp.position}</p>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                  {exp.achievements.map((achievement, achIndex) => (
                    <li key={achIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-gray-900 dark:border-gray-300">
            项目经历
          </h2>
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{project.name}</h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {project.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>技术栈：</strong>{project.tech}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {project.background}
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">主要贡献：</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                    {project.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};