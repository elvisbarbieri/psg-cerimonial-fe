# Deploy cerimonial-psg to Azure + custom domain

Step-by-step guide (CLI). You need: Azure account, credit card (for domain + Azure), and your API keys from `.env.local`.

**Time:** ~1–2 hours the first time (DNS can take up to 48h, usually much less).

---

## Overview

| Step | What |
|------|------|
| 1 | Buy a domain |
| 2 | Install Azure CLI and log in |
| 3 | Create App Service and deploy the site |
| 4 | Set environment variables (API secrets) |
| 5 | Point your domain to Azure (DNS) |
| 6 | Enable free HTTPS certificate |

Your site runs on **Azure App Service (Linux, Node 22)** at:

`https://YOUR-APP-NAME.azurewebsites.net`

Then you add `www.yourdomain.com` on top.

---

## Step 1 — Buy a domain

You cannot buy a domain inside this repo; you do it at a registrar.

### Option A — Brazil (`.com.br`)

1. Go to [https://registro.br](https://registro.br)
2. Create an account and search for a name (e.g. `patriciagarcia.com.br`)
3. Pay and register
4. Later you will edit **DNS** in the Registro.br panel (Step 5)

### Option B — International (`.com`, etc.)

1. [Cloudflare](https://www.cloudflare.com/products/registrar/) or [Namecheap](https://www.namecheap.com)
2. Buy the domain
3. Use their DNS panel for Step 5

**Tip:** For the first deployment, use **`www`** (e.g. `www.yoursite.com.br`). It is easier than the bare domain (`yoursite.com.br`).

---

## Step 2 — Install Azure CLI and log in

### Linux

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az version
```

### Log in

```bash
az login
```

Browser opens → sign in with your Microsoft account.

### Choose subscription (if you have more than one)

```bash
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_NAME_OR_ID"
```

---

## Step 3 — Create Azure resources and deploy

Open a terminal in the project folder:

```bash
cd /home/ebarbieri/Documentos/cerimonial-psg
```

### 3.1 Choose a unique app name

The name must be **globally unique** (letters, numbers, hyphens only):

```bash
export APP_NAME="cerimonial-psg-YOURNAME"   # example: cerimonial-psg-ebarbieri
export RESOURCE_GROUP="rg-cerimonial-psg"
# Region: eastus works on most subscriptions (avoid brazilsouth if quota is 0)
export LOCATION="eastus"
```

### 3.2 Run the deploy script

```bash
chmod +x scripts/deploy-azure.sh
./scripts/deploy-azure.sh
```

This script:

- Creates resource group + App Service plan (B1 Linux) + Web App
- Configures Node 22 and `npm run start`
- Zips the project and uploads it (Azure runs `npm install` and `npm run build`)

### 3.3 Or run the commands manually

```bash
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

az appservice plan create \
  --name plan-cerimonial-psg \
  --resource-group "$RESOURCE_GROUP" \
  --sku B1 \
  --is-linux

az webapp create \
  --resource-group "$RESOURCE_GROUP" \
  --plan plan-cerimonial-psg \
  --name "$APP_NAME" \
  --runtime "NODE:22-lts"

az webapp config set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --startup-file "npm run start"

az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --settings \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    WEBSITE_NODE_DEFAULT_VERSION="~22" \
    NODE_ENV=production
```

Create zip and deploy:

```bash
zip -r deploy.zip . \
  -x "node_modules/*" -x ".next/*" -x ".git/*" -x ".env*" -x "deploy.zip"

az webapp deploy \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --src-path deploy.zip \
  --type zip

rm deploy.zip
```

### 3.4 Watch logs if something fails

```bash
az webapp log tail --resource-group "$RESOURCE_GROUP" --name "$APP_NAME"
```

### 3.5 Test the Azure URL

Open in the browser:

```text
https://YOUR-APP-NAME.azurewebsites.net
```

If you see an error, continue to Step 4 (env vars are often missing).

---

## Step 4 — Set environment variables (required)

Copy values from your local `.env.local` (never commit that file).

```bash
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --settings \
    CONTENT_API_URL="https://psg-cerimonial-website.azurewebsites.net/api/content" \
    CONTENT_API_CODE="PASTE_YOUR_CODE" \
    CONTACT_API_URL="https://psg-cerimonial-website.azurewebsites.net/api/contact" \
    CONTACT_API_CODE="PASTE_YOUR_CODE"
```

Optional:

```bash
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --settings \
    DIGITAL_SOLUTIONS_VIDEO_FALLBACK_URL="https://..."
```

Restart the app:

```bash
az webapp restart --resource-group "$RESOURCE_GROUP" --name "$APP_NAME"
```

Test `https://YOUR-APP-NAME.azurewebsites.net` again.

---

## Step 5 — Connect your domain (DNS)

Replace:

- `YOUR-APP-NAME` → your App Service name  
- `www.yourdomain.com.br` → your real domain  

### 5.1 Tell Azure about your domain

```bash
export DOMAIN="www.yourdomain.com.br"

az webapp config hostname add \
  --resource-group "$RESOURCE_GROUP" \
  --webapp-name "$APP_NAME" \
  --hostname "$DOMAIN"
```

Azure may show a **verification ID** (TXT record). If asked, add it at your registrar and wait a few minutes.

### 5.2 Create DNS record at your registrar

In Registro.br / Cloudflare / Namecheap DNS panel:

| Type | Name / Host | Value / Points to |
|------|-------------|-------------------|
| **CNAME** | `www` | `YOUR-APP-NAME.azurewebsites.net` |

Example:

```text
www  →  CNAME  →  cerimonial-psg-ebarbieri.azurewebsites.net
```

**Root domain (`yourdomain.com.br` without www):** many registrars do not allow CNAME on `@`. Easiest approach:

- Redirect `@` → `https://www.yourdomain.com.br` in the registrar panel, **or**
- Use Azure DNS (advanced; not covered here)

### 5.3 Check DNS propagation

```bash
dig www.yourdomain.com.br CNAME +short
```

When it shows your `*.azurewebsites.net` host, continue.

---

## Step 6 — HTTPS (free certificate)

### Option A — Azure Portal (easiest for beginners)

1. [https://portal.azure.com](https://portal.azure.com)
2. Open your **Web App**
3. **Custom domains** → confirm domain is verified
4. **Certificates** → **Create App Service Managed Certificate** → select `www.yourdomain.com.br`
5. **Bindings** → add TLS/SSL binding (SNI SSL)
6. **Configuration** → **General settings** → **HTTPS Only** = **On**

### Option B — CLI (after DNS works)

```bash
az webapp config ssl create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --hostname "$DOMAIN"

az webapp config ssl list \
  --resource-group "$RESOURCE_GROUP" \
  --output table

# Copy thumbprint from the table, then:
az webapp config ssl bind \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --certificate-thumbprint "PASTE_THUMBPRINT" \
  --ssl-type SNI
```

Open:

```text
https://www.yourdomain.com.br
```

---

## Step 7 — Update the site later

From the project folder:

```bash
export APP_NAME="cerimonial-psg-YOURNAME"
export RESOURCE_GROUP="rg-cerimonial-psg"

./scripts/deploy-azure.sh
```

Or zip + `az webapp deploy` as in Step 3.3.

---

## Quick checklist

```text
[ ] Domain purchased
[ ] az login
[ ] APP_NAME set (unique)
[ ] ./scripts/deploy-azure.sh (or manual deploy)
[ ] https://APP_NAME.azurewebsites.net works
[ ] CONTENT_* and CONTACT_* app settings set
[ ] CNAME www → APP_NAME.azurewebsites.net
[ ] Custom hostname added in Azure
[ ] Managed certificate + HTTPS Only
[ ] https://www.yourdomain.com works
```

---

## Costs (approximate)

| Item | Typical cost |
|------|----------------|
| Domain `.com.br` | ~R$ 40/year |
| App Service B1 | ~US$ 13/month |
| Azure free trial | Credit for new accounts |

---

## Region and quota

If you see **"Operation cannot be completed without additional quota"** in `Brazil South` (or any region), your subscription has **0 VM quota** there. You do **not** need to deploy in Brazil.

**Use a region with quota** (pick one):

```bash
export LOCATION="eastus"        # US East — most common default
# export LOCATION="eastus2"
# export LOCATION="westeurope"  # Europe
# export LOCATION="centralus"
```

Check which regions allow App Service on your subscription:

```bash
az appservice list-locations --sku B1 --linux-workers-enabled --output table
```

If the resource group was already created in `brazilsouth`, create a **new** group in the new region:

```bash
export RESOURCE_GROUP="rg-cerimonial-psg-us"
export LOCATION="eastus"
./scripts/deploy-azure.sh
```

**Optional:** request quota increase in [Azure Portal](https://portal.azure.com) → Subscriptions → your subscription → **Usage + quotas** → search "App Service" / region — usually faster to switch region.

Latency from Brazil to `eastus` is typically acceptable for a marketing site.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Quota 0 in Brazil South | Set `LOCATION=eastus` (or `westeurope`) and use a new resource group |
| Application Error | `az webapp log tail` — check build failed or missing env vars |
| 500 on site | Set Step 4 variables and `az webapp restart` |
| Domain not verified | Wait for DNS; add TXT record if Azure asks |
| Build timeout on Azure | Run `npm run build` locally, include `.next` in zip (larger upload) |
| App name taken | Change `APP_NAME` to another unique name |

---

## Security notes

- Never commit `.env.local` or API codes to Git
- Rotate API codes if they were ever exposed
- Use **HTTPS Only** in production

For help with Azure billing or domain DNS at Registro.br, use their support docs; this guide only covers deploying **this** Next.js project.
