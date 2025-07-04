const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const AI_CONFIG = {
  providers: [
    {
      name: 'ollama',
      url: 'http://localhost:11434/api/generate',
      models: {
        chinese: 'qwen2:1.5b',
        english: 'llama3.2:1b'
      },
      enabled: true
    },
    {
      name: 'huggingface',
      url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      token: '',
      enabled: true
    },
    {
      name: 'openai',
      url: 'https://api.openai.com/v1/chat/completions',
      token: "",
      enabled: true
    }
  ]
};

async function tryOllama(message) {
  try {
    const isChineseMessage = /[\u4e00-\u9fff]/.test(message);
    const projectInfo = isChineseMessage
      ? `重要信息：Us 是由 Domy Yu（于梓方）开发的情感社交平台。于梓方是这个项目的创建者和开发者。Us 的理念是"Us is many U, U belong to Us"，名字巧妙利用了英语复数概念，表示很多个 U（你）聚在一起形成 Us（我们）。`
      : `Important: Us is an emotional social platform created by Domy Yu. Domy Yu is the creator and developer of this project. The concept is "Us is many U, U belong to Us". The name "Us" cleverly uses English plural form, meaning many U's (you) come together to form Us (we).`;

    const systemPrompt = isChineseMessage
      ? `你是 UsBot，Us 应用中的情感支持伙伴。${projectInfo}

严格要求：
1. 只用中文回答，绝对不要混用任何英文单词
2. 保持温暖、简洁（1-2句话）
3. 准确回答关于项目和开发者的问题
4. 于梓方（Domy Yu）是Us项目的开发者和创建者

用户说："${message}"`
      : `You are UsBot, a caring emotional support companion for the "Us" app. ${projectInfo}

Strict requirements:
1. Respond only in English, no Chinese mixed in
2. Keep it warm and brief (1-2 sentences)
3. Answer accurately about the project and developer
4. Domy Yu is the developer and creator of the Us project

User says: "${message}"`;

    const ollamaConfig = AI_CONFIG.providers.find(p => p.name === 'ollama');
    const model = isChineseMessage ? ollamaConfig.models.chinese : ollamaConfig.models.english;

    const response = await axios.post(ollamaConfig.url, {
      model: model,
      prompt: systemPrompt,
      stream: false
    }, { timeout: 20000 });

    return response.data.response?.trim() || null;
  } catch (error) {
    console.log('🔄 Ollama not available, trying next provider...');
    return null;
  }
}

async function tryHuggingFace(message) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      { inputs: message },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );

    const reply = response.data[0]?.generated_text?.replace(message, '').trim();
    return reply || null;
  } catch (error) {
    console.log('🔄 Hugging Face not available, trying next provider...');
    return null;
  }
}

async function tryOpenAI(message) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'You are UsBot, a caring emotional support companion. Provide warm, empathetic responses in 1-2 sentences.'
        }, {
          role: 'user',
          content: message
        }],
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.providers[2].token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('🔄 OpenAI not available');
    return null;
  }
}

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log(`💬 User message: "${userMessage}"`);

  let reply = null;
  let usedProvider = '';

  reply = await tryOllama(userMessage);
  if (reply) {
    usedProvider = 'Ollama (Local)';
    console.log(`✅ Response from ${usedProvider}: "${reply}"`);
    return res.json({ reply, provider: usedProvider });
  }

  reply = await tryHuggingFace(userMessage);
  if (reply) {
    usedProvider = 'Hugging Face (Free)';
    console.log(`✅ Response from ${usedProvider}: "${reply}"`);
    return res.json({ reply, provider: usedProvider });
  }

  reply = await tryOpenAI(userMessage);
  if (reply) {
    usedProvider = 'OpenAI (Paid)';
    console.log(`✅ Response from ${usedProvider}: "${reply}"`);
    return res.json({ reply, provider: usedProvider });
  }

  const isChineseMessage = /[\u4e00-\u9fff]/.test(userMessage);
  const emotionalResponses = isChineseMessage ? [
    "💙 我听到了你的声音。有时候分享感受本身就很有帮助。",
    "🤗 谢谢你信任我，愿意分享你的感受。你并不孤单。",
    "💝 你的情感是真实有效的。无论你现在感受到什么都是可以的。",
    "🌟 我陪着你。慢慢来，记住困难的感受总会过去的。",
    "💪 你能主动寻求帮助真的很勇敢。这需要很大的勇气。",
    "🕊️ 有时候最治愈的就是知道有人在乎你。我在乎你。",
    "🌈 你的每一种感受都很重要。你很重要。谢谢你与我分享。"
  ] : [
    "💙 I hear you. Sometimes it helps just to share what you're feeling.",
    "🤗 Thank you for trusting me with your feelings. You're not alone in this.",
    "💝 Your emotions are valid. It's okay to feel whatever you're experiencing right now.",
    "🌟 I'm here with you. Take your time, and remember that difficult feelings do pass.",
    "💪 You're being so brave by reaching out. That takes real strength.",
    "🕊️ Sometimes the most healing thing is knowing someone cares. I care about you.",
    "🌈 Every feeling you have matters. You matter. Thank you for sharing with me."
  ];

  const fallbackReply = emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)];
  usedProvider = 'UsBot Emotional Support (Offline)';

  console.log(`💝 All AI providers unavailable, using emotional fallback: "${fallbackReply}"`);
  res.json({ reply: fallbackReply, provider: usedProvider });
});

app.listen(PORT, () => {
  console.log(`🚀 Service is running: http://localhost:${PORT}`);
});
