function CreateUser (name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
}

CreateUser.prototype.isValidName = function (name) {
    if (!name) return false;
    if (name.length <3) return 'Nome deve ter pelo menos 3 caracteres';
    
    const cleanedName = name.trim();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (!nameRegex.test(cleanedName)) return 'Nome deve conter apenas letras e espaços';

    return name
};