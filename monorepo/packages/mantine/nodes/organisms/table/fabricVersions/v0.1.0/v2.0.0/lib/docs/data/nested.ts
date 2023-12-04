import { sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { DataTableSortStatus } from '~/../package';
import delay from '~/lib/delay';
import useIsMounted from '~/lib/useIsMounted';
import { companies as companyData, departments as departmentData, employees } from './index';

// Departments with employees count
export const departments = departmentData.map((department) => ({
  ...department,
  employees: employees.filter((employee) => employee.department.id === department.id)?.length || 0,
}));

// Companies with employees count
export const companies = companyData.map((company) => ({
  ...company,
  employees: departments
    .filter((department) => department.company.id === company.id)
    .reduce((sum, department) => sum + department.employees, 0),
}));

// Employees
export { employees };

// Hook simulating async companies fetching
export function useCompaniesAsync({ sortStatus }: { sortStatus: DataTableSortStatus }) {
  const isMounted = useIsMounted();
  const [records, setRecords] = useState<typeof companies>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMounted()) {
      (async () => {
        setLoading(true);
        await delay({ min: 500, max: 800 });
        if (isMounted()) {
          const newRecords = sortBy(
            companies,
            sortStatus.columnAccessor === 'details' ? 'employees' : sortStatus.columnAccessor
          );
          if (sortStatus.direction === 'desc') newRecords.reverse();
          setRecords(newRecords);
          setLoading(false);
        }
      })();
    }
  }, [isMounted, sortStatus]);

  return { records, loading };
}

// Hook simulating async departments fetching by company id
export function useDepartmentsAsync({
  companyId,
  sortStatus,
}: {
  companyId: string;
  sortStatus?: DataTableSortStatus;
}) {
  const isMounted = useIsMounted();
  const [records, setRecords] = useState<typeof departments>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMounted()) {
      (async () => {
        setLoading(true);
        await delay({ min: 500, max: 800 });
        if (isMounted()) {
          let newRecords = departments.filter((department) => department.company.id === companyId);
          if (sortStatus) {
            newRecords = sortBy(
              newRecords,
              sortStatus.columnAccessor === 'details' ? 'employees' : sortStatus.columnAccessor
            );
            if (sortStatus.direction === 'desc') newRecords.reverse();
          }
          setRecords(newRecords);
          setLoading(false);
        }
      })();
    }
  }, [companyId, isMounted, sortStatus]);

  return { records, loading };
}

// Hook simulating async employees fetching by department id
export function useEmployeesAsync({
  departmentId,
  sortStatus,
}: {
  departmentId: string;
  sortStatus?: DataTableSortStatus;
}) {
  const isMounted = useIsMounted();
  const [records, setRecords] = useState<typeof employees>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMounted()) {
      (async () => {
        setLoading(true);
        await delay({ min: 500, max: 800 });
        if (isMounted()) {
          let newRecords = employees.filter((employee) => employee.department.id === departmentId);
          if (sortStatus) {
            newRecords = sortBy(
              newRecords,
              sortStatus.columnAccessor === 'name'
                ? ({ firstName, lastName }) => `${firstName} ${lastName}`
                : 'birthDate'
            );
            if (sortStatus.direction === 'desc') newRecords.reverse();
          }
          setRecords(newRecords);
          setLoading(false);
        }
      })();
    }
  }, [departmentId, isMounted, sortStatus]);

  return { records, loading };
}
