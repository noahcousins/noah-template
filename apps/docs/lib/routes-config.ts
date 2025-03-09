// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; // noLink will create a route segment (section) but cannot be navigated
  items?: EachRoute[];
  tag?: string;
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      { title: "Installation", href: "/installation" },
      { title: "Project Structure", href: "/project-structure" },
      { title: "Quick Start Guide", href: "/quick-start-guide" },
    ],
  },
  {
    title: "API",
    href: "/api",
    noLink: true,
    items: [
      { title: "Overview", href: "/overview" },
      { title: "Authentication", href: "/authentication" },
      { title: "Deployment", href: "/deployment" },
      { title: "Environment Variables", href: "/environment-variables", tag: "Important" },
    ],
  },
  {
    title: "Web Frontend",
    href: "/web",
    noLink: true,
    items: [
      { title: "Overview", href: "/overview" },
      { title: "Components", href: "/components" },
      { title: "Authentication", href: "/authentication" },
    ],
  },
  {
    title: "Database",
    href: "/database",
    noLink: true,
    items: [
      { title: "Schema", href: "/schema" },
      { title: "Migrations", href: "/migrations" },
      { title: "DrizzleORM", href: "/drizzle" },
    ],
  },
  {
    title: "Development",
    href: "/development",
    noLink: true,
    items: [
      { title: "Workflow", href: "/workflow" },
      { title: "Style Guide", href: "/style-guide" },
      { title: "Testing", href: "/testing" },
      { title: "CI/CD", href: "/cicd" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
