import type { MultiSelectOption } from '@shared/ui/form-multi-select-field';

/**
 * Выдает доступные child options для выбранных parent ids (multi-select).
 * childOptionsByParentId: { [parentId]: MultiSelectOption[] }
 */
export const getLinkedOptions = (
  selectedParentIds: string[],
  childOptionsByParentId: Record<string, MultiSelectOption[]>,
): MultiSelectOption[] => {
  if (selectedParentIds.length === 0) return [];

  // дедупликация по value, чтобы не было дублей
  const unique = new Map<string, MultiSelectOption>();

  for (const parentId of selectedParentIds) {
    const list = childOptionsByParentId[parentId] ?? [];
    for (const opt of list) unique.set(String(opt.value), opt);
  }

  return Array.from(unique.values());
};

/**
 * Чистит выбранные child values: оставляет только те, что есть среди allowed options.
 */
export const sanitizeLinkedSelection = (
  selectedChildValues: string[],
  allowedChildOptions: MultiSelectOption[],
): string[] => {
  const allowed = new Set(allowedChildOptions.map((o) => String(o.value)));
  return selectedChildValues.filter((v) => allowed.has(String(v)));
};
