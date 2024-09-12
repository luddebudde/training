export function deepCloneWithFunctions<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    // If it's not an object (e.g., function, number, string, null, etc.), return it directly
    return obj;
  }

  if (Array.isArray(obj)) {
    // Handle array separately to recursively deep clone each element
    return obj.map((item) => deepCloneWithFunctions(item)) as unknown as T;
  }

  const clonedObj = {} as T;

  // Loop over the object properties
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as any)[key];

      // Recursively clone non-function objects, or directly assign functions
      (clonedObj as any)[key] =
        typeof value === "function" ? value : deepCloneWithFunctions(value);
    }
  }

  return clonedObj;
}
