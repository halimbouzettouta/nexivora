import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false, staleTime: 60_000 },
    mutations: { retry: 0 },
  },
});

// Safe fetch: detects HTML responses (static hosting) and returns empty JSON
const safeFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  try {
    const response = await globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
    const ct = response.headers.get('content-type') || '';
    // Static hosting returns HTML for all routes - return empty JSON instead
    if (ct.includes('text/html')) {
      return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
    }
    return response;
  } catch {
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  }
};

const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson, fetch: safeFetch })],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
