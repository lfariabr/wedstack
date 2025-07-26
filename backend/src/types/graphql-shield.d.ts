declare module 'graphql-shield' {
    export function shield(rules: any, options?: any): any;
    export function rule(options?: any): (resolver: any) => any;
    export function allow(): any;
    export function deny(): any;
  }