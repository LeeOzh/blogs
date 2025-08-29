import SimpleBar from 'simplebar-react';
import { ResumeData } from '../types';

interface ResumeEditorProps {
  resumeData: ResumeData;
  onUpdatePersonalInfo: (field: keyof ResumeData['personalInfo'], value: string) => void;
  onUpdateSummary: (summary: string) => void;
  onUpdateSkills: (skills: ResumeData['skills']) => void;
  onUpdateExperience: (experience: ResumeData['experience']) => void;
  onUpdateProjects: (projects: ResumeData['projects']) => void;
}

export const ResumeEditor = ({
  resumeData,
  onUpdatePersonalInfo,
  onUpdateSummary,
  onUpdateSkills,
  onUpdateExperience,
  onUpdateProjects
}: ResumeEditorProps) => {
  const addExperience = () => {
    const newExp = {
      company: "",
      position: "",
      period: "",
      current: false,
      achievements: [""]
    };
    onUpdateExperience([...resumeData.experience, newExp]);
  };

  const updateExperience = (index: number, field: string, value: unknown) => {
    const updated = resumeData.experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onUpdateExperience(updated);
  };

  const addProject = () => {
    const newProject = {
      name: "",
      period: "",
      tech: "",
      background: "",
      achievements: [""]
    };
    onUpdateProjects([...resumeData.projects, newProject]);
  };

  const updateProject = (index: number, field: string, value: unknown) => {
    const updated = resumeData.projects.map((proj, i) => 
      i === index ? { ...proj, [field]: value } : proj
    );
    onUpdateProjects(updated);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 个人信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">个人信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label>
            <input
              type="text"
              value={resumeData.personalInfo.name}
              onChange={(e) => onUpdatePersonalInfo('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">职位</label>
            <input
              type="text"
              value={resumeData.personalInfo.title}
              onChange={(e) => onUpdatePersonalInfo('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">地址</label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => onUpdatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出生年月</label>
            <input
              type="text"
              value={resumeData.personalInfo.birth}
              onChange={(e) => onUpdatePersonalInfo('birth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">电话</label>
            <input
              type="text"
              value={resumeData.personalInfo.phone}
              onChange={(e) => onUpdatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => onUpdatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 个人简介 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">个人简介</h3>
        <textarea
          value={resumeData.summary}
          onChange={(e) => onUpdateSummary(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          placeholder="请输入个人简介..."
        />
      </div>

      {/* 技能 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">技术技能</h3>
        <div className="space-y-4">
          {Object.entries(resumeData.skills).map(([category, skills]) => (
            <div key={category}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {category === 'languages' ? '语言基础' :
                 category === 'frameworks' ? '前端框架' :
                 category === 'ui' ? 'UI/样式框架' :
                 category === 'tools' ? '工程化工具' : 'AI开发助手'}
              </label>
              <input
                type="text"
                value={skills.join(', ')}
                onChange={(e) => {
                  const newSkills = { ...resumeData.skills };
                  newSkills[category as keyof typeof newSkills] = e.target.value.split(', ').filter(s => s.trim());
                  onUpdateSkills(newSkills);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="用逗号分隔技能..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* 工作经历 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">工作经历</h3>
          <button
            onClick={addExperience}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            添加经历
          </button>
        </div>
        <SimpleBar 
          style={{ maxHeight: '24rem' }}
          autoHide={true}
        >
          <div className="space-y-4 pr-2">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-md p-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="公司名称"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    placeholder="职位"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => updateExperience(index, 'period', e.target.value)}
                  placeholder="工作时间"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm mb-3 dark:bg-gray-700 dark:text-white"
                />
                <div className="space-y-2">
                  {exp.achievements.map((achievement, achIndex) => (
                    <textarea
                      key={achIndex}
                      value={achievement}
                      onChange={(e) => {
                        const newAchievements = [...exp.achievements];
                        newAchievements[achIndex] = e.target.value;
                        updateExperience(index, 'achievements', newAchievements);
                      }}
                      placeholder="工作成就..."
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white resize-none"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newAchievements = [...exp.achievements, ''];
                      updateExperience(index, 'achievements', newAchievements);
                    }}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + 添加成就
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>

      {/* 项目经历 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">项目经历</h3>
          <button
            onClick={addProject}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            添加项目
          </button>
        </div>
        <SimpleBar 
          style={{ maxHeight: '24rem' }}
          autoHide={true}
        >
          <div className="space-y-4 pr-2">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-md p-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    placeholder="项目名称"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={project.period}
                    onChange={(e) => updateProject(index, 'period', e.target.value)}
                    placeholder="项目时间"
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <input
                  type="text"
                  value={project.tech}
                  onChange={(e) => updateProject(index, 'tech', e.target.value)}
                  placeholder="技术栈"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm mb-3 dark:bg-gray-700 dark:text-white"
                />
                <textarea
                  value={project.background}
                  onChange={(e) => updateProject(index, 'background', e.target.value)}
                  placeholder="项目背景"
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm mb-3 dark:bg-gray-700 dark:text-white resize-none"
                />
                <div className="space-y-2">
                  {project.achievements.map((achievement, achIndex) => (
                    <textarea
                      key={achIndex}
                      value={achievement}
                      onChange={(e) => {
                        const newAchievements = [...project.achievements];
                        newAchievements[achIndex] = e.target.value;
                        updateProject(index, 'achievements', newAchievements);
                      }}
                      placeholder="项目成就..."
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white resize-none"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newAchievements = [...project.achievements, ''];
                      updateProject(index, 'achievements', newAchievements);
                    }}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + 添加成就
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};