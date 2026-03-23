import { NextRequest, NextResponse } from "next/server";

const CATEGORIES = [
  "事務用品費","交際費","旅費交通費","外注費","ソフトウェア",
  "広告宣伝費","備品・設備費","水道光熱費","売上","その他",
];

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body as { imageBase64: string; mimeType: string };

    if (!imageBase64) {
      return NextResponse.json({ error: "画像データがありません" }, { status: 400 });
    }

    const prompt = `この画像はレシート・領収書・請求書・スクリーンショットです。
以下の情報をJSONで返してください。情報が読み取れない場合はnullにしてください。

{
  "date": "YYYY-MM-DD形式の日付（不明な場合はnull）",
  "vendor": "取引先・店舗名（不明な場合はnull）",
  "amount": "金額（数値のみ、税込合計金額、不明な場合はnull）",
  "category": "以下のカテゴリから最も適切なもの1つ: ${CATEGORIES.join("、")}",
  "note": "補足情報があれば（商品名、目的など、なければnull）"
}

注意：
- amountは税込の合計金額を数値で返す
- 売上（収入）の場合はcategoryを「売上」にする
- 経費の場合は内容に最も近いカテゴリを選ぶ
- JSONのみ返す（説明文不要）`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                  detail: "low",
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI API error:", err);
      return NextResponse.json({ error: "AI読み取りに失敗しました" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    // JSONを抽出（コードブロックがある場合も対応）
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "読み取り結果を解析できませんでした" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error("OCR route error:", e);
    return NextResponse.json({ error: "読み取り中にエラーが発生しました" }, { status: 500 });
  }
}
