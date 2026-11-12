import type { Preview } from '@storybook/react-webpack5';
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../src/app/index.css";
import { mswLoader } from "msw-storybook-addon/csf3";

const queryClient = new QueryClient();


const preview: Preview = {
  loaders: [mswLoader()],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story/>
        </MemoryRouter>
      </QueryClientProvider>
    )
  ]
};

export default preview;