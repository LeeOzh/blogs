import { ResumeData } from '../types';

interface MinimalTemplateProps {
  data: ResumeData;
}

export const MinimalTemplate = ({ data }: MinimalTemplateProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 space-y-6">
      {/* Header */}
      <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2">
          {data.personalInfo.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {data.personalInfo.title}
        </p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.email}</span>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
          Summary
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
          Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{exp.position}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</span>
              </div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="leading-relaxed">• {achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
          Skills
        </h2>
        <div className="space-y-2">
          {Object.entries(data.skills).map(([category, skills]) => (
            <div key={category} className="flex">
              <span className="w-20 text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                {category}:
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {skills.join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};