// Contract of the Vue 2 header remote (headerApp/src/mount.js)
declare module "header/Header" {
  export type HeaderProps = {
    title?: string;
    userName?: string;
    image?: string;
    onLogout?: () => void;
  };

  export type HeaderInstance = {
    update(props: HeaderProps): void;
    unmount(): void;
  };

  export function mount(el: HTMLElement, props?: HeaderProps): HeaderInstance;
}


// Contract of the React products remote (productsApp/src/mount.tsx)
declare module "products/ProductsPage" {
  export type ProductsProps = {
    session: import("@/shared/auth/public-api").SessionApi;
    basePath?: string;
  };

  export type ProductsInstance = {
    update(props: Partial<ProductsProps>): void;
    unmount(): void;
  };

  export function mount(el: HTMLElement, props: ProductsProps): ProductsInstance;
}

declare module "footer/Footer"{
  export type FooterProps = {
    title?: string;
    year?: number;
  }

  export type FooterInstance = {
    update(props: FooterProps): void;
    unmount(): void;
  }

  export function mount(el: HTMLElement, props?: FooterProps): FooterInstance
}