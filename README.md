# Meal Planner

## Environment Files

In order to build this application, you will need two environment files: `.env.local` and `.env.production`. They have he following data in them:

```
VITE_FIREBASE_API_KEY=your-dev-api-key-here
VITE_FIREBASE_MESSAGING_SENDER_ID=your-dev-sender-id-here
VITE_FIREBASE_APP_ID=your-dev-app-id-here
```

Obtain the appropriate information from the Firebase console.

## Build and Deploy

This application uses [pnpm](https://pnpm.io/) with [changesets](https://pnpm.io/using-changesets). The general workflow is:

1. Create a branch from the Jira task.
1. `pnpm changeset` - describe in a sentence what you will be doing
1. Test, Code, Commit, Test, Code, Commit, etc.
1. Pull request, move Jira task to in-review
1. When reviewing the PR, be sure to also perform the following:
   1. `pnpm build`
   1. `pnpm test`
   1. `pnpm lint`
1. Merge pull request via BitBucket, moving Jira task to done
1. Repeat

Once enough has been done to justify releasing, then:

1. `pnpm bump`
1. Review and commit
1. `pnpm release`

## ❗️ Important Links

- 📄 [Vuetify Docs](https://vuetifyjs.com/)
- 🚨 [Vuetify Issues](https://issues.vuetifyjs.com/)
- 💬 [Vuetify Discord](https://community.vuetifyjs.com)
  🔥 [Firebase Console](https://console.firebase.google.com/project/kws-meal-planner/overview)
  📑 [Firebase Docs](https://firebase.google.com/docs)
