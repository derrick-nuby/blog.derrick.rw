import { defineConfig, s } from "velite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

export default defineConfig({
  root: "./src/content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: {
    blogs: {
      name: 'Blog',
      pattern: 'blog/**/*.mdx',
      schema: s
        .object({
          title: s.string().max(99),
          slug: s.slug('blogs'), // validate format, unique in blogs collection
          description: s.string().max(999),
          date: s.isodate(),
          published: s.boolean().default(true),
          image: s.string().optional(), // image path in public directory
          author: s.string(),
          metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
          excerpt: s.excerpt(), // excerpt of markdown content
          content: s.mdx() // transform mdx to html
        })
        // computed fields
        .transform((data) => {
          const slugAsParams = data.slug;
          return {
            ...data,
            permalink: `/blog/${slugAsParams}`,
            slugAsParams,
          };
        })
    }
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "dracula" }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
