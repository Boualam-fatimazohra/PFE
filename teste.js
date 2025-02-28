const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

console.log(passwordRegex.test("Test@123")); // Doit retourner true
console.log(passwordRegex.test("test1234")); // Doit retourner false (pas de majuscule et caractère spécial)
console.log(passwordRegex.test("TEST@123")); // Doit retourner false (pas de minuscule)
