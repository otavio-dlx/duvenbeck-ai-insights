import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  departments: string[];
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedDay: string;
  onDayChange: (value: string) => void;
  onReset: () => void;
  // Optional tag filter support
  tags?: string[];
  selectedTag?: string;
  onTagChange?: (value: string) => void;
}

export const FilterPanel = ({
  departments,
  selectedDepartment,
  onDepartmentChange,
  selectedDay,
  onDayChange,
  onReset,
  tags,
  selectedTag,
  onTagChange,
}: FilterPanelProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">{t('filters.title')}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t('filters.department')}</Label>
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">{t('filters.allDepartments')}</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* If tags are provided, render a tag selector instead of day selector */}
  {tags && tags.length > 0 && onTagChange ? (
          <div className="space-y-2">
            <Label>{t('filters.tag') || 'Tag'}</Label>
            <Select value={selectedTag || 'all'} onValueChange={onTagChange}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">{t('filters.allTags') || 'All tags'}</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>{t('filters.day')}</Label>
            <Select value={selectedDay} onValueChange={onDayChange}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">{t('filters.allDays')}</SelectItem>
                <SelectItem value="day1">{t('common.day1')}</SelectItem>
                <SelectItem value="day2">{t('common.day2')}</SelectItem>
                <SelectItem value="day3">{t('common.day3')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={onReset} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          {t('filters.reset')}
        </Button>
      </div>
    </Card>
  );
};
