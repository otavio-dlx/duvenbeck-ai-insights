import { useCallback, useMemo, useState } from "react";

export interface UseFiltersResult {
  selectedDepartment: string;
  selectedDay: string;
  setSelectedDepartment: (v: string) => void;
  setSelectedDay: (v: string) => void;
  reset: () => void;
  filterParticipants: <T extends { groupName?: string; day1?: unknown; day2?: unknown; day3?: unknown }>(items: T[]) => T[];
  filterIdeas: <T extends { department?: string }>(ideas: T[]) => T[];
}

export function useFilters(initialDepartment = "all", initialDay = "all"): UseFiltersResult {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment);
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);

  const reset = useCallback(() => {
    setSelectedDepartment("all");
    setSelectedDay("all");
  }, []);

  const filterParticipants = useCallback(
    (items) => {
      return items.filter((p) => {
        const deptMatch = selectedDepartment === "all" || p.groupName === selectedDepartment;
        const dayMatch =
          selectedDay === "all" ||
          (selectedDay === "day1" && p.day1) ||
          (selectedDay === "day2" && p.day2) ||
          (selectedDay === "day3" && p.day3);
        return deptMatch && dayMatch;
      });
    },
    [selectedDepartment, selectedDay]
  );

  const filterIdeas = useCallback(
    (ideas) => {
      return selectedDepartment === "all"
        ? ideas
        : ideas.filter((idea) => idea.department === selectedDepartment);
    },
    [selectedDepartment]
  );

  return useMemo(
    () => ({
      selectedDepartment,
      selectedDay,
      setSelectedDepartment,
      setSelectedDay,
      reset,
      filterParticipants,
      filterIdeas,
    }),
    [selectedDepartment, selectedDay, reset, filterParticipants, filterIdeas]
  );
}
