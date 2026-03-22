# trader-analytics

Bu dosya, geliştirme sürecinde güvenli değişiklik yönetimini sağlamak amacıyla oluşturulmuştur.

---

## Geliştirme Akışı

```
[Yeni Özellik / Düzeltme]
        ↓
  feature branch aç
        ↓
  Değişiklikleri uygula
        ↓
  Testleri çalıştır
        ↓
  ✅ Testler geçti  →  PR aç  →  main'e merge  →  Eski branch sil
  ❌ Testler geçmedi →  Düzelt, tekrar test et
```

---

## Branch Kuralları

| Branch | Amaç |
|---|---|
| `main` | Kararlı, production-ready kod |
| `feature/<isim>` | Yeni özellik geliştirme |
| `fix/<isim>` | Hata düzeltme |
| `test/<isim>` | Yalnızca test amaçlı deneme |

---

## Silme Onay Kuralı

> Her branch veya dosya silme işlemi öncesinde **kullanıcıdan onay alınmalıdır.**
> Onay alınmadan hiçbir şey silinmez.

---

## Test Zorunluluğu

- Her yeni özellik `feature/` branch'inde test edilir.
- Testler başarılı olmadan `main` branch'e merge yapılmaz.
- Merge sonrası eski branch otomatik silinir (onay alınarak).

---

## Versiyon Geçmişi

| Versiyon | Tarih | Açıklama |
|---|---|---|
| v0.1.0 | 2026-03-22 | İlk kurulum |
