import { PrismaClient, ToolType, ToolStatus, WebsiteStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据...');

  // 创建工具分类
  const toolCategories = await Promise.all([
    prisma.toolCategory.upsert({
      where: { name: '生活工具' },
      update: {},
      create: {
        name: '生活工具',
        icon: '🏠',
        sortOrder: 1,
      },
    }),
    prisma.toolCategory.upsert({
      where: { name: '开发工具' },
      update: {},
      create: {
        name: '开发工具',
        icon: '💻',
        sortOrder: 2,
      },
    }),
    prisma.toolCategory.upsert({
      where: { name: '设计工具' },
      update: {},
      create: {
        name: '设计工具',
        icon: '🎨',
        sortOrder: 3,
      },
    }),
    prisma.toolCategory.upsert({
      where: { name: '实用工具' },
      update: {},
      create: {
        name: '实用工具',
        icon: '🔧',
        sortOrder: 4,
      },
    }),
    prisma.toolCategory.upsert({
      where: { name: '安全工具' },
      update: {},
      create: {
        name: '安全工具',
        icon: '🔒',
        sortOrder: 5,
      },
    }),
  ]);

  console.log('工具分类创建完成');

  // 创建工具
  const tools = [
    {
      name: '牛马粮食计算器',
      description: '实时计算工资收入，让你知道每分每秒都在赚钱',
      icon: '💰',
      categoryId: toolCategories.find(c => c.name === '生活工具')!.id,
      color: 'from-green-400 to-blue-500',
      componentName: 'SalaryCalculator',
      type: ToolType.INTERNAL,
      status: ToolStatus.ACTIVE,
      sortOrder: 1,
    },
    {
      name: 'JSON格式化',
      description: '美化和验证JSON数据，支持压缩和展开',
      icon: '📋',
      categoryId: toolCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-purple-400 to-pink-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 1,
    },
    {
      name: 'Base64编解码',
      description: '文本和Base64之间的相互转换工具',
      icon: '🔐',
      categoryId: toolCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-yellow-400 to-orange-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 2,
    },
    {
      name: 'URL编解码',
      description: 'URL编码和解码，处理特殊字符',
      icon: '🔗',
      categoryId: toolCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-blue-400 to-cyan-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 3,
    },
    {
      name: '颜色选择器',
      description: '选择颜色并获取各种格式的颜色值',
      icon: '🎨',
      categoryId: toolCategories.find(c => c.name === '设计工具')!.id,
      color: 'from-pink-400 to-red-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 1,
    },
    {
      name: '二维码生成器',
      description: '生成各种内容的二维码',
      icon: '📱',
      categoryId: toolCategories.find(c => c.name === '实用工具')!.id,
      color: 'from-indigo-400 to-purple-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 1,
    },
    {
      name: '密码生成器',
      description: '生成安全的随机密码',
      icon: '🔑',
      categoryId: toolCategories.find(c => c.name === '安全工具')!.id,
      color: 'from-red-400 to-pink-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 1,
    },
    {
      name: '时间戳转换',
      description: '时间戳和日期时间的相互转换',
      icon: '⏰',
      categoryId: toolCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-teal-400 to-green-500',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 4,
    },
    {
      name: 'Markdown预览',
      description: '实时预览Markdown文档效果',
      icon: '📝',
      categoryId: toolCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-gray-400 to-gray-600',
      type: ToolType.INTERNAL,
      status: ToolStatus.DEVELOPING,
      sortOrder: 5,
    },
  ];

  for (const tool of tools) {
    const existingTool = await prisma.tool.findFirst({
      where: { name: tool.name },
    });
    
    if (!existingTool) {
      await prisma.tool.create({
        data: tool,
      });
    }
  }

  console.log('工具创建完成');

  // 创建网站分类
  const websiteCategories = await Promise.all([
    prisma.websiteCategory.upsert({
      where: { name: '开发平台' },
      update: {},
      create: {
        name: '开发平台',
        icon: '🚀',
        sortOrder: 1,
      },
    }),
    prisma.websiteCategory.upsert({
      where: { name: '学习资源' },
      update: {},
      create: {
        name: '学习资源',
        icon: '📚',
        sortOrder: 2,
      },
    }),
    prisma.websiteCategory.upsert({
      where: { name: '开发工具' },
      update: {},
      create: {
        name: '开发工具',
        icon: '🛠️',
        sortOrder: 3,
      },
    }),
    prisma.websiteCategory.upsert({
      where: { name: '设计工具' },
      update: {},
      create: {
        name: '设计工具',
        icon: '🎨',
        sortOrder: 4,
      },
    }),
    prisma.websiteCategory.upsert({
      where: { name: '部署平台' },
      update: {},
      create: {
        name: '部署平台',
        icon: '☁️',
        sortOrder: 5,
      },
    }),
    prisma.websiteCategory.upsert({
      where: { name: '素材资源' },
      update: {},
      create: {
        name: '素材资源',
        icon: '🖼️',
        sortOrder: 6,
      },
    }),
  ]);

  console.log('网站分类创建完成');

  // 创建网站
  const websites = [
    {
      name: 'GitHub',
      description: '全球最大的代码托管平台，开发者必备',
      icon: '🐙',
      categoryId: websiteCategories.find(c => c.name === '开发平台')!.id,
      color: 'from-gray-700 to-gray-900',
      url: 'https://github.com',
      sortOrder: 1,
    },
    {
      name: 'Stack Overflow',
      description: '程序员问答社区，解决编程问题的好地方',
      icon: '📚',
      categoryId: websiteCategories.find(c => c.name === '学习资源')!.id,
      color: 'from-orange-400 to-orange-600',
      url: 'https://stackoverflow.com',
      sortOrder: 1,
    },
    {
      name: 'MDN Web Docs',
      description: 'Web开发权威文档，前端开发者的圣经',
      icon: '📖',
      categoryId: websiteCategories.find(c => c.name === '学习资源')!.id,
      color: 'from-blue-500 to-blue-700',
      url: 'https://developer.mozilla.org',
      sortOrder: 2,
    },
    {
      name: 'CodePen',
      description: '在线代码编辑器，前端代码分享平台',
      icon: '✏️',
      categoryId: websiteCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-green-400 to-green-600',
      url: 'https://codepen.io',
      sortOrder: 1,
    },
    {
      name: 'Figma',
      description: '协作式界面设计工具，设计师和开发者的桥梁',
      icon: '🎨',
      categoryId: websiteCategories.find(c => c.name === '设计工具')!.id,
      color: 'from-purple-400 to-purple-600',
      url: 'https://figma.com',
      sortOrder: 1,
    },
    {
      name: 'Vercel',
      description: '前端部署平台，快速部署你的项目',
      icon: '🚀',
      categoryId: websiteCategories.find(c => c.name === '部署平台')!.id,
      color: 'from-black to-gray-800',
      url: 'https://vercel.com',
      sortOrder: 1,
    },
    {
      name: 'Netlify',
      description: '静态网站托管平台，简单易用的部署方案',
      icon: '🌐',
      categoryId: websiteCategories.find(c => c.name === '部署平台')!.id,
      color: 'from-teal-400 to-teal-600',
      url: 'https://netlify.com',
      sortOrder: 2,
    },
    {
      name: 'Unsplash',
      description: '高质量免费图片素材库，设计师的宝库',
      icon: '📷',
      categoryId: websiteCategories.find(c => c.name === '素材资源')!.id,
      color: 'from-gray-400 to-gray-600',
      url: 'https://unsplash.com',
      sortOrder: 1,
    },
    {
      name: 'Iconfont',
      description: '阿里巴巴图标库，丰富的矢量图标资源',
      icon: '🎯',
      categoryId: websiteCategories.find(c => c.name === '素材资源')!.id,
      color: 'from-red-400 to-red-600',
      url: 'https://iconfont.cn',
      sortOrder: 2,
    },
    {
      name: 'Can I Use',
      description: '查询浏览器兼容性，前端开发必备工具',
      icon: '🔍',
      categoryId: websiteCategories.find(c => c.name === '开发工具')!.id,
      color: 'from-yellow-400 to-yellow-600',
      url: 'https://caniuse.com',
      sortOrder: 2,
    },
  ];

  for (const website of websites) {
    const existingWebsite = await prisma.website.findFirst({
      where: { name: website.name },
    });
    
    if (!existingWebsite) {
      await prisma.website.create({
        data: website,
      });
    }
  }

  console.log('网站创建完成');
  console.log('数据初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });