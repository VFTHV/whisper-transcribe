# Commit

Create a commit in the whisper-transcribe repository:

- Repository: `VFTHV/whisper-transcribe`
- Workspace: `/Users/vadimfattakhov/Coding/whisper-transcribe`
- Remote: `origin` (`https://github.com/VFTHV/whisper-transcribe.git`)

## Steps

1. Run `git status --short --branch`, `git diff`, `git diff --cached`, and
   `git log -5 --format='%s'`.
2. Review all tracked and untracked changes. Do not stage secrets, `.env`
   files, `node_modules/`, `dist/`, or `.netlify/`.
3. Stage only files relevant to the requested change (`git add .` when the
   user asks to commit all changes).
4. Compose a one-line Conventional Commits message (max 15 words, imperative
   mood, no trailing period). Use a type prefix such as `feat:`, `fix:`,
   `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, or `style:`.
5. Pass the message to `git commit` with a heredoc.
6. Run `git status --short --branch` and `git log -1 --oneline` to verify the
   commit.

Do not push unless the user explicitly requests it. Do not create an empty
commit when there are no changes.
