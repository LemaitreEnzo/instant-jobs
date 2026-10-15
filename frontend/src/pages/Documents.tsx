import { useMemo, useState } from "react";
import CardDocument from "../components/document/CardDocument";
import DocumentFormModal from "../components/document/DocumentFormModal";
import FilterBar from "../components/layout/FilterBar/FilterBar";
import PageTitle from "../components/layout/PageTitle/PageTitle";
import Pagination from "../components/layout/Pagination/Pagination";
import { useAuth } from "../context/AuthContext";
import type { Student } from "../interfaces/user.interface";
import type { FilterGroup, SortOption, SortState } from "../types/props.type";
import {
  formatFileSize,
  getBase64FileSize,
  getFileTypeFromUri,
} from "../utils/globals.util";

import "../assets/css/pages/documents.css";
import type { Media } from "../interfaces/models.interface";

/**
 * Documents management page.
 * Displays uploaded files (CV, cover letters) with type filtering, date sorting,
 * pagination, and upload modal integration.
 */
function Documents() {
  const { user, loading, refreshUser } = useAuth();
  const student: Student = user as Student;
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [paginatedMedias, setPaginatedMedias] = useState<Media[]>([]);

  const medias = useMemo(() => {
    if (!student?.medias) return [];
    return student.medias
      .filter((media) => !removedIds.includes(media.id))
      .map((media) => ({
        ...media,
        type: getFileTypeFromUri(media.path || ""),
      }));
  }, [student, removedIds]);

  const sortOptions: SortOption[] = useMemo(
    () => [{ label: "Date d'envoi", value: "date" }],
    [],
  );

  const defaultSort: SortState = useMemo(
    () => ({ field: "date", direction: "desc" }),
    [],
  );
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [activeSort, setActiveSort] = useState<SortState>(defaultSort);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const filteredAndSortedMedias = useMemo(() => {
    if (!medias) return [];
    let result = [...medias];

    // Filter by document type
    const selectedTypes = activeFilters["type"] || [];
    if (selectedTypes.length > 0) {
      result = result.filter((app) => selectedTypes.includes(app.type));
    }
    // Sort by creation date
    if (activeSort.field === "date") {
      result.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return activeSort.direction === "asc" ? timeA - timeB : timeB - timeA;
      });
    }
    return result;
  }, [medias, activeFilters, activeSort]);

  const [prevFilters, setPrevFilters] = useState(activeFilters);
  if (activeFilters !== prevFilters) {
    setPrevFilters(activeFilters);
    setCurrentPage(1);
  }

  const filterGroups: FilterGroup[] = useMemo(() => {
    const uniqueTypes = Array.from(new Set(medias.map((m) => m.type)));

    return [
      {
        id: "type",
        title: "Type",
        options: uniqueTypes.map((type) => ({
          id: type,
          label: type.toUpperCase(),
        })),
      },
    ];
  }, [medias]);

  if (loading) {
    return <div className="documents-loading">Chargement en cours...</div>;
  }

  return (
    <div className="documents">
      <div className="top">
        <PageTitle title="Mes documents" />
        <FilterBar
          filterGroups={filterGroups}
          onFilterChange={setActiveFilters}
          sortOptions={sortOptions}
          defaultSort={defaultSort}
          onSortChange={setActiveSort}
          onAddClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      <div className="docs">
        {paginatedMedias.length > 0 ? (
          paginatedMedias.map((document, index) => {
            const rawSize = getBase64FileSize(document.path || "");
            const size: string = formatFileSize(rawSize);
            const type: string = getFileTypeFromUri(document.path || "");

            return (
              <CardDocument
                key={index}
                data={document}
                size={size}
                type={type}
                onDeleted={(id: number) =>
                  setRemovedIds((prev) => [...prev, id])
                }
              />
            );
          })
        ) : (
          <p>Aucun Document</p>
        )}
      </div>

      <Pagination
        data={filteredAndSortedMedias}
        itemsPerPage={4}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onDataChange={setPaginatedMedias}
      />

      <DocumentFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={refreshUser}
      />
    </div>
  );
}

export default Documents;
