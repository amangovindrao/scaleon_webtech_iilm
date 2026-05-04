<div align="center">
  <h1>🛡️ SCALEON ADMIN & BLOG MASTER GUIDE 🛡️</h1>
  <p><i>Your secure, colorful manual for managing the backend of your website!</i></p>
</div>

---

## 🚦 1. HOW TO ACCESS THE SECRET DASHBOARD
Your website features a completely hidden admin dashboard that normal visitors cannot see!

* **The Secret URL:** `yourwebsite.com/adminyashit`
* **Why it's secure:** It's locked behind Google Authentication and Role-Based Access Control (RBAC).

---

## 🔐 2. THE SYSTEM OWNER LOGIN (EMERGENCY BYPASS)
If you ever get locked out, there is a hardcoded **System Owner Access** module built into the page. 
Here are your super-secret credentials (you can change these in the `adminyashit/page.tsx` file on lines 102~112):

> 🟢 **OWNER ID:** `9026240970`
> 🔵 **SECURE PASSCODE:** `6397` (or `6393`)
> 🟣 **2FA CODE:** `6393`

Once you enter these, you completely bypass the Google Login and become the master Admin!

---

## 👥 3. HOW TO ADD NEW GUEST AUTHORS
When you want someone else (like a Guest Author) to write blogs for you:

1. Send them to `yourwebsite.com/adminyashit` and tell them to click **<span style="color: #4285F4">Continue with Google</span>**.
2. *They will hit a brick wall that says "Access Denied." This is perfect!*
3. You log into the dashboard (using the System Owner login above, or your Admin Google account).
4. Click on the 🗂️ **Members Access** tab.
5. You will see their Google Name and Picture appear on your screen!
6. Click the dropdown menu next to their name and change it to **<span style="color: #0ea5e9">Grant Author Rights</span>**.
7. *Magic!* When they refresh their screen, they will now see the Blog Editor instead of the Denied screen!

---

## ✍️ 4. HOW TO WRITE AND PUBLISH BLOGS
Once an Author is logged in, here is their flow:

* **The Articles CMS Tab:** This is the only tab Authors can see.
* **+ Write New Button:** Opens the Markdown Editor.
* **Markdown Formatting:** Authors can use standard markdown (`#` for big headings, `**bold**` for bold text) to write beautiful, formatting-rich articles.
* **Draft vs Published:**
  * 🟨 **Status: Draft** → Saves the blog to the database so you can keep working on it later. Nobody on the internet can see it.
  * 🟩 **Status: Published** → Instantly pushes the blog live to the `yourwebsite.com/blog` page!

---

## 🚨 5. CRITICAL ERRORS & FIXES

Did you see this error?
`<span style="color: red; font-family: monospace;">Firebase: Error (auth/configuration-not-found)</span>`

**Here is why that happens and how to fix it:**
This error means your Next.js application is trying to talk to Google Firebase, but it **cannot find your API Keys**. 

If this happens on your computer:
1. Make sure you created a file called `.env.local` inside the `ScaleOnNewWebsite` folder.
2. Make sure it contains your `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.

If this happens on **Hostinger / Vercel**:
1. You forgot to copy your keys to the live server!
2. Go to Hostinger > Your App > Environment Variables.
3. Paste all the `NEXT_PUBLIC_FIREBASE_` keys there exactly as they are in your local `.env` file! Restart the app, and the error will vanish!
