# Secret Santa 

Ortaokul bilgisayar ogrnc🇹🇷🍎👽

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Docker; you can use [Docker Desktop](https://www.docker.com/products/docker-desktop) or [Orb](https://orbstack.dev)

### Development Setup

0. **Start Docker**

   Make sure Docker is running on your machine. If you're using Orb, you can start it with:
   ```bash
   orb start
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/mkutay/secret-santa
   cd secret-santa
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Setup DB**
   ```bash
   bunx supabase start
   bunx supabase db reset --local
   ```

   This starts up the Supabase local server with the migrations under
   `/supabase/migrations` and the data in `/supabase/seed.sql`.

5. **Environment Variables**

   Populate `.env.example` file in `.env.local` with the information given by the `supabase start` command.

   ```bash
   cp .env.example .env.local
   ```

6. **Start the development server**
   ```bash
   bun dev
   ```

7. **Build for production** 

   Test the types and run the linter to check for errors overall.
   
   ```bash
   bun run build
   ```

8. **Run the production server**
   ```bash
   bun start
   ```

9. **Close the Supabase server**
   ```bash
   bunx supabase stop
   ```

## Architecture & Code Quality

### Key Code Patterns

#### The `runQuery` Function

The application uses a `runQuery` function for most database operations, providing:
- Consistent error handling across all database interactions.
- Type-safe database queries with full TypeScript support.
- Automatic error logging with caller context.
- Functional programming patterns with ResultAsync.

```typescript
export const runQuery = <T>(queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>, caller?: string) => 
  createClient().andThen(client => supabaseRun(queryBuilder(client), caller));
```

#### Neverthrow Error Handling

The entire application uses the [Neverthrow](https://github.com/supermacro/neverthrow) library for:
- **Railway-oriented programming**: Explicit error handling without try-catch
- **Composable operations**: Chain database operations with `.andThen()`
- **Type-safe errors**: All error cases are explicitly typed
- **Functional transformations**: Map over success values while preserving errors

#### Full Type Safety
*"In TypeScript we trust, for it guards against the chaos of runtime errors"*

- **Database Types**: Auto-generated TypeScript types from Supabase schema
- **Form Validation**: Zod schemas for runtime type validation
- **API Responses**: Strongly typed server actions and responses, using `ActionResult` type

## Contributing

Contributions are welcome! Please be respectful and follow obvious design patterns.

If you have changed the schema of the DB, then make sure to run the following two commands to
add the new changes (as Supabase migration and database types) into the repo.

```bash
bunx supabase db diff -f add_new_feature
```
```bash
bunx supabase gen types --lang typescript --local > src/types/database.types.ts
```

After that, you are welcome to create a PR, where I'll review your changes.

For more information about the Supabase migrations, [see](https://supabase.com/docs/guides/deployment/managing-environments).
