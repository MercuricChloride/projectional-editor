# Projectional Editor without a name

### TLDR:

- Our brains are better at processing pictures than text, this is why we use diagrams to explain stuff not text.

- We should use this to our advantage to quickly grokk what code is doing.

- We should be able to edit that visual representation of code, but shouldn't be forced to write it visually. I like typing and would never use a my mouse to write my code if I have a keyboard. This also benefits n00bs who don't like typing because they are new and a visual interface is much less scary than a blank editor.

- Because we are working on an abstract representation of our code, we can create powerful macros, ones that operate on the AST of the language, which is something that isn't possible in most langauges other than Lisp(s). This enables us to build visual domain specific languages within our codebase to simplify how things work even more.

- The code should be able to be written exclusively using the visual editor, but it shouldn't be forced upon a user. This is powered by the macro system.

---

This is a projectional editor. What does that mean? You operate on an abstract visual representation of your source code. (IE your source code is projecting onto the visual canvas)

The changes you make to this projection, are also mirrored in your source. This is a cool abstraction because it allows us to "grokk" what code is doing due to how advanced the visual processing part of our brain is, compared to the text processing part of the brain.

This project is a prototype and is intentionally scoped.

I am going to be building it with the focus of writing and analyzing solidity code first. Though adding other languages is pretty straight forward because of the tools we are using.

Reach out to me if you have any questions or features! Cheers.

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
