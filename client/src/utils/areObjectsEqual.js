export default function areObjectsEqual(obj1, obj2) {
    const commonKeys = Object.keys(obj1).filter(key => obj2.hasOwnProperty(key));

    for (const key of commonKeys) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  
    return true;
}