import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (children) => (
    <h1 style={{color:"blue"}}>{children}</h1>
  ),
   h2: (children) => (
    <h2 style={{color:"blue"}}>{children}</h2>
  )
};

export function useMDXComponents(): MDXComponents {
  return components;
}
