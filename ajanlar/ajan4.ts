/**
 * AJAN 4 — Versiyon Kontrol & Test Güvencesi Ajanı
 *
 * Görev:
 *  - Değişiklik öncesi mevcut kodu güvenceye alır (feature branch)
 *  - Yeni özelliği/düzeltmeyi önce test branch'inde dener
 *  - Testler başarılıysa main'e PR açar ve merge eder
 *  - Her silme işleminden önce kullanıcıdan onay alır
 *  - İş bitince feature branch'i temizler (git ile)
 *
 * Repo: https://github.com/TWPodos/trader-analytics
 *
 * Kullanım:
 *   ANTHROPIC_API_KEY=... npx ts-node ajanlar/ajan4.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GITHUB_OWNER = "TWPodos";
const GITHUB_REPO = "trader-analytics";
const BASE_BRANCH = "main";

// ---------------------------------------------------------------------------
// Kullanıcıdan onay alma
// ---------------------------------------------------------------------------

async function kullanicidanOnayAl(mesaj: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`\n⚠️  ONAY GEREKYİOR: ${mesaj}\n   Devam etmek istiyor musun? (e/h): `, (cevap) => {
      rl.close();
      resolve(cevap.trim().toLowerCase() === "e");
    });
  });
}

// ---------------------------------------------------------------------------
// Araç tanımları (GitHub işlemleri için)
// ---------------------------------------------------------------------------

const tools: Anthropic.Tool[] = [
  {
    name: "github_branch_olustur",
    description:
      "Belirtilen isimde yeni bir feature branch oluşturur. Değişiklik öncesi mevcut kodu güvenceye alır.",
    input_schema: {
      type: "object",
      properties: {
        branch_adi: {
          type: "string",
          description: "Oluşturulacak branch adı (örn. feature/yeni-ozellik, fix/hata-duzelt)",
        },
        aciklama: {
          type: "string",
          description: "Branch'in amacının kısa açıklaması",
        },
      },
      required: ["branch_adi", "aciklama"],
    },
  },
  {
    name: "github_test_calistir",
    description:
      "Feature branch üzerindeki değişiklikler için testleri çalıştırır ve sonuçları raporlar.",
    input_schema: {
      type: "object",
      properties: {
        branch_adi: {
          type: "string",
          description: "Test edilecek branch",
        },
        test_tipi: {
          type: "string",
          enum: ["birim", "entegrasyon", "tum"],
          description: "Çalıştırılacak test türü",
        },
      },
      required: ["branch_adi", "test_tipi"],
    },
  },
  {
    name: "github_pr_ac",
    description:
      "Testler başarılıysa feature branch'ten main'e Pull Request açar.",
    input_schema: {
      type: "object",
      properties: {
        branch_adi: {
          type: "string",
          description: "PR açılacak kaynak branch",
        },
        baslik: {
          type: "string",
          description: "Pull Request başlığı",
        },
        aciklama: {
          type: "string",
          description: "Yapılan değişikliklerin detaylı açıklaması",
        },
      },
      required: ["branch_adi", "baslik", "aciklama"],
    },
  },
  {
    name: "github_branch_sil",
    description:
      "Merge sonrası eski feature branch'i siler. UYARI: Bu işlem için kullanıcı onayı zorunludur.",
    input_schema: {
      type: "object",
      properties: {
        branch_adi: {
          type: "string",
          description: "Silinecek branch adı",
        },
        neden: {
          type: "string",
          description: "Silme gerekçesi",
        },
      },
      required: ["branch_adi", "neden"],
    },
  },
  {
    name: "github_surum_guncelle",
    description:
      "trader-analytics.md dosyasındaki versiyon geçmişini yeni sürümle günceller.",
    input_schema: {
      type: "object",
      properties: {
        versiyon: {
          type: "string",
          description: "Yeni versiyon numarası (örn. v1.2.0)",
        },
        degisiklik_ozeti: {
          type: "string",
          description: "Bu versiyonda yapılan değişikliklerin özeti",
        },
      },
      required: ["versiyon", "degisiklik_ozeti"],
    },
  },
];

// ---------------------------------------------------------------------------
// Araç çalıştırıcı — gerçek Rube/GitHub entegrasyonu buraya gelir
// ---------------------------------------------------------------------------

async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  if (name === "github_branch_sil") {
    const { branch_adi, neden } = input as { branch_adi: string; neden: string };
    const onay = await kullanicidanOnayAl(
      `"${branch_adi}" branch'i silinecek.\n   Neden: ${neden}`
    );
    if (!onay) {
      return JSON.stringify({
        durum: "iptal",
        mesaj: `Kullanıcı "${branch_adi}" branch'inin silinmesini reddetti. Branch korunuyor.`,
      });
    }
    return JSON.stringify({
      durum: "silindi",
      branch: branch_adi,
      mesaj: `"${branch_adi}" branch'i kullanıcı onaylıyla silindi.`,
      git_komutu: `git push origin --delete ${branch_adi}`,
    });
  }

  if (name === "github_branch_olustur") {
    const { branch_adi, aciklama } = input as { branch_adi: string; aciklama: string };
    return JSON.stringify({
      durum: "olusturuldu",
      branch: branch_adi,
      kaynak: BASE_BRANCH,
      aciklama,
      repo: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${branch_adi}`,
      git_komutu: `git checkout -b ${branch_adi} origin/${BASE_BRANCH}`,
    });
  }

  if (name === "github_test_calistir") {
    const { branch_adi, test_tipi } = input as { branch_adi: string; test_tipi: string };
    const basarili = Math.random() > 0.2;
    return JSON.stringify({
      durum: basarili ? "basarili" : "basarisiz",
      branch: branch_adi,
      test_tipi,
      toplam_test: 42,
      gecen: basarili ? 42 : 38,
      kalan: basarili ? 0 : 4,
      sure_ms: Math.floor(Math.random() * 3000 + 500),
      mesaj: basarili
        ? "Tüm testler başarıyla geçti. Main'e merge güvenli."
        : "4 test başarısız. Merge yapmadan önce düzeltilmeli.",
    });
  }

  if (name === "github_pr_ac") {
    const { branch_adi, baslik, aciklama } = input as {
      branch_adi: string;
      baslik: string;
      aciklama: string;
    };
    const prNumarasi = Math.floor(Math.random() * 100 + 1);
    return JSON.stringify({
      durum: "acildi",
      pr_no: prNumarasi,
      baslik,
      aciklama,
      kaynak: branch_adi,
      hedef: BASE_BRANCH,
      url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/pull/${prNumarasi}`,
      mesaj: `PR #${prNumarasi} açıldı. Onaylandıktan sonra ${BASE_BRANCH}'e merge edilebilir.`,
    });
  }

  if (name === "github_surum_guncelle") {
    const { versiyon, degisiklik_ozeti } = input as {
      versiyon: string;
      degisiklik_ozeti: string;
    };
    const tarih = new Date().toISOString().split("T")[0];
    return JSON.stringify({
      durum: "guncellendi",
      versiyon,
      tarih,
      degisiklik_ozeti,
      dosya: "trader-analytics.md",
      repo_url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/main/trader-analytics.md`,
    });
  }

  return JSON.stringify({ hata: "Bilinmeyen araç: " + name });
}

// ---------------------------------------------------------------------------
// Ana ajan döngüsü
// ---------------------------------------------------------------------------

export async function versiyonKontrolAjani(gorev: string): Promise<string> {
  const sistem_prompt = `Sen bir versiyon kontrol ve test güvencesi ajanısın.

Görevin:
1. Yeni özellik veya düzeltme için önce bir feature branch oluştur.
2. Değişiklikleri bu branch üzerinde test et.
3. Testler başarılıysa main'e PR aç.
4. Testler başarısız olursa merge yapma, kullanıcıyı uyar.
5. Merge sonrası eski branch'i sil — ama SİLMEDEN ÖNCE MUTLAKA kullanıcıdan onay al.
6. Her önemli değişiklikte versiyon geçmişini güncelle.

Repo: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}
Ana branch: ${BASE_BRANCH}

Kural: Silme işlemi için her zaman github_branch_sil aracını kullan. Bu araç otomatik olarak kullanıcıdan onay ister.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: gorev },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      thinking: { type: "adaptive" },
      system: sistem_prompt,
      tools,
      messages,
    });

    if (response.stop_reason === "end_turn") {
      const textBlock = response.content.find((b) => b.type === "text");
      return textBlock && textBlock.type === "text" ? textBlock.text : "";
    }

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const sonuc = await executeTool(
        block.name,
        block.input as Record<string, unknown>
      );
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: sonuc,
      });
    }

    if (toolResults.length === 0) break;

    messages.push({ role: "user", content: toolResults });
  }

  return "";
}

// ---------------------------------------------------------------------------
// Doğrudan çalıştırma
// ---------------------------------------------------------------------------

if (require.main === module) {
  const gorev = process.argv.slice(2).join(" ") ||
    "Yeni bir feature branch aç, testleri çalıştır ve başarılıysa main'e merge et, ardından eski branch'i temizle.";

  console.log("\n🔒 Versiyon Kontrol & Test Güvencesi Ajanı başlatıldı");
  console.log(`📦 Repo: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`📋 Görev: ${gorev}\n`);

  versiyonKontrolAjani(gorev)
    .then((sonuc) => {
      console.log("\n=== AJAN RAPORU ===\n");
      console.log(sonuc);
    })
    .catch(console.error);
}
