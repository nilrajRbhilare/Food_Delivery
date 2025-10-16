export function LoadingSkeleton() {
  return (
    <div className="space-y-8 py-8">
      {[1, 2, 3].map((section) => (
        <div key={section} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-8 bg-muted rounded-lg w-48 mb-6 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
          
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="flex-shrink-0 w-72">
                <div className="bg-card rounded-2xl overflow-hidden">
                  <div className="aspect-[4/3] bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-16 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
                      <div className="h-4 bg-muted rounded w-16 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
