import { useEffect, useMemo, useState } from "react";
import "../../assets/css/pages/admin/school.css";
import UserFormModal from "../../components/forms/UserFormModal";
import FilterBar from "../../components/layout/FilterBar/FilterBar";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import Pagination from "../../components/layout/Pagination/Pagination";
import SchoolCard from "../../components/ui/SchoolCard/SchoolCard";
import SmallProfile from "../../components/ui/SmallProfile/SmallProfile";
import { useAuth } from "../../context/AuthContext";
import useOrganization from "../../hooks/useOrganization";
import type { Staff, Student } from "../../interfaces/user.interface";
import { UserRole } from "../../types/enum.type";
import type {
  FilterGroup,
  FilterOption,
  SortOption,
} from "../../types/props.type";

/**
 * Administration page for schools and campuses.
 * Displays organization overview and manages affiliated students and staff.
 */
function School() {
  const { user, organization } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const { fetchUsers, fetchOne } = useOrganization();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedStudents, setPaginatedStudents] = useState<Student[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const usersData = await fetchUsers(parseInt(user.organizationId));

          const filteredUsers = usersData.filter((user): boolean => {
            return user.role === UserRole.STUDENT;
          });

          const studentUsers = filteredUsers as Student[];

          if (user.role === UserRole.STAFF) {
            const userStaff = user as Staff;
            const filteredStudents = studentUsers.filter((student) => {
              return student.campus.id === userStaff.campus.id;
            });

            setStudents(filteredStudents);
          } else {
            setStudents(studentUsers);
          }
        } else {
          throw new Error("No user found");
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, [fetchOne, fetchUsers, user]);

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const sortOptions: SortOption[] = useMemo(
    () => [{ label: "Date d'envoi", value: "date" }],
    [],
  );

  const filteredAndSortedStudents = useMemo(() => {
    if (!students) return [];
    let result = [...students];

    if (user && user.role !== UserRole.STAFF) {
      const selectedCampus = activeFilters["campus"] || [];
      if (selectedCampus.length > 0) {
        result = result.filter((s) => selectedCampus.includes(s.campus.name));
      }
    }

    const selectedPromotions = activeFilters["promotion"] || [];
    if (selectedPromotions.length > 0) {
      result = result.filter((s) =>
        selectedPromotions.includes(s.promotion.name),
      );
    }

    const selectedSpecilaties = activeFilters["speciality"] || [];
    if (selectedSpecilaties.length > 0) {
      result = result.filter(
        (s) => s.speciality && selectedSpecilaties.includes(s.speciality.name),
      );
    }

    const selectedSubSpecilaties = activeFilters["subSpeciality"] || [];
    if (selectedSubSpecilaties.length > 0) {
      result = result.filter(
        (s) =>
          s.subSpeciality &&
          selectedSubSpecilaties.includes(s.subSpeciality.name),
      );
    }

    return result;
  }, [students, activeFilters, user]);

  const [prevFilters, setPrevFilters] = useState(activeFilters);

  if (activeFilters !== prevFilters) {
    setPrevFilters(activeFilters);
    setCurrentPage(1);
  }

  const filterGroups: FilterGroup[] = useMemo(() => {
    if (!students) return [];

    const unique = (values: (string | undefined | null)[]): string[] =>
      Array.from(new Set(values.filter((v): v is string => Boolean(v))));

    const toOptions = (names: string[]): FilterOption[] =>
      names.map((name) => ({ id: name, label: name }));

    const groups: FilterGroup[] = [
      {
        id: "campus",
        title: "Campus",
        options: toOptions(unique(students.map((s) => s.campus?.name))),
      },
      {
        id: "promotion",
        title: "Promotion",
        options: toOptions(unique(students.map((s) => s.promotion?.name))),
      },
      {
        id: "speciality",
        title: "Spécialité",
        options: toOptions(unique(students.map((s) => s.speciality?.name))),
      },
      {
        id: "subSpeciality",
        title: "Sous-spécialité",
        options: toOptions(unique(students.map((s) => s.subSpeciality?.name))),
      },
    ];

    return user?.role === UserRole.STAFF
      ? groups.filter((group) => group.id !== "campus")
      : groups;
  }, [students, user]);

  if (students && organization) {
    return (
      <div className="my-school">
        <SchoolCard data={organization} />

        <div className="top">
          <PageTitle title="Mon école" />
          <FilterBar
            filterGroups={filterGroups}
            onFilterChange={setActiveFilters}
            sortOptions={sortOptions}
            onAddClick={() => setIsCreateModalOpen(true)}
          />
        </div>

        <div className="my-school-students">
          {paginatedStudents.map((student, index) => {
            return <SmallProfile key={index} data={student} />;
          })}
        </div>
        <Pagination
          data={filteredAndSortedStudents}
          itemsPerPage={4}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onDataChange={setPaginatedStudents}
        />

        <UserFormModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          lockedCampusId={
            user?.role === UserRole.STAFF
              ? (user as Staff).campus.id
              : undefined
          }
        />
      </div>
    );
  } else {
    return <div className="my-school">loading</div>;
  }
}

export default School;
