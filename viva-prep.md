# Viva Prep - Technical Q&A

**1. Why Next.js 14 App Router?**
> It offers Server Components by default for better performance (less JS on client), SEO optimization, and simplified data fetching directly in components without `useEffect` chaining.

**2. Why MongoDB with Prisma?**
> MongoDB's flexible schema is great for evolving content types (metadata), while Prisma provides type-safety and auto-generated clients, preventing runtime SQL/NoSQL injection errors.

**3. How does the DRM/Watermark work?**
> We use a floating HTML element over the video that moves randomly and a hidden Canvas overlay that paints the user's email/timestamp into the pixel data, making screen recordings traceable.

**4. How is the AI Helper implemented?**
> We use the Gemini API. The server action sends the text context to the LLM with a strict prompt to return JSON for quizzes or Markdown for notes, ensuring structured output.

**5. Explain the Admin Workflow.**
> Users upload content -> Status 'PENDING' -> Admin Dashboard fetches 'PENDING' items -> Admin clicks Approve -> Server Action updates status to 'APPROVED' -> Content becomes visible in the main list.

**6. How is authentication handled?**
> Clerk handles the identity management (sessions, JWTs). We sync the Clerk `userId` to our MongoDB `User` model to attach app-specific data like `walletBalance` and `role`.

**7. What is "Glassmorphism"?**
> A UI design trend using transparency (background blur), light borders, and shadows to mimic frosted glass, creating depth and hierarchy on dark backgrounds.

**8. How does the Reward System prevent abuse?**
> We check if a transaction for that specific content already exists for the user. We also verify the video progress reaches 95% before triggering the server action.

**9. Why use Server Actions instead of API Routes?**
> Server Actions allow calling backend functions directly from frontend components (like forms or buttons), reducing boilerplate fetch code and automatically handling revalidation of cache.

**10. How do we handle Role Protection?**
> We use `middleware.ts` for route-level protection (redirecting unauthorized users) and utility functions like `protectAdmin()` inside Server Actions/Pages for logic-level security.
