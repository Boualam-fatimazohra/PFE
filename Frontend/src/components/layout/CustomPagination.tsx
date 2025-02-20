import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7; // Nombre maximum de pages visibles
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const middlePage = Math.floor(maxVisiblePages / 2);
      if (currentPage <= middlePage) {
        endPage = maxVisiblePages - 2; // -2 pour "..." et la dernière page
      } else if (currentPage >= totalPages - middlePage) {
        startPage = totalPages - maxVisiblePages + 3; // +3 pour "..." et la première page
      } else {
        startPage = currentPage - middlePage + 2;
        endPage = currentPage + middlePage - 2;
      }
    }

    // Ajouter la première page
    pageNumbers.push(
      <Button
        key={1}
        variant="ghost"
        className={cn(
          "h-8 w-8 p-0",
          currentPage === 1 && "bg-black text-white hover:bg-black/90"
        )}
        onClick={() => onPageChange(1)}
      >
        1
      </Button>
    );

    // Ajouter les points de suspension au début si nécessaire
    if (startPage > 2) {
      pageNumbers.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Ajouter les pages du milieu
    for (let i = Math.max(2, startPage); i <= Math.min(totalPages - 1, endPage); i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            currentPage === i && "bg-black text-white hover:bg-black/90"
          )}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Ajouter les points de suspension à la fin si nécessaire
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }

    // Ajouter la dernière page si elle n'est pas déjà incluse
    if (totalPages > 1) {
      pageNumbers.push(
        <Button
          key={totalPages}
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0",
            currentPage === totalPages && "bg-black text-white hover:bg-black/90"
          )}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        variant="outline"
        className="h-8 w-8 p-0 border"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Page précédente</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        className="h-8 w-8 p-0 border"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Page suivante</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Button>
    </div>
  );
};