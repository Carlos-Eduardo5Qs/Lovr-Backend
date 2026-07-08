function CreateUser (name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
}

CreateUser.prototype.init = function () {
    const id = 15; // Simulação de ID gerado pelo banco de dados
    const name = this.isValidName(this.name);
    const email = this.isValidEmail(this.email);
    const password = this.isValidPassword(this.password);

    return { id, name, email, password };
};

CreateUser.prototype.isValidName = function (name) {
    if (!name) return false;
    if (name.length < 3) throw new Error('Nome deve ter pelo menos 3 caracteres');

    const cleanedName = name.trim();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (!nameRegex.test(cleanedName)) throw new Error('Nome deve conter apenas letras e espaços');

    return name
};

CreateUser.prototype.isValidEmail = function (email) {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) throw new Error('Email inválido');

    return email;
};

CreateUser.prototype.isValidPassword = function (password) {
    if (!password) return false;
    if (password.length < 8) throw new Error('Senha deve ter pelo menos 8 caracteres');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/;

    if (!passwordRegex.test(password)) throw new Error('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial');

    for (let i = 0; i < password.length -2; i ++) {
        const current = password[i];
        const next = password[i + 1];
        const last = password[i + 2];

        if (
            current >= '0' && current <= '9' &&
            next >= '0' && next <= '9' &&
            last >= '0' && last <= '9'
        ) {
            if (
                (Number(next) === Number(current) + 1 && Number(last) === Number(next) + 1) ||
                (Number(next) === Number(current) - 1 && Number(last) === Number(next) - 1)
            ) throw new Error('A senha não deve conter sequências de 3 ou mais números consecutivos');
        }
    }

    return password;
};

module.exports = CreateUser;