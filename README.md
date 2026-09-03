# Workout Tracker

A lightweight fitness dashboard for tracking:

- Water intake
- Meals
- Workouts

## Run locally

Open the project folder in a browser or serve it with a local static server:

```bash
cd d:/Workout
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## WHOOP integration setup

The WHOOP OAuth backend is designed for Vercel serverless functions. GitHub Pages cannot safely store `WHOOP_CLIENT_SECRET`.

1. Import this repository into Vercel.
2. Add the variables from `.env.example` in Vercel project settings. Use a newly rotated WHOOP client secret.
3. In the WHOOP developer portal, set the redirect URI to:

	`https://cacarid.github.io/Workout/oauth-callback.html`

4. Deploy the Vercel project. Its API base URL will be used by the frontend OAuth button.

Never commit `.env` files or client secrets to the repository.

## Features

- Add meals with calories and type
- Log workouts with duration and calories burned
- Track water intake in milliliters
- Persist data in the browser using localStorage
- View daily progress cards and recent logs
