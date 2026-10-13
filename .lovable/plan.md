# Add sign-in to AI Hub

## What you will get
- A sign-in page at `/auth` that matches the AI Hub look: a dark navy panel with the robot artwork, a white card, coral-to-purple buttons, and tabs for **Sign in** and **Create account**.
- **Email + password** sign-up. New users get a "Check your inbox" screen and must click the link in the email before they can sign in.
- A **Continue with Google** button.
- **Forgot password** link and a `/reset-password` page.
- A small profile for each user (name and Google photo), shown as an avatar menu in the top bar with **Sign out**. When signed out, the top bar shows a **Sign in** button.
- All current pages (Discover, AI search, Video toolkit, Install) stay open to everyone. Signing in is optional for now.

## Things that work differently than you asked
- **GitHub sign-in is not supported** by the built-in login system. Google, Apple, and Microsoft are supported. I will add Google only unless you want Apple or Microsoft as well.
- **Verification emails:** the built-in login system sends them for you, with no setup. Resend is not needed. If you later want these emails to come from your own domain (for example `noreply@aihub.com`), you can connect a domain you own and I will brand the emails then.

## Your other goals (advice only, nothing gets built for these)
- **Open source on GitHub:** connect the project with **+ → GitHub → Connect project**. Then make the repository public and add an MIT license so anyone can use the code.
- **Earning money:** later options include a paid "Pro" plan, featured tool listings, or affiliate links. Payments can be added when you are ready.
- **IEEE paper:** write about the AI search feature, which matches your request to tools and then uses AI to rank them. A public GitHub repository and a live link will support the paper.
- **Better domain:** go to Project Settings → Domains → Buy new domain (paid plans only). Short names work best, for example `aihub.tools` or `getaihub.app`. The free address stays `aihub-tools.lovable.app`.

## Technical details
- Turn on Lovable Cloud, email/password sign-in, and Google sign-in (through the managed Lovable broker).
- Create a `profiles` table with `id` (references auth.users, deleted with the user), `display_name`, `avatar_url`, plus grants, row-level security so users can only read and update their own row, and a trigger that creates the profile when a user signs up.
- New files: `src/routes/auth.tsx`, `src/routes/reset-password.tsx`, and an auth hook and account menu inside `src/components/hub/`. Update `app-shell.tsx` so the top bar shows the session state, and add one `onAuthStateChange` listener in `__root.tsx`.
- Sign-up sets `emailRedirectTo` to the site origin. Each new page gets its own head metadata.
- Verify with Playwright: the sign-up form, the "check your email" state, the Google button, and that existing pages still work.
