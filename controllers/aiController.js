const axios = require('axios');
const Craft = require('../models/craft');

function buildPrompt(craftName, originState) {
  return `You are an expert on Indian traditional crafts. In 6 bullet points (short sentences), give:
- key features and materials,
- concise step-by-step making process,
- short history & origin,
- traditional uses (past),
- modern uses (today).
Craft: ${craftName}
Region/State: ${originState}
Keep it simple and factual.`;
}

function offlineFallback(craftName) {
  const map = {
    'Madhubani Painting': '• Folk art from Mithila (Bihar)...',
    'Banarasi Silk Saree': '• Woven silk from Varanasi with zari brocade...',
    // add items as needed
  };
  return map[craftName] || `No offline data for ${craftName}.`;
}

exports.getAiInfo = async (req, res) => {
  try {
    const craft = await Craft.findById(req.params.id);
    if (!craft) return res.status(404).send('Craft not found');

    const craftName = craft.name;
    const originState = craft.originState || 'India';
    // if DEEPSEEK_API_KEY present, call DeepSeek
    if (!process.env.DEEPSEEK_API_KEY) {
      const aiText = offlineFallback(craftName);
      return res.render('aiInfo', { craft, aiText, error: null });
    }

    const payload = {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a precise craft expert.' },
        { role: 'user', content: buildPrompt(craftName, originState) }
      ],
      temperature: 0.35
    };

    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', payload, {
      headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }
    });

    const aiText = response.data?.choices?.[0]?.message?.content || offlineFallback(craftName);
    res.render('aiInfo', { craft, aiText, error: null });
  } catch (err) {
    console.error(err.message);
    res.render('aiInfo', { craft: null, aiText: offlineFallback(req.params.id), error: 'AI error or offline fallback' });
  }
};
