# Sync DNS: studioarteventos.com.br → Azure frontend

Connect your domain **studioarteventos.com.br** to the Next.js site running on Azure App Service:

| Item | Value |
|------|--------|
| **Azure Web App (frontend)** | `psg-cerimonial-website-fe` |
| **Default Azure URL** | https://psg-cerimonial-website-fe.azurewebsites.net |
| **Resource group** | `psg-cerimonial-website` |
| **Region** | West Europe |
| **API (do not change DNS for this)** | `psg-cerimonial-website.azurewebsites.net` (Function App) |

---

## Overview

```text
User browser
    → studioarteventos.com.br  (your domain)
    → DNS at Registro.br (or other registrar)
    → psg-cerimonial-website-fe.azurewebsites.net
    → Your Next.js site
```

You will:

1. Add the domain in Azure App Service  
2. Create DNS records at your registrar (Registro.br)  
3. Wait for DNS propagation  
4. Enable free HTTPS (managed certificate)  
5. Test both `www` and root domain (optional)

**Recommended hostname:** `www.studioarteventos.com.br` (easiest).  
**Root domain** (`studioarteventos.com.br` without `www`) needs an extra step at Registro.br.

---

## Prerequisites

- Domain **studioarteventos.com.br** registered and active at [Registro.br](https://registro.br) (or another registrar)
- Access to the domain’s **DNS / Zona DNS** panel
- Azure CLI logged in: `az login`
- Site already working: https://psg-cerimonial-website-fe.azurewebsites.net

Set variables (run in terminal):

```bash
export RESOURCE_GROUP="psg-cerimonial-website"
export APP_NAME="psg-cerimonial-website-fe"
export DOMAIN_WWW="www.studioarteventos.com.br"
export DOMAIN_ROOT="studioarteventos.com.br"
export AZURE_HOST="${APP_NAME}.azurewebsites.net"
```

---

## Step 1 — Add custom domain in Azure

### 1.1 Add `www` (recommended first)

```bash
az webapp config hostname add \
  --resource-group "$RESOURCE_GROUP" \
  --webapp-name "$APP_NAME" \
  --hostname "$DOMAIN_WWW"
```

If Azure asks for **domain verification**, it may show a **TXT** record like:

| Type | Host | Value |
|------|------|--------|
| TXT | `asuid.www` or similar | (long string from Azure) |

Add that TXT record in Registro.br, wait 5–15 minutes, then run the command again or verify in the portal.

### 1.2 (Optional) Add root domain `@`

```bash
az webapp config hostname add \
  --resource-group "$RESOURCE_GROUP" \
  --webapp-name "$APP_NAME" \
  --hostname "$DOMAIN_ROOT"
```

Root domain often needs **additional verification** (TXT on `@`). Follow messages from Azure CLI or Portal.

### 1.3 Portal alternative

1. Open [Azure Portal](https://portal.azure.com)  
2. **App Services** → **psg-cerimonial-website-fe**  
3. **Custom domains** → **Add custom domain**  
4. Enter `www.studioarteventos.com.br`  
5. Follow the wizard (DNS + validation)

---

## Step 2 — Configure DNS at Registro.br

Log in at [https://registro.br](https://registro.br) → your domain → **DNS** / **Editar zona DNS**.

### 2.1 Record for `www` (required)

| Campo | Valor |
|--------|--------|
| **Tipo** | CNAME |
| **Nome / Host** | `www` |
| **Destino / Alvo** | `psg-cerimonial-website-fe.azurewebsites.net` |
| **TTL** | 3600 (or default) |

**Do not** add `https://` in the CNAME target — only the hostname.

### 2.2 Root domain `@` (studioarteventos.com.br)

Registro.br often **does not** support CNAME on `@`. Use one of these:

#### Option A — Redirect `@` → `www` (simplest)

In Registro.br:

- **Redirecionamento de endereço** / URL redirect  
- From: `studioarteventos.com.br`  
- To: `https://www.studioarteventos.com.br`

No Azure change needed for redirect-only; users typing the root URL still reach your site.

#### Option B — ALIAS / ANAME (if your plan supports it)

Point `@` to `psg-cerimonial-website-fe.azurewebsites.net` (same target as CNAME).

#### Option C — Azure DNS (advanced)

Delegate the domain to Azure DNS and use an **A record** to the App Service IP (shown in Custom domains wizard). More setup; use only if you need apex without redirect.

**Practical recommendation:** use **www** as primary + **redirect** from `@` to `www`.

### 2.3 Domain verification TXT (if Azure requested)

Add exactly what Azure shows, for example:

| Tipo | Nome | Valor |
|------|------|--------|
| TXT | `asuid` or `asuid.www` | (copy from Azure) |

---

## Step 3 — Wait for DNS propagation

Check from your computer:

```bash
dig www.studioarteventos.com.br CNAME +short
# Expected: psg-cerimonial-website-fe.azurewebsites.net.

nslookup www.studioarteventos.com.br
```

Propagation: **15 minutes to 48 hours** (often under 2 hours).

In Azure Portal → **Custom domains** → status should change to **Secured** / **Ready** after DNS is valid.

---

## Step 4 — HTTPS (free managed certificate)

### 4.1 Azure Portal (easiest)

1. **App Services** → **psg-cerimonial-website-fe**  
2. **Custom domains**  
3. Select `www.studioarteventos.com.br`  
4. **Add binding** → **App Service Managed Certificate** (free)  
5. **TLS/SSL settings** → ensure **HTTPS Only** = **On**

### 4.2 Azure CLI

After DNS is working:

```bash
# Create managed certificate for www
az webapp config ssl create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --hostname "$DOMAIN_WWW"

# List certificates and copy thumbprint
az webapp config ssl list \
  --resource-group "$RESOURCE_GROUP" \
  --output table

# Bind certificate (replace THUMBPRINT)
az webapp config ssl bind \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --certificate-thumbprint "THUMBPRINT" \
  --ssl-type SNI

# Force HTTPS
az webapp update \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_NAME" \
  --https-only true
```

Repeat for `$DOMAIN_ROOT` only if you added the root hostname in Azure (not needed if you only use redirect).

---

## Step 5 — Test

Open in browser:

- https://www.studioarteventos.com.br  
- https://studioarteventos.com.br (should redirect to `www` if you configured Step 2.2 Option A)

Check:

- Page loads (same content as https://psg-cerimonial-website-fe.azurewebsites.net)  
- Padlock (valid certificate)  
- Contact form submits  
- Images load from CDN  

---

## Step 6 — Keep Azure URL working (optional)

The default URL remains active:

`https://psg-cerimonial-website-fe.azurewebsites.net`

To avoid duplicate SEO URLs, you can later add a redirect from `*.azurewebsites.net` to your custom domain (optional; not covered here).

---

## Quick reference — DNS records

| Host | Type | Points to |
|------|------|-----------|
| `www` | CNAME | `psg-cerimonial-website-fe.azurewebsites.net` |
| `@` | Redirect URL | `https://www.studioarteventos.com.br` |
| `asuid` / `asuid.www` | TXT | (from Azure, if required) |

---

## Troubleshooting

| Problem | What to do |
|---------|------------|
| Domain “not verified” in Azure | Add TXT record Azure shows; wait 15 min |
| `dig` shows old DNS | Wait longer; clear local DNS cache |
| Certificate fails | DNS must resolve to your app first; retry managed cert |
| Site shows Azure default page | Wrong app or deploy failed — confirm app name `psg-cerimonial-website-fe` |
| Root domain does not work | Use Registro.br redirect `@` → `www` |
| API / form errors | API stays on `psg-cerimonial-website` — check `CONTENT_*` / `CONTACT_*` app settings on **fe** app |
| 502 on redeploy | Site may still run; use `scripts/deploy-azure-fe.sh` for updates |

---

## Redeploy after code changes

Domain DNS does not change when you update the app:

```bash
cd /home/ebarbieri/Documentos/cerimonial-psg
./scripts/deploy-azure-fe.sh
```

---

## Checklist

```text
[ ] az webapp config hostname add → www.studioarteventos.com.br
[ ] CNAME www → psg-cerimonial-website-fe.azurewebsites.net (Registro.br)
[ ] TXT verification record (if Azure asked)
[ ] dig / nslookup shows correct CNAME
[ ] Managed certificate created and bound
[ ] HTTPS Only enabled
[ ] Redirect @ → www (optional but recommended)
[ ] https://www.studioarteventos.com.br loads correctly
```

---

## Important: do not point API DNS here

Your backend API is the **Function App** `psg-cerimonial-website` (without `-fe`).

- **Frontend (this site):** `psg-cerimonial-website-fe.azurewebsites.net` → custom domain `www.studioarteventos.com.br`  
- **API:** keep using `psg-cerimonial-website.azurewebsites.net` in app settings (`CONTENT_API_URL`, `CONTACT_API_URL`)

Do **not** replace API URLs in Azure app settings with the marketing domain unless you also deploy the API on that hostname.
