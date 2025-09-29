export function deepCloneWithFunctions<T>(obj: T, seen = new Map()): T {
  if (obj === null || typeof obj !== "object") {
    // If it's not an object (e.g., function, number, string, null, etc.), return it directly
    return obj;
  }

  if (seen.has(obj)) {
    // Return the previously cloned object to avoid cyclic references
    return seen.get(obj) as T;
  }

  let clonedObj: any;

  if (Array.isArray(obj)) {
    // Handle array separately to recursively deep clone each element
    clonedObj = obj.map((item) => deepCloneWithFunctions(item, seen));
  } else {
    clonedObj = {};
    // Keep track of the clone to handle cycles
    seen.set(obj, clonedObj);

    // Loop over the object properties
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as any)[key];
        // Recursively clone non-function objects, or directly assign functions
        (clonedObj as any)[key] =
          typeof value === "function"
            ? value
            : deepCloneWithFunctions(value, seen);
      }
    }
  }

  return clonedObj as T;
}
