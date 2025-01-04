// Удаление свойств объекта | Delete object properties
export function deleteProps(obj) {
  if (!obj) return;
  
  for (const key of Object.keys(obj)) {
    try {
      obj[key] = null;
      delete obj[key];
    } catch {
      continue;
    }
  }
}
