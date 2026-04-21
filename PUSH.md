# GitHub'a Push Rehberi — 3 komut

Kod `bupcore` klasöründe hazır. Bilgisayarında terminal aç, klasöre git:

```bash
cd ~/path/to/bupcore        # Cowork'ün kaydettiği workspace klasörün neredeyse oraya cd yap
```

## 1. Git başlat ve ilk commit

```bash
git init
git add .
git commit -m "chore: initial scaffold - bupcore studio (bupcore.ai/product)"
git branch -M main
```

## 2. Private repo'yu GitHub'da aç

https://github.com/organizations/bottomupapp/repositories/new

- **Repository name:** `bupcore`
- **Visibility:** Private
- **Initialize:** HİÇBİR ŞEY İŞARETLEME (README/gitignore/license yok — biz zaten dolduracağız)
- Create repository

## 3. Remote ekle ve push

```bash
git remote add origin git@github.com:bottomupapp/bupcore.git
git push -u origin main
```

(SSH yoksa HTTPS: `git remote add origin https://github.com/bottomupapp/bupcore.git` — GitHub kullanıcı adı ve PAT sorar.)

## 4. Bana "pushladım" de

Ben Railway'e dönüp `lovely-insight` servisini bu repo'ya bağlayacağım → otomatik build → canlıya çıkar.

---

## Hızlı checklist

- [ ] `git log --oneline` → 1 commit görünüyor
- [ ] `git remote -v` → origin bottomupapp/bupcore gösteriyor
- [ ] GitHub'da `bottomupapp/bupcore` repo'sunda tüm dosyalar görünüyor
