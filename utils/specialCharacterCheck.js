export function containsSpecialCharacters(inputString) {
  const specialCharacters = ['<', '>', '[', ']', '{', '}', '&', "'", '"'];

  for (let i = 0; i < inputString.length; i++) {
    if (specialCharacters.includes(inputString[i])) {
      return true;
    }
  }

  return false;
}
