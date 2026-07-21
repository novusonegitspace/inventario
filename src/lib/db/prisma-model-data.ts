import { Prisma } from "@prisma/client";

function getModelFieldNames(modelName: string) {
  const model = Prisma.dmmf.datamodel.models.find((item) => item.name === modelName);

  if (!model) {
    return new Set<string>();
  }

  return new Set(model.fields.map((field) => field.name));
}

export function filterPrismaModelData<T extends Record<string, unknown>>(
  modelName: string,
  data: T,
) {
  const fieldNames = getModelFieldNames(modelName);

  if (fieldNames.size === 0) {
    return data;
  }

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => fieldNames.has(key)),
  ) as Partial<T>;
}

