import { useRef, useEffect } from "react"
import Button from "../../ui/Button/Button"

import "./ApplicationsHeader.css"
import type { PropsApplicationHeader } from "../../../types/props.type";
import { ApplicationStatus } from "../../../types/enum.type";

const statusOptions: { id: ApplicationStatus; label: string }[] = [
    { id: ApplicationStatus.accepted, label: "Acceptée" },
    { id: ApplicationStatus.pending, label: "En attente" },
    { id: ApplicationStatus.interview, label: "Entretien" },
    { id: ApplicationStatus.refused, label: "Refusée" },
];

const typeOptions = [
    { id: "Alternance", label: "Alternance" },
    { id: "Stage", label: "Stage" },
    { id: "CDI", label: "CDI" },
];

const resendOptions = [
    { id: "yes", label: "Relancée" },
    { id: "no", label: "Pas de relance" },
]

function ApplicationsHeader({ open, onOpenChange, filters, onFilterChange }: PropsApplicationHeader) {
    const filterRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        onOpenChange(!open);
    };

    const checkClickOutside = (e) => {
        if (open && filterRef.current && !filterRef.current.contains(e.target)) {
            onOpenChange(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", checkClickOutside);

        return () => document.removeEventListener("mousedown", checkClickOutside);
    }, [open]);

    const handleStatusToggle = (value: ApplicationStatus) => {
        const updated = filters.statuses.includes(value)
            ? filters.statuses.filter((item) => item !== value)
            : [...filters.statuses, value];
        onFilterChange({ ...filters, statuses: updated })
    };

    const handleTypeToggle = (value: string) => {
        const updated = filters.types.includes(value)
            ? filters.types.filter((item) => item !== value)
            : [...filters.types, value];
        onFilterChange({ ...filters, types: updated })
    };

    const handleResendToggle = (value: string) => {
        const updated = filters.resends.includes(value)
            ? filters.resends.filter((item) => item !== value)
            : [...filters.resends, value];
        onFilterChange({ ...filters, resends: updated })
    };

    return (
        <div className="applications-header">
            <h4>Candidatures récentes</h4>
            <div className="applications-header-buttons">
                <div className="filter">
                    <Button shape="rectangle" onClick={handleClick} onMouseDown={(event) => event.stopPropagation()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19.88C15.04 20.18 14.94 20.5 14.71 20.71C14.6175 20.8027 14.5076 20.8762 14.3866 20.9264C14.2657 20.9766 14.136 21.0024 14.005 21.0024C13.874 21.0024 13.7444 20.9766 13.6234 20.9264C13.5024 20.8762 13.3925 20.8027 13.3 20.71L9.29001 16.7C9.18101 16.5933 9.09812 16.4629 9.04782 16.319C8.99751 16.175 8.98115 16.0213 9.00001 15.87V10.75L4.21001 4.62C4.04762 4.41153 3.97434 4.14726 4.0062 3.88493C4.03805 3.6226 4.17244 3.38355 4.38001 3.22C4.57001 3.08 4.78001 3 5.00001 3H19C19.22 3 19.43 3.08 19.62 3.22C19.8276 3.38355 19.962 3.6226 19.9938 3.88493C20.0257 4.14726 19.9524 4.41153 19.79 4.62L15 10.75V19.88ZM7.04001 5L11 10.06V15.58L13 17.58V10.05L16.96 5H7.04001Z" fill="currentColor" />
                        </svg>
                        <span>Filtres</span>
                    </Button>
                    {open && (
                        <div className="filter-list" ref={filterRef}>

                            <div className="filter-group">
                                <span className="filter-group-title">Statut</span>
                                {statusOptions.map((option) => (
                                    <label key={option.id} className="filter-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.statuses.includes(option.id)}
                                            onChange={() => handleStatusToggle(option.id)}
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="filter-group">
                                <span className="filter-group-title">Type de contrat</span>
                                {typeOptions.map((option) => (
                                    <label key={option.id} className="filter-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.types.includes(option.id)}
                                            onChange={() => handleTypeToggle(option.id)}
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="filter-group">
                                <span className="filter-group-title">Relance</span>
                                {resendOptions.map((option) => (
                                    <label key={option.id} className="filter-item">
                                        <input
                                            type="checkbox"
                                            checked={filters.resends.includes(option.id)}
                                            onChange={() => handleResendToggle(option.id)}
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>

                            {(filters.statuses.length > 0 || filters.types.length > 0 || filters.resends.length > 0) && (
                                <div className="filter-footer">
                                    <button
                                        type="button"
                                        className="filter-reset-btn"
                                        onClick={() => onFilterChange({ statuses: [], types: [], resends: [] })}
                                    >
                                        Tout effacer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <Button shape="rectangle" href="/applications">
                    <span>Voir plus</span>
                </Button>
            </div>
        </div>
    )
}

export default ApplicationsHeader