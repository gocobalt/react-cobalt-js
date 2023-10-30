import React from "react";

interface Label {
    name: string;
    value: string | number | boolean;
}

interface ProviderProps {
    baseApi?: string;
    sessionToken: string;
}

interface ConfigProps {
    id?: string;
    slug: string;
    fields?: Record<string, Label[]>;
    style?: CSSStyleDeclaration;
}

declare const Provider: ({ sessionToken }: ProviderProps) => React.FC<React.PropsWithChildren<ProviderProps>>;

declare const Config: ({ sessionToken }: ConfigProps) => React.FC<React.PropsWithChildren<ConfigProps>>;
