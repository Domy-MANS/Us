# Us - 情感社交平台

<div align="center">
  <img src="Us.png" alt="Us Logo" width="200"/>

  **Us is many U, U belong to Us**

  *一个温暖的情感社交平台，让每个"你"都能找到属于自己的"我们"*

  [![GitHub stars](https://img.shields.io/github/stars/Domy-MANS/Us?style=social)](https://github.com/Domy-MANS/Us/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/Domy-MANS/Us?style=social)](https://github.com/Domy-MANS/Us/network)
  [![GitHub license](https://img.shields.io/github/license/Domy-MANS/Us)](https://github.com/Domy-MANS/Us/blob/main/LICENSE)

  [📖 使用指南](#-使用指南) | [🤝 贡献代码](#-贡献指南) | [⬇️ 下载使用](https://github.com/Domy-MANS/Us/archive/refs/heads/main.zip)
</div>

## 🌟 项目理念

**Us** 这个名字巧妙地利用了英语复数的概念：很多个 **U**（你）聚在一起，形成了 **Us**（我们）。这体现了平台的核心理念——将孤独的个体连接成温暖的群体。

## ✨ 主要功能

### 🎯 **个性化群体推荐**
- 基于年龄、性别、MBTI、职业等信息
- 智能推荐合适的 "Us" 群体
- 支持创建自定义群体

### 💝 **情感分享与支持**
- 三种情感类型：😭 悲伤/孤独、😎 快乐/积极、😟 焦虑/困惑
- 群体内情感分享和互动
- 点赞、评论、情感反馈系统

### 🤖 **AI 情感伙伴 - UsBot**
- 24/7 情感支持聊天机器人
- 双语支持（中文/英文）
- 本地 AI 模型，保护隐私
- 可拖拽的情感反应伴侣

### 📊 **用户行为分析**
- 实时用户行为追踪
- 情感状态分析
- 数据可视化图表
- 个人和群体统计报告

## 🏗️ 技术架构

### 前端
- **纯 HTML/CSS/JavaScript** - 轻量级单页应用
- **响应式设计** - 适配各种设备
- **实时交互** - 流畅的用户体验

### 后端服务
- **AI 聊天服务** (`us-ai-server/`) - 基于 Ollama 的本地 AI
- **日志服务** (`us-log-server.js`) - 用户行为追踪
- **数据分析** - Python 脚本生成统计图表

### AI 模型
- **Qwen2:1.5b** - 中文对话优化
- **Llama3.2:1b** - 英文对话支持
- **智能降级** - 多重备选方案

## 🚀 快速开始

### 环境要求
- Node.js 14+
- Python 3.7+ (用于数据分析)
- Ollama (本地 AI 模型)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/Domy-MANS/Us.git
cd Us
```

2. **安装 AI 服务依赖**
```bash
cd us-ai-server
npm install
```

3. **安装 Ollama 和 AI 模型**
```bash
# 安装 Ollama
brew install ollama

# 下载 AI 模型
ollama pull qwen2:1.5b
ollama pull llama3.2:1b
```

4. **启动服务**
```bash
# 启动日志服务器 (端口 4000)
node us-log-server.js

# 启动 AI 聊天服务器 (端口 3000)
cd us-ai-server
node server.js
```

5. **打开应用**
在浏览器中打开 `Us.html` 文件

## 📱 使用指南

1. **注册信息** - 填写年龄、性别、MBTI 等基本信息
2. **选择群体** - 加入推荐的 "Us" 群体或创建自定义群体
3. **分享情感** - 在群体中分享你的感受和想法
4. **AI 聊天** - 点击 "Help U" 与 UsBot 进行情感支持对话
5. **查看统计** - 了解自己的使用习惯和情感变化

## 🎨 项目特色

- **🔒 隐私保护** - 本地 AI 模型，数据不上传
- **💰 完全免费** - 无需 API 费用，本地运行
- **🌍 双语支持** - 中英文智能切换
- **📈 数据驱动** - 详细的用户行为分析
- **🎭 情感智能** - 理解和回应用户情感需求

## 📊 数据分析功能

项目包含完整的数据分析系统：
- 用户行为统计
- 情感趋势分析
- 群体活跃度报告
- 可视化图表生成

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**Domy Yu (于梓方)**
- 项目创建者和主要开发者
- 致力于通过技术连接人心，创造温暖的数字社区

## 🙏 致谢

感谢所有为情感健康和社交连接做出贡献的开源项目和社区。

---

<div align="center">
  <strong>Us is many U, U belong to Us</strong><br>
  让每个人都能找到属于自己的温暖群体 💙
</div>
