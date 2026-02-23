type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
};

export function useToast() {
  const toast = ({ title, description }: ToastOptions) => {
    if (import.meta.env.DEV) {
      console.info('[toast]', title ?? '', description ?? '');
    }
  };
  return { toast };
}
