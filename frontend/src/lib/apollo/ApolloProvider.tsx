'use client';

import { PropsWithChildren } from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { client } from './client';

export function ApolloProvider({ children }: PropsWithChildren) {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}
