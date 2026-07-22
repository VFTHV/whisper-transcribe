# Pull request

Create or update a pull request for the whisper-transcribe repository:

- Repository: `VFTHV/whisper-transcribe`
- Workspace: `/Users/vadimfattakhov/Coding/whisper-transcribe`
- Remote: `origin` (`https://github.com/VFTHV/whisper-transcribe.git`)
- Base branch: `master`
- Head branch: the current branch

## Create pull request

1. Inspect `git status`, branch tracking, commits since `master`, and
   `git diff master...HEAD`.
2. Stop if the current branch is `master`.
3. Push the current branch with `git push -u origin HEAD` when it is not
   already up to date.
4. Create the pull request with `gh pr create`.
5. Format the title as `YYMMDD-description`, using lowercase words separated
   by hyphens.
6. Format the body as:

   ```markdown
   ## Changes

   - One implemented task per bullet
   ```

   Keep every bullet at ten words or fewer.
7. Return the pull request URL.

## Pull request summary

When asked to update the PR summary:

1. Inspect all commits in `master...HEAD`.
2. Update the body using `gh pr edit`.
3. Keep the `## Changes` heading and one concise bullet per implemented task,
   with no bullet longer than ten words.

Do not merge the pull request unless the user explicitly requests it.
