// supabase/functions/jazz-fortune-ai/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// 【關鍵改變】：直接引入 Google 官方為開發者準備的套件
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 處理瀏覽器 CORS 預檢
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, birthDate, mode, currentAlbum, currentArtist } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
        throw new Error("Supabase 雲端遺失了 GEMINI_API_KEY！");
    }

    const prompt = `
      你是一位精通爵士樂理、紫微斗數與人類圖的神秘占卜師。
      現在有一位讀者名叫「${name}」，生日是「${birthDate}」。
      他選擇了「${mode === 'humanDesign' ? '人類圖' : '占星/紫微'}」模式。
      今日為他抽出的命定專輯是 ${currentArtist || '未知'} 的《${currentAlbum || '未知'}》。
      
      請寫一段約 60 字的運勢分析，語氣要優雅、帶點爵士樂的即興感，並解釋這張專輯的氛圍如何呼應他今日的運勢。
      【最重要指令】：請務必使用「繁體中文（台灣）」來撰寫所有回覆，不可出現日文與簡體字。
    `

    // 初始化官方 SDK 大腦
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 使用目前最穩定且保證有效的 1.5-flash 模型
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 呼叫生成內容（SDK 會自動處理背後複雜的網址與格式）
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    return new Response(JSON.stringify({ ai_text: aiText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error("AI 運算錯誤:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})