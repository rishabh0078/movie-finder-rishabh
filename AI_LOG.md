Quick notes on what the AI built, the prompts that worked best, and the manual fixes which i applied to make it work.

## Tools Used
- **Next.js 16 (App Router)** & **JavaScript**
- **OMDb API** 
- **Custom CSS**

---

## Prompts That Worked Best

1. **Handling 12 Items/Page Pagination**
   > *"The OMDb API returns exactly 10 results per page, but the spec requires exactly 12. Write a Next.js API route that maps our 12-item page number to the correct OMDb pages, fetches 1 or 2 pages as needed, and returns exactly 12 items."*
   - **Why it worked:** Naming the exact mismatch (10 vs 12) made the AI write a virtual-index slicing algorithm rather than a generic pagination wrapper.

2. **Custom CSS System**
   > *"Design a cinematic dark-theme CSS system for a movie discovery app - no Tailwind. Use Outfit for headings, Inter for body, and Space Mono for metadata. Include skeleton shimmers, glassmorphic modals, and a sticky header."*
   - **Why it worked:** Specifying exact fonts and styling details, while explicitly banning Tailwind, resulted in a clean, variables-based stylesheet.

---

## What I Fixed Manually

- **Missing Search Ratings:** OMDb's search endpoint (`?s=`) doesn't return `imdbRating`. I updated `MovieCard` to conditionally hide the badge if rating is missing or `"N/A"`.
- **Awaiting `params` in Next.js 16:** Next.js 16 treats `params` as a promise. I updated the movie detail route to await `params` (`const { id } = await params`) to prevent runtime warnings.
- **Poster Priority Sorting:** To prevent layout gaps, I sorted API results so that movies with valid posters show up first, and movies with missing posters (`"N/A"`) fall to the end.
- **Stable Page Numbers:** Cached the first query's `totalResults` and calculated the page count via `Math.ceil(totalResults / 12)`. This stops the page limit from shifting while scrolling.
- **Logo Home Link:** Configured the logo click to clear search inputs, reset pagination to page 1, reset the tab back to Browse, and scroll back to the top.
