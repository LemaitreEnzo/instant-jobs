import { useEffect, useMemo, useState } from "react";
import "../../assets/css/pages/student/mySchool.css";
import FilterBar from "../../components/layout/FilterBar/FilterBar";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import Pagination from "../../components/layout/Pagination/Pagination";
import SchoolCard from "../../components/ui/SchoolCard/SchoolCard";
import SmallProfile from "../../components/ui/SmallProfile/SmallProfile";
import { useAuth } from "../../context/AuthContext";
import useOrganization from "../../hooks/useOrganization";
import type { Organization } from "../../interfaces/models.interface";
import type { Student } from "../../interfaces/user.interface";
import { UserRole } from "../../types/enum.type";
import type { FilterGroup, SortOption } from "../../types/props.type";

/**
 * Student school directory page.
 * Displays details of the student's training organization along with the list of fellow student profiles.
 */
function MySchool() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { fetchUsers, fetchOne } = useOrganization();
  const [paginatedStudents, setPaginatedStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch students belonging to the current user's organization
        if (user) {
          const usersData = await fetchUsers(parseInt(user.organizationId));
          const organizationData = await fetchOne(
            parseInt(user.organizationId),
          );
          const studentDataOnly = usersData.filter((user): user is Student => {
            return user.role === UserRole.STUDENT;
          });
          setOrganization(organizationData);
          setStudents(studentDataOnly);
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

    const selectedCampus = activeFilters["campus"] || [];
    if (selectedCampus.length > 0) {
      result = result.filter((s) => selectedCampus.includes(s.campus.name));
    }

    return result;
  }, [students, activeFilters]);

  const [prevFilters, setPrevFilters] = useState(activeFilters);

  if (activeFilters !== prevFilters) {
    setPrevFilters(activeFilters);
    setCurrentPage(1);
  }

  const filterGroups: FilterGroup[] = useMemo(() => {
    const uniqueCampusName = Array.from(
      new Set(students.map((s) => s.campus.name)),
    );

    return [
      {
        id: "campus",
        title: "Campus",
        options: uniqueCampusName.map((name) => ({
          id: name,
          label: name,
        })),
      },
    ];
  }, [students]);

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
          />
        </div>

        <div className="my-school-students">
          {paginatedStudents.length > 0 &&
            paginatedStudents.map((student, index) => {
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
      </div>
    );
  } else {
    return <div className="my-school">loading</div>;
  }
}

export default MySchool;
