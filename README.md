## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

This project requires the following environment variables to run:

| Variable          | Description                                               |
|------------------|-----------------------------------------------------------|
| `MONGODB_URI`     | Your MongoDB connection string. Example: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority` |
| `NEXTAUTH_SECRET` | Secret key used by NextAuth.js for JWT/session encryption. Generate a secure random string (32+ characters). |

### Example `.env` file

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
NEXTAUTH_SECRET=your_super_secret_key_here

