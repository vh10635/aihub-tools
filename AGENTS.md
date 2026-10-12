<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the uploaded directory data in a shared data module and render directory, video workflow, and installation as distinct TanStack routes so every original feature remains accessible.
- Use a shared application shell and global semantic design tokens to keep the visual identity consistent across pages.
- Keep installation assets in public and register a network-first navigation service worker so the installable app does not cache stale pages.
