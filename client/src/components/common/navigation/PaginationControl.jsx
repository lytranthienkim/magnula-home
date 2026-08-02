export default function PaginationControl({ currentPage, totalPages, onPrevious, onNext }) {
  return (
    <nav aria-label="Pagination" className="w-full flex justify-end items-center gap-4 mt-8">
      <span className="body-02 text-primary">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-1 border-[0.25px] border-primary bg-background-primary text-primary body-02 rounded-none cursor-pointer hover:bg-primary hover:text-background-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous Page"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-1 border-[0.25px] border-primary bg-primary text-background-primary body-02 rounded-none cursor-pointer hover:bg-background-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next Page"
      >
        Next
      </button>
    </nav>
  );
}
