import { useState } from "react";
import type {
  FilterGroup,
  PropsFilterBar,
  SortOption,
  SortState,
} from "../../../types/props.type";
import Button from "../../ui/Button/Button";
import Checkbox from "../../ui/Checkbox/Checkbox";
import Input from "../../ui/Input/Input";
import Modal from "../../ui/Modal/Modal";
import "./FilterBar.css";

const FilterBar = ({
  filterGroups = [],
  onFilterChange,
  sortOptions = [],
  defaultSort = { field: "", direction: "asc" },
  onSortChange,
  onAdd,
  onAddClick,
  customClassName = "",
}: PropsFilterBar) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);

  const getInitialFilters = (): Record<string, string[]> => {
    const initial: Record<string, string[]> = {};
    filterGroups.forEach(
      (group: FilterGroup) =>
        (initial[group.id] = group.options
          .filter((opt) => Boolean(opt.checked))
          .map((opt) => opt.id)),
    );
    return initial;
  };

  const [committedFilters, setCommittedFilters] =
    useState<Record<string, string[]>>(getInitialFilters);
  const [tempFilters, setTempFilters] =
    useState<Record<string, string[]>>(getInitialFilters);

  const [committedSort, setCommittedSort] = useState<SortState>(defaultSort);
  const [tempSort, setTempSort] = useState<SortState>(defaultSort);

  const handleOpenFilter = () => {
    setTempFilters(committedFilters);
    setIsFilterOpen(true);
  };

  const handleOpenSort = () => {
    setTempSort(committedSort);
    setIsSortOpen(true);
  };

  const handleOpenAdd = () => {
    onAdd?.();
    onAddClick?.();
  };

  const handleToggleFilterOption = (
    groupId: string,
    optionId: string,
    checked: boolean,
  ) => {
    setTempFilters((prev) => {
      const currentGroupOptions = prev[groupId] || [];
      const updatedGroupOptions = checked
        ? [...currentGroupOptions, optionId]
        : currentGroupOptions.filter((id: string) => id !== optionId);
      return {
        ...prev,
        [groupId]: updatedGroupOptions,
      };
    });
  };

  const handleResetFilters = () => {
    setTempFilters({});
  };

  const handleApplyFilters = () => {
    setCommittedFilters(tempFilters);
    onFilterChange?.(tempFilters);
    setIsFilterOpen(false);
  };

  const handleSelectSortField = (field: string) => {
    setTempSort((prev) => ({
      ...prev,
      field,
    }));
  };

  const handleToggleSortDirection = (direction: "asc" | "desc") => {
    setTempSort((prev) => ({
      ...prev,
      direction,
    }));
  };

  const handleResetSort = () => {
    setTempSort(defaultSort);
  };

  const handleApplySort = () => {
    setCommittedSort(tempSort);
    onSortChange?.(tempSort);
    setIsSortOpen(false);
  };

  return (
    <div className={`filter-bar ${customClassName}`.trim()}>
      <div className="filter-bar-search">
        <Input type="search" error="" placeholder="Rechercher..." />
        <div className="filter-bar-search-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.553 15.553C16.2086 14.8974 16.7287 14.119 17.0835 13.2624C17.4383 12.4058 17.6209 11.4877 17.6209 10.5605C17.6209 9.6333 17.4383 8.71518 17.0835 7.85857C16.7287 7.00196 16.2086 6.22362 15.553 5.56799C14.8973 4.91237 14.119 4.3923 13.2624 4.03748C12.4058 3.68265 11.4877 3.50003 10.5605 3.50003C9.63327 3.50003 8.71515 3.68265 7.85854 4.03748C7.00192 4.3923 6.22359 4.91237 5.56796 5.56799C4.24387 6.89209 3.5 8.68794 3.5 10.5605C3.5 12.433 4.24387 14.2289 5.56796 15.553C6.89205 16.8771 8.68791 17.621 10.5605 17.621C12.433 17.621 14.2289 16.8771 15.553 15.553ZM15.553 15.553L20 20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <Button customClassName="filter-bar-button" onClick={handleOpenFilter}>
        <span>Filtres</span>
        <div className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19.88C15.04 20.18 14.94 20.5 14.71 20.71C14.6175 20.8027 14.5076 20.8762 14.3866 20.9264C14.2657 20.9766 14.136 21.0024 14.005 21.0024C13.874 21.0024 13.7444 20.9766 13.6234 20.9264C13.5024 20.8762 13.3925 20.8027 13.3 20.71L9.29001 16.7C9.18101 16.5933 9.09812 16.4629 9.04782 16.319C8.99751 16.175 8.98115 16.0213 9.00001 15.87V10.75L4.21001 4.62C4.04762 4.41153 3.97434 4.14726 4.0062 3.88493C4.03805 3.6226 4.17244 3.38355 4.38001 3.22C4.57001 3.08 4.78001 3 5.00001 3H19C19.22 3 19.43 3.08 19.62 3.22C19.8276 3.38355 19.962 3.6226 19.9938 3.88493C20.0257 4.14726 19.9524 4.41153 19.79 4.62L15 10.75V19.88ZM7.04001 5L11 10.06V15.58L13 17.58V10.05L16.96 5H7.04001Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Button>

      <Button customClassName="filter-bar-button" onClick={handleOpenSort}>
        <span>Trier</span>
        <div className="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.29304 4.293C6.48057 4.10553 6.73488 4.00021 7.00004 4.00021C7.26521 4.00021 7.51951 4.10553 7.70704 4.293L11.707 8.293C11.8892 8.4816 11.99 8.7342 11.9877 8.9964C11.9854 9.2586 11.8803 9.50941 11.6949 9.69482C11.5095 9.88023 11.2586 9.9854 10.9964 9.98767C10.7342 9.98995 10.4816 9.88916 10.293 9.707L8.00004 7.414V19C8.00004 19.2652 7.89468 19.5196 7.70715 19.7071C7.51961 19.8946 7.26526 20 7.00004 20C6.73482 20 6.48047 19.8946 6.29293 19.7071C6.1054 19.5196 6.00004 19.2652 6.00004 19V7.414L3.70704 9.707C3.51844 9.88916 3.26584 9.98995 3.00364 9.98767C2.74144 9.9854 2.49063 9.88023 2.30522 9.69482C2.11981 9.50941 2.01465 9.2586 2.01237 8.9964C2.01009 8.7342 2.11088 8.4816 2.29304 8.293L6.29304 4.293ZM16 16.586V5C16 4.73478 16.1054 4.48043 16.2929 4.29289C16.4805 4.10536 16.7348 4 17 4C17.2653 4 17.5196 4.10536 17.7071 4.29289C17.8947 4.48043 18 4.73478 18 5V16.586L20.293 14.293C20.4816 14.1108 20.7342 14.01 20.9964 14.0123C21.2586 14.0146 21.5095 14.1198 21.6949 14.3052C21.8803 14.4906 21.9854 14.7414 21.9877 15.0036C21.99 15.2658 21.8892 15.5184 21.707 15.707L17.707 19.707C17.5195 19.8945 17.2652 19.9998 17 19.9998C16.7349 19.9998 16.4806 19.8945 16.293 19.707L12.293 15.707C12.1109 15.5184 12.0101 15.2658 12.0124 15.0036C12.0146 14.7414 12.1198 14.4906 12.3052 14.3052C12.4906 14.1198 12.7414 14.0146 13.0036 14.0123C13.2658 14.01 13.5184 14.1108 13.707 14.293L16 16.586Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Button>

      <Button onClick={handleOpenAdd}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 12.998H13V17.998C13 18.2632 12.8946 18.5176 12.7071 18.7051C12.5196 18.8926 12.2652 18.998 12 18.998C11.7348 18.998 11.4804 18.8926 11.2929 18.7051C11.1054 18.5176 11 18.2632 11 17.998V12.998H6C5.73478 12.998 5.48043 12.8926 5.29289 12.7051C5.10536 12.5176 5 12.2632 5 11.998C5 11.7328 5.10536 11.4784 5.29289 11.2909C5.48043 11.1033 5.73478 10.998 6 10.998H11V5.99799C11 5.73277 11.1054 5.47842 11.2929 5.29088C11.4804 5.10334 11.7348 4.99799 12 4.99799C12.2652 4.99799 12.5196 5.10334 12.7071 5.29088C12.8946 5.47842 13 5.73277 13 5.99799V10.998H18C18.2652 10.998 18.5196 11.1033 18.7071 11.2909C18.8946 11.4784 19 11.7328 19 11.998C19 12.2632 18.8946 12.5176 18.7071 12.7051C18.5196 12.8926 18.2652 12.998 18 12.998Z"
            fill="currentColor"
          />
        </svg>
        <span>Ajouter</span>
      </Button>

      <Modal
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        title="Filtres"
        description="Affinez votre liste d'éléments selon vos critères."
        size="sm"
        customClassName="filterbar-modal"
      >
        <div className="filterbar-modal-content">
          {filterGroups.length === 0 ? (
            <p className="filterbar-empty-message">
              Aucun filtre disponible pour cette section.
            </p>
          ) : (
            filterGroups.map((group) => {
              const selectedInGroup = tempFilters[group.id] || [];
              return (
                <div key={group.id} className="filter-group">
                  <h4 className="filter-group-title">{group.title}</h4>
                  <div className="filter-options-list">
                    {group.options.map((opt) => (
                      <Checkbox
                        key={opt.id}
                        id={`filter-${group.id}-${opt.id}`}
                        label={opt.label}
                        checked={selectedInGroup.includes(opt.id)}
                        onChange={(checked) =>
                          handleToggleFilterOption(group.id, opt.id, checked)
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          <div className="filterbar-modal-actions">
            <Button
              type="button"
              className="btn-secondary"
              onClick={handleResetFilters}
            >
              <span>Réinitialiser</span>
            </Button>
            <Button
              type="button"
              className="btn-primary"
              onClick={handleApplyFilters}
            >
              <span>Appliquer</span>
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isSortOpen}
        onOpenChange={setIsSortOpen}
        title="Trier"
        description="Sélectionnez l'ordre d'affichage des éléments."
        size="sm"
        customClassName="filterbar-modal"
      >
        <div className="filterbar-modal-content">
          {sortOptions.length === 0 ? (
            <p className="filterbar-empty-message">
              Aucune option de tri disponible pour cette section.
            </p>
          ) : (
            <>
              <div className="sort-options-group">
                <span className="sort-section-title">Critère de tri</span>
                <div className="sort-options-list">
                  {sortOptions.map((opt: SortOption) => {
                    const isSelected = tempSort.field === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`sort-option-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectSortField(opt.value)}
                      >
                        <span className="sort-option-label">{opt.label}</span>
                        <span className="sort-radio-indicator">
                          {isSelected && <span className="sort-radio-dot" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sort-direction-group">
                <span className="sort-section-title">Sens du tri</span>
                <div className="sort-direction-buttons">
                  <button
                    type="button"
                    className={`sort-direction-btn ${tempSort.direction === "asc" ? "active" : ""}`}
                    onClick={() => handleToggleSortDirection("asc")}
                  >
                    <span>Croissant (A → Z, 0 → 9)</span>
                  </button>
                  <button
                    type="button"
                    className={`sort-direction-btn ${tempSort.direction === "desc" ? "active" : ""}`}
                    onClick={() => handleToggleSortDirection("desc")}
                  >
                    <span>Décroissant (Z → A, 9 → 0)</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="filterbar-modal-actions">
            <Button
              type="button"
              className="btn-secondary"
              onClick={handleResetSort}
            >
              <span>Réinitialiser</span>
            </Button>
            <Button
              type="button"
              className="btn-primary"
              onClick={handleApplySort}
            >
              <span>Appliquer</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterBar;
