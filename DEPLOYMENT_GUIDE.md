# 🚀 Guide de Déploiement - Novalife App

## Étape 1: Configurer Supabase ⚙️

### SQL à exécuter dans Supabase:
1. Allez sur: https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **"SQL Editor"** 
4. Créez une nouvelle query et copie-collez le contenu du fichier `SUPABASE_SETUP.sql`
5. Exécutez la query ✅

### Vérifier que la table existe:
- Allez dans **"Table Editor"**
- Vous devriez voir la table `characters`

---

## Étape 2: Initialiser Git (si pas déjà fait)

### Sur votre ordinateur (PowerShell):
```powershell
cd "C:\Users\elise\Documents\Novalife-App"
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
git init
git add .
git commit -m "Initial commit"
```

---

## Étape 3: Créer un repo GitHub

1. Allez sur: https://github.com/new
2. Nom: `Novalife-App`
3. Cliquez **"Create repository"**
4. Suivez les instructions pour pusher votre code local

### Commandes (remplacez `USERNAME` et `REPO`):
```powershell
git remote add origin https://github.com/USERNAME/Novalife-App.git
git branch -M main
git push -u origin main
```

---

## Étape 4: Déployer sur Vercel

1. Allez sur: https://vercel.com
2. Cliquez **"New Project"**
3. Sélectionnez votre repo GitHub `Novalife-App`
4. **IMPORTANT:** Ajoutez les variables d'environnement:
   - `NEXT_PUBLIC_SUPABASE_URL`: https://zkoaqqobubpbbakgrmfj.supabase.co
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sb_publishable_9bbY_mbZd2oua-oUVWkKFw_htpZ97UF
5. Cliquez **"Deploy"** 🚀

---

## ✅ C'est fait !

Votre app sera accessible à une URL comme:
```
https://novalife-app.vercel.app
```

Tous les patients seront sauvegardés dans Supabase ! 🎉
