# To Do Next

A Todo app built with Next JS. Made for the purpose of getting familiar with most of the feature of Next JS.

Other key Tools used

- TypesScript: so I can at least have TypeSafety in my dev environment
- Postgres: for the DB
- Prisma: as an ORM for queries and migrations (I kinda hate ORMs but this was good to just get stuff done quickly)
- Zod: for schema/data validation
- Luxon: for date handling
- Clerk: for auth

## Running the app

1. Install Node.js LTS Version. Run `npm install` to install the Node dependencies needed.
2. Install Docker or install postgres locally (so that you can connect to a local database). If you are using docker running `docker-compose up -d` will run a local postgres db on port 9999.
3. Copy .env.example to .env. Replace DATABASE_URL as needed.
4. Run `npx prisma migrate dev` to run the prisma migrations needed.
5. Go to https://clerk.dev, sign in/up, and create an application. Use replace the 2 clerk env vars with your applications. See https://clerk.com/docs/quickstarts/nextjs for more.
6. Run `npm run dev` to start the application locally.

## Features

- [x] View all TODOs
- [x] View TODOs in a custom time range
- [x] View Completed TODOs
- [ ] Add recurring TODOs
- [x] Add Sign up and Sign in so users can be linked to TODOs
- [x] Add Sign out
- [ ] Add page for reports on you doing your TODOs

## Anatomy of a TODO

- ID: uuid, required
- Title: string, required
- Description: text, required
- User ID: uuid, required
- Due At: datetime, optional
- Completed At: datetime, optional

TODO - eventually need to tackle recurrence

## My Experience with Next

Things I liked

- Fetching Data and Rendering on Server. This makes "full-stack" (I put in quotes because Next is kinda full stack but not completely) "type safety" (I also put in quotes because TypeScript is only kind of type safe) since you can pass down types directly from the point that you fetched data and not have to parse and revalidate JSON.
- Iteration Speed: It was very quick to add new functionality. The overhead of adding an endpoint via an API route or server action was very low.
- Server Actions: This were very easy to develop.

Things I did not like

- I hated that I had to write middleware just to get the current pathname in a Server Component. It wasn't hard to do, but feels like an easy thing to have as a prop to pages, like they do for search params. I also hate that they are called search params and not query params.
- I think this is actually a RSC thing and not just a Next thing, but I don't enjoy having to create an entirely separate file for client components. I like being able to have multiple components per file if they are only ever used by each other.

Things I would do if this were a real project

- Put all data fetching, mutation, and other business logic in a service file. This way in the event of a switch off of Next api routes or server actions I could reuse the backend business logic.
- Make more reusable components. Normally I like to make reusable components and definitely would do so for the text inputs, buttons, etc. But given this is just a small personal project and I only had to copy paste some tailwind classes a few times, this was fine.
- Actually deploy this. I'd probably use Vercel until I could not (ie: needed websocket functionality or queues or other more complex infrastructure). Vercel is a great option if you want to setup CI/CD automatically and are making a basic CRUD app. If I needed more complex functionality I'd probably containerize this and throw this on ECS and throw the DB in RDS.
